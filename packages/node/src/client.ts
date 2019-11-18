import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { createLogger, format, transports, Logger } from 'winston'
import isRetryAllowed from './is-retry-allowed'
import crypto from 'crypto'

const { combine, timestamp, label, prettyPrint } = format
const DEFAULT_TIMEOUT = 5 * 1000 // 5 seconds
const DEFAULT_NUM_RETRIES = 2
const DEFAULT_RETRY_DURATION = 500
const DEFAULT_MAX_RETRY_DELAY = 2000

// TODO: write documentation
class Bearer {
  protected readonly secretKey: string
  protected options: BearerClientOptions = {
    host: 'https://proxy.bearer.sh',
    httpClientSettings: { timeout: DEFAULT_TIMEOUT }
  }

  constructor(secretKey: string, options?: BearerClientOptions) {
    this.options = { ...this.options, ...options }
    this.secretKey = secretKey
  }

  public integration(integrationId: string, httpClientSettings: AxiosRequestConfig = { timeout: DEFAULT_TIMEOUT }) {
    this.options.httpClientSettings = { ...this.options.httpClientSettings, ...httpClientSettings }

    return new BearerClient(integrationId, this.options, this.secretKey)
  }
}

export class BearerClient {
  protected readonly client: AxiosInstance = axios
  private requestState: Record<string, { numRetries: number; request: any }> = {}
  private numRetries: number
  private retryDuration: number
  private maxRetryDelay: number

  public readonly loggerTransports = {
    console: new transports.Console({ level: 'info' })
  }

  public readonly logger: Logger = createLogger({
    format: combine(label({ label: 'bearer' }), timestamp(), prettyPrint()),
    transports: [this.loggerTransports.console]
  })

  constructor(
    readonly integrationId: string,
    readonly options: BearerClientOptions,
    readonly secretKey: string,
    readonly setupId?: string,
    readonly authId?: string
  ) {
    const retrySettings = {
      numRetries: DEFAULT_NUM_RETRIES,
      retryDuration: DEFAULT_RETRY_DURATION,
      maxRetryDelay: DEFAULT_MAX_RETRY_DELAY,

      ...(options.retrySettings || {})
    }

    this.numRetries = retrySettings.numRetries
    this.retryDuration = retrySettings.retryDuration
    this.maxRetryDelay = retrySettings.maxRetryDelay

    if (this.options.timeout) {
      console.warn('DEPRECATION WARNING: Please use `httpClientSettings`. `timeout` is deprecated')
    }
    this.client = axios.create({
      timeout: this.options.timeout || DEFAULT_TIMEOUT,
      ...this.options.httpClientSettings
    })
    this.client.interceptors.response.use(this.interceptResponse, this.interceptErrorResponse)
  }

  public auth = (authId: string) => {
    return new BearerClient(this.integrationId, this.options, this.secretKey, this.setupId, authId)
  }

  public setup = (setupId: string) => {
    return new BearerClient(this.integrationId, this.options, this.secretKey, setupId, this.authId)
  }

  public authenticate = this.auth // Alias

  /**
   * HTTP methods
   */

