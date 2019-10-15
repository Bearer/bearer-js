import http, { RequestOptions, IncomingMessage, ClientRequest } from 'http'
import https from 'https'
import { URL, UrlWithParsedQuery, format } from 'url'
import { logger as debug } from './logger'
import { enqueue } from './report'

import { VERBOSE_MODE, REPORT_HOST } from './constants'

const logger = debug.extend('hijack')

export const hijack = (module: typeof http | typeof https) => {
  const _request = module.request

  function request(options: UrlOrOptions, callback?: (res: IncomingMessage) => void): ClientRequest
  function request(url: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest
  function request(
    _urlOrOptions: UrlOrOptions,
    _callbackOrOptions?: CallbackOrOptions,
    _callbackArg?: Callback
  ): ClientRequest {
    const url: UrlWithParsedQuery | RequestOptions =
      typeof _urlOrOptions === 'string' ? new URL(_urlOrOptions) : _urlOrOptions
    // let's ensure the hostname is present
    url.hostname = url.hostname || url.host

    const urlAsOptions: ReportBase = {
      protocol: url.protocol!,
      path: url.path || (url as URL).pathname,
      hostname: url.hostname! || url.host!,
      method: url.method || 'GET',
      startedAt: Date.now() // overridden later
    }

    logger('processing request: %j', urlAsOptions)

    if (urlAsOptions.hostname === REPORT_HOST || urlAsOptions.hostname.match(/\.bearer\.sh$/)) {
      logger('sending request to bearer: %j', urlAsOptions)
      // @ts-ignore
      return _request.apply(this, arguments)
    }

    const callback = typeof _callbackOrOptions === 'function' ? _callbackOrOptions : _callbackArg

    function report(type: string, data: Record<string, any>) {
      const payload = {
        ...urlAsOptions,
        ...data,
        type,
        url: url instanceof URL ? url.toString() : format(url)
      }
      logger('reporting: %j', payload)
      setImmediate(enqueue, payload)
    }

    function hook(res: IncomingMessage) {
      //  enable this one when we have verbose mode
      let data = ''
      const contentType = res.headers['content-type']
      if (VERBOSE_MODE) {
        res.on('data', chunk => {
          logger('receiving data')
          data += chunk
        })
      }
      res.on('error', () => {
        logger('response error')

        report('REQUEST_ERROR', {
          statusCode: res.statusCode,
          endedAt: Date.now()
        })
      })
      res.on('end', () => {
        if (/^application\/json/.test(contentType || '')) {
          try {
            data = JSON.parse(data)
          } catch (e) {
            logger('parsing error %s', data)
          }
        }
        report('REQUEST_END', {
          statusCode: res.statusCode,
          endedAt: Date.now(),
          data: VERBOSE_MODE ? data : undefined
        })
      })
      res.on('close', () => {
        logger('closing')
      })

      if (callback) {
        callback(res)
        // we consume the response so the actual end can fire.
      } else if (res && res.listenerCount('end') === 1) {
        res.resume()
      }
    }

    const args =
      typeof _callbackOrOptions === 'function' || !_callbackOrOptions ? [url, hook] : [url, _callbackOrOptions, hook]
    // @ts-ignore
    const req = _request.apply(this, args)

    req
      .on('socket', () => {
        logger('start request')
        urlAsOptions.startedAt = Date.now() // a default
      })
      .on('end', () => {
        logger('request end')
      })
      .on('error', (error: { code: string; errno: string }) => {
        // ECONNRESET or ECONNREFUSED
        report('REQUEST_ERROR', {
          error,
          endedAt: Date.now()
        })
      })
      .on('timeout', () => {
        report('REQUEST_TIMEOUT', {
          endedAt: Date.now()
        })
      })
    return req
  }

  module.request = request

  function get(): http.ClientRequest {
    // @ts-ignore
    const req = request.apply(this, arguments)
    req.end()
    return req
  }

  module.get = get

  return module
}

/**
 * Typing
 */

type UrlOrOptions = RequestOptions | string | URL
type Callback = { (res: IncomingMessage): void }
type CallbackOrOptions = Callback | RequestOptions

type ReportBase = {
  protocol: string
  path: string
  hostname: string
  method: string
  startedAt: number
}
