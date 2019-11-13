import { parse, URL, format, UrlWithParsedQuery } from 'url'
import http, { RequestOptions, IncomingMessage, ClientRequest } from 'http'
import { Configuration } from './config'
import { logger } from './logger'
import { enqueue, ReportLog, FullReportLog, RestrictedReportLog } from './report'

export const hijack = (module: typeof http) => {
  const originalRequest = module.request

  function request(
    urlOrOptions: string | URL,
    optionsOrCallback: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest {
    const req = originalRequest.apply(this, arguments)
    // Let's make sure it does not crash the app
    const { url, options, method, fullUrl } = extractRequest(urlOrOptions, optionsOrCallback)
    if (trackableurl(options.hostname)) {
      const isVerbose = Configuration.getConfig('logLevel') === 'ALL'
      const startedAt = Date.now()
      logger.debug('request: url=%s method=%s query=%j headers=%j', url, method, options.query, options.headers)

      function report({
        statusCode,
        type,
        extra
      }: {
        statusCode: number
        type: ReportLog['type']
        extra?: VerboseParams
      }) {
        const report = {
          ...extra,
          startedAt,
          method,
          statusCode,
          type,
          url: fullUrl(),
          endedAt: Date.now(),
          hostname: options.hostname,
          path: options.path,
          port: options.port,
          protocol: options.protocol
        }

        enqueue(report as ReportLog)
      }
      // @ts-ignore
      const verboseData: VerboseParams = {}

      if (isVerbose) {
        verboseData.requestHeaders = filterObject(options.headers)
        // wont work for chunked body
        const _write = req.write
        req.write = function(chunk: Buffer) {
          const encoding = typeof arguments[1] === 'string' ? arguments[1] : undefined
          verboseData.requestBody = chunk.toString(encoding)
          _write.apply(req, arguments)
        }
      }

      const _emit = req.emit
      req.emit = function(eventName: string, res?: IncomingMessage) {
        switch (eventName) {
          case 'response': {
            let data: string

            if (isVerbose) {
              // extra = {}
              res!.on('data', chunk => {
                if (!data) {
                  data = ''
                }
                data += chunk
              })
            }

            res!.on('end', () => {
              logger.debug('request end for %s', url)
              if (isVerbose) {
                verboseData.responseHeaders = res!.headers
                verboseData.responseBody = data
              }
              report({
                type: 'REQUEST_END', // # REQUEST_ERROR | REQUEST_END
                statusCode: res!.statusCode!,
                extra: isVerbose ? verboseData : undefined
              })
            })
            break
          }
          case 'error': {
            // @ts-ignore
            report({
              type: 'REQUEST_ERROR',
              extra: isVerbose ? verboseData : undefined
            })
            logger.debug('request error for %s', url)
            break
          }
          case 'abort': {
            // TODO: report aborted request
            break
          }
        }

        return _emit.apply(req, arguments)
      }
    }
    return req
  }

  module.request = request as typeof module.request

  // Simple enough to be overridden that way
  module.get = function(url: any, options: any, cb?: any) {
    const req = module.request(url, options, cb)
    req.end()
    return req
  }
}

export function extractRequest(urlOrOptions: any, optionsOrCallback: any) {
  let options = typeof urlOrOptions === 'string' ? parse(urlOrOptions) : { ...urlOrOptions }
  if (typeof optionsOrCallback === 'object') {
    options = {
      ...options,
      ...optionsOrCallback
    }
  }
  const query = options.search || ''
  const protocol = options.protocol || 'http:'
  const hostname = options.hostname || options.host || 'localhost'
  const port = options.port
  const pathname = (options as UrlWithParsedQuery).pathname || options.path || '/'
  const headers = options.headers || {}
  const url = format({ protocol, hostname, port, pathname })

  return {
    url,
    fullUrl: () => [url, query].join(''),
    method: options.method || 'GET',
    options: {
      protocol,
      hostname,
      port,
      query,
      headers,
      path: pathname
    }
  }
}

const DEFAULT_IGNORE = ['bearer\\.sh', 'back\\.sqreen\\.io', '\\.nr-data\\.net', '\\.newrelic\\.com']

const DEFAULT_IGNORE_REGEXP = new RegExp(DEFAULT_IGNORE.join('|'))

function trackableurl(domain: string) {
  if (DEFAULT_IGNORE_REGEXP.test(domain)) {
    return false
  }
  if (Configuration.getConfig('reportHost') === domain) {
    return false
  }
  if (Configuration.getConfig('ignored').some((ignored: string) => ignored.includes(domain))) {
    return false
  }
  return true
}

const DEFAULT_FILTER = /authorization/i
const FILTERED = '[FILTERED]'
function filterObject(object: Record<string, any>) {
  return Object.keys(object).reduce(
    (acc, key) => {
      acc[key] = filteredKey(key) ? FILTERED : object[key]
      return acc
    },
    {} as Record<string, any>
  )
}

function filteredKey(key: string) {
  if (DEFAULT_FILTER.test(key)) {
    return true
  }
  // TODO: prepare regexp on initialization
  return Configuration.getConfig('filtered').some((filter: string) => new RegExp(filter).test(key))
}

type VerboseParams = Omit<FullReportLog, keyof RestrictedReportLog>