  public get = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('GET', endpoint, parameters, options)
  }

  public head = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('HEAD', endpoint, parameters, options)
  }

  public post = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('POST', endpoint, parameters, options)
  }

  public put = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('PUT', endpoint, parameters, options)
  }

  public delete = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('DELETE', endpoint, parameters, options)
  }

  public patch = <DataReturned = any>(endpoint: string, parameters?: BearerRequestParameters, options?: any) => {
    return this.request<DataReturned>('PATCH', endpoint, parameters, options)
  }

  public request = <TData = any>(
    method: BearerRequestMethod,
    endpoint: string,
    parameters?: BearerRequestParameters,
    options?: BearerRequestOptions
  ) => {
    if (parameters && typeof parameters !== 'object') {
      throw new InvalidRequestOptions()
    }

    const pkg = require('../package.json')
    const preheaders: BearerHeaders = {
      Authorization: this.secretKey,
      'User-Agent': `Bearer-Node (${pkg.version})`,
      'Bearer-Auth-Id': this.authId!,
      'Bearer-Setup-Id': this.setupId!
    }

    if (parameters && parameters.headers) {
      for (const key in parameters.headers) {
        preheaders[key] = parameters.headers[key]
      }
    }

    const headers = Object.keys(preheaders).reduce(
      (acc, key) => {
        const header = preheaders[key]

        if (header !== undefined && header !== null) {
          acc[key] = preheaders[key]
        }

        return acc
      },
      {} as any
    )

    const baseURL = `${this.options.host}/${this.integrationId}`
    const requestParams = parameters && parameters.query
    const payload = parameters && parameters.body

    this.logger.debug('sending request', {
      method,
      headers,
      baseURL,
      url: endpoint,
      params: requestParams,
      data: payload
    })

    const config = {
      method,
      headers,
      baseURL,
      url: endpoint,
      params: requestParams,
      data: payload
    }

    const hash = this.makeHash({ ...config, url: `${baseURL}${endpoint}` })
    const state = this.getRequestState(hash)

    state.request = () => {
      return this.client.request<TData>(config)
    }
    state.numRetries = DEFAULT_NUM_RETRIES
    this.requestState[hash] = state
    return state.request()
  }

  private interceptErrorResponse = (error: any): Promise<unknown> => {
    const hash = this.makeHash(error.config)
    this.logger.warn(`Retrying request: ${hash}`)

    const state = this.getRequestState(hash)

    if (isRetryAllowed(error) && state.numRetries > 0) {
      state.numRetries = state.numRetries - 1
      return new Promise(resolve =>
        setTimeout(() => resolve(state.request()), this.sleepMilliseconds(state.numRetries))
      )
    }
    this.logger.warn(`Giving up, num retries ${this.numRetries} exceeded`)
    return Promise.reject(error)
  }
  private interceptResponse = (response: AxiosResponse) => {
    delete this.requestState[this.makeHash(response.config)]

    const requestId = response.headers['bearer-request-id']
    this.logger.info(`request id: ${requestId}`)
    return response
  }
  private getRequestState = (hash: string): { numRetries: number; request: any } => {
    return (this.requestState[hash] || {}) as { numRetries: number; request: any }
  }

  private sleepMilliseconds(numRetries: number): number {
    let sleepTime = this.retryDuration * (2 ** (this.numRetries - numRetries) - 1)

    sleepTime = Math.min(sleepTime, this.maxRetryDelay)

    // Apply some jitter by randomizing the value in the range of
    // (sleep_seconds / 2) to (sleep_seconds).
    sleepTime *= 0.5 * (1 + Math.random())
    this.logger.info(`Sleeping: ${sleepTime}`)
    return sleepTime
  }
  private makeHash(config: {
    url?: string
    method?: string
    params?: string | Record<string, string | number>
    data?: any
  }) {
    const { url, method, params, data } = config
    const str = [url, method, params, data]
      .map(x => JSON.stringify(x))
      .join('')
      .toLowerCase()
    return crypto
      .createHash('md5')
      .update(str)
      .digest('hex')
  }
}

/**
 * Types
 */

type BearerHeaders = Record<string, string | number | undefined>
type BearerRequestMethod = AxiosRequestConfig['method']

interface BearerRequestParameters {
  headers?: BearerHeaders
  query?: string | Record<string, string | number>
  body?: any
}

type BearerRequestOptions = any
type BearerClientOptions = {
  host: string
  timeout?: number
  httpClientSettings?: AxiosRequestConfig
  retrySettings?: RetrySettings
}

type RetrySettings = {
  retryDuration?: number
  numRetries?: number
  maxRetryDelay?: number
}

/**
 * Errors handling
 */

class InvalidAPIKey extends Error {
  constructor(token: any) {
    super(`Invalid Bearer API key provided.  Value: ${token} \
You'll find you API key at this location: https://app.bearer.sh/keys`)
  }
}

class InvalidRequestOptions extends Error {
  constructor() {
    super(`Unable to trigger API request. Request parameters should be an object \
in the form "{ headers: { "Foo": "bar" }, body: "My body" }"`)
  }
}

/**
 * Exports
 */

export default (apiKey: string | undefined, options?: BearerClientOptions): Bearer => {
  if (!apiKey) {
    throw new InvalidAPIKey(apiKey)
  }

  return new Bearer(apiKey, options)
}

export { Bearer as bearer }
