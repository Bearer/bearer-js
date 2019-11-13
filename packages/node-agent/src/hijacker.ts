import { parse, URL, format, UrlWithParsedQuery } from 'url'
import http, { RequestOptions, IncomingMessage, ClientRequest, Agent } from 'http'
import { Configuration } from './config'
import { logger } from './logger'

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
    const emit = req.emit
    const { url, options, method } = extractRequest(urlOrOptions, optionsOrCallback)

    logger.debug('request: url=%s method=%s query=%j headers=%j', url, method, options.query, options.headers)

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
            console.log('response', res.statusCode, data)
          })
          break
        }
        case 'error': {
          // TODO: report error
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

    return req
  }
  // TODO: remove ts-ignore
  // @ts-ignore
  module.request = request
}

export function extractRequest(
  urlOrOptions: any,
  optionsOrCallback: any
): {
  url: string
  fullUrl: () => string
  method: string
  options: {
    headers: Record<string, string>
    query: string
  }
} {
  let options = typeof urlOrOptions === 'string' ? parse(urlOrOptions) : { ...urlOrOptions }
  if (typeof optionsOrCallback === 'object') {
    options = {
      ...options,
      ...optionsOrCallback
    }
  }
  const url = buildUrl(options)
  const query = options.search || ''
  return {
    url,
    fullUrl: () => [url, query].join(''),
    method: options.method || 'GET',
    options: {
      query,
      headers: options.headers || {}
    }
  }
}

function buildUrl(options: UrlWithParsedQuery | RequestOptions) {
  return format({
    protocol: options.protocol || 'http:',
    hostname: options.hostname || options.host || 'localhost',
    port: options.port,
    pathname: (options as UrlWithParsedQuery).pathname || options.path || '/'
  })
}
