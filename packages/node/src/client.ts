import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { createLogger, format, transports, Logger } from 'winston'

import { AuthDetails, translateAuthDetails } from './auth-details'

const { combine, timestamp, label, prettyPrint } = format
const DEFAULT_TIMEOUT = 5 * 1000 // 5 seconds

const pkg = require('../package.json')
const userAgent = `Bearer-Node (${pkg.version})`

// TODO: write documentation
class Bearer {
  protected readonly secretKey: string
  protected options: BearerClientOptions = {
    authHost: 'https://auth.bearer.sh',
    host: 'https://proxy.bearer.sh',
    httpClientSettings: { timeout: DEFAULT_TIMEOUT }
  }

  constructor(secretKey: string, options?: Partial<BearerClientOptions>) {
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
    if (this.options.timeout) {
      console.warn('DEPRECATION WARNING: Please use `httpClientSettings`. `timeout` is deprecated')
    }
    this.client = axios.create({
      timeout: this.options.timeout || DEFAULT_TIMEOUT,
      ...this.options.httpClientSettings
    })

    this.client.interceptors.response.use((response: AxiosResponse) => {
      const requestId = response.headers['bearer-request-id']
      this.logger.info(`request id: ${requestId}`)
      return response
    })
  }

  public auth = (authId: string) => {
    return new BearerClient(this.integrationId, this.options, this.secretKey, this.setupId, authId)
  }

  public setup = (setupId: string) => {
    return new BearerClient(this.integrationId, this.options, this.secretKey, setupId, this.authId)
  }

  public authenticate = this.auth // Alias

  /**
   * `getAuth` retrieve the auth information (eg. access token) for the current identity.
   *
   * You must call `auth` prior to calling this function
   */
  public getAuth = async (): Promise<AuthDetails> => {
    if (!this.authId) {
      throw new MissingAuthId()
    }

    const url = `${this.options.authHost}/apis/${this.integrationId}/auth/${this.authId}`
    const response = await this.client.get(url, {
      headers: {
        Authorization: this.secretKey,
        'User-Agent': userAgent
      }
    })

    return translateAuthDetails(response.data)
  }

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

    const preheaders: BearerHeaders = {
      Authorization: this.secretKey,
      'User-Agent': userAgent,
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

    return this.client.request<TData>({
      method,
      headers,
      baseURL,
      url: endpoint,
      params: requestParams,
      data: payload
    })
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

interface BearerClientOptions {
  authHost: string
  host: string
  timeout?: number
  httpClientSettings: AxiosRequestConfig
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

class MissingAuthId extends Error {
  constructor() {
    super('No authId has been set. Please call `auth`')
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
