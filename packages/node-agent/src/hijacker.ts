import { parse, URL, format, UrlWithParsedQuery } from 'url'
import http, { RequestOptions, IncomingMessage, ClientRequest } from 'http'
import { Configuration } from './config'
import { logger } from './logger'
import { enqueue, ReportLog, FullReportLog, RestrictedReportLog } from './report'
const BEARER_URL = /bearer\.sh/i

export const hijack = (module: typeof http) => {
  const originalRequest = module.request

  function request(
    urlOrOptions: string | URL,
    optionsOrCallback: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest {
    const req = originalRequest.apply(this, arguments)
    // Let's make sure it does not crash the app
    const { url, options, method } = extractRequest(urlOrOptions, optionsOrCallback)
    if (options.hostname !== Configuration.getConfig('report_host') && !BEARER_URL.test(options.hostname)) {
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
          url,
          type,
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
        verboseData.requestHeaders = options.headers
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

type VerboseParams = Omit<FullReportLog, keyof RestrictedReportLog>
