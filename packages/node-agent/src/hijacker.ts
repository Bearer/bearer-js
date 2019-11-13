import { parse, URL, format, UrlWithParsedQuery } from 'url'
import http, { RequestOptions, IncomingMessage, ClientRequest, Agent } from 'http'
import { Configuration } from './config'
import { logger } from './logger'
import { enqueue, ReportLog } from './report'
const BEARER_URL = /bearer\.sh/i

export const hijack = (module: typeof http) => {
  const originalRequest = module.request

  // Simple enough to be overridden that way
  module.get = function(url: any, options: any, cb?: any) {
    const req = module.request(url, options, cb)
    req.end()
    return req
  }

  function request(
    urlOrOptions: string | URL,
    optionsOrCallback: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest {
    const req = originalRequest.apply(this, arguments)
    const { url, options, method } = extractRequest(urlOrOptions, optionsOrCallback)
    if (options.hostname !== Configuration.getConfig('report_host') && !BEARER_URL.test(options.hostname)) {
      const emit = req.emit
      const startedAt = Date.now()
      logger.debug('request: url=%s method=%s query=%j headers=%j', url, method, options.query, options.headers)
      function report({ statusCode, type }: { statusCode: number; type: ReportLog['type'] }) {
        const report = {
          startedAt,
          method,
          statusCode,
          url,
          endedAt: Date.now(),
          hostname: options.hostname,
          path: options.path,
          port: options.port,
          protocol: options.protocol
        }
        enqueue(report as ReportLog)
      }

      req.emit = function(eventName: string, res: IncomingMessage) {
        switch (eventName) {
          case 'response': {
            let data: string

            if (Configuration.getConfig('logLevel') === 'ALL') {
              res.on('data', chunk => {
                if (!data) {
                  data = ''
                }
                data += chunk
              })
            }

            res.on('end', () => {
              logger.debug('request end for %s', url)
              report({
                type: 'REQUEST_END', // # REQUEST_ERROR | REQUEST_END
                statusCode: res.statusCode!
              })
            })
            break
          }
          case 'error': {
            // TODO: report error
            logger.debug('request error for %s', url)
            // report({
            //   type: 'REQUEST_ERROR'
            //   statusCode: res.statusCode!
            // })
            break
          }
          case 'abort': {
            // TODO: report aborted request
            break
          }
          // case 'close':
        }

        return emit.apply(this, arguments)
      }
    }

    return req
  }
  // TODO: remove ts-ignore
  // @ts-ignore
  module.request = request
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
