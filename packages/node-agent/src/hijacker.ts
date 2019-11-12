import { parse, URL } from 'url'
import http, { RequestOptions, IncomingMessage, ClientRequest } from 'http'
import { Configuration } from './config'

export const hijack = (module: typeof http) => {
  const originalRequest = module.request

  // Simple enough to be overridden that way
  module.get = function(url: any, options: any, cb?: any) {
    const req = module.request(url, options, cb)
    req.end()
    return req
  }

  function request(
    url: string | URL,
    options: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest {
    const req = originalRequest.apply(this, arguments)
    const emit = req.emit
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
