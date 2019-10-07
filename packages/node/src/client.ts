import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

const DEFAULT_TIMEOUT = 5 * 1000 // 5 seconds

class Bearer {
  protected readonly secretKey: string
  protected options: BearerClientOptions = {
    host: 'https://int.bearer.sh',
    httpClientSettings: { timeout: DEFAULT_TIMEOUT }
  }

  constructor(secretKey: string, options?: BearerClientOptions) {
    this.options = { ...this.options, ...options }
    this.secretKey = secretKey
  }

  public integration(integrationId: string) {
    return new BearerClient(integrationId, this.options, this.secretKey)
  }
}

class BearerClient {
  protected readonly client: AxiosInstance = axios

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
        preheaders[`Bearer-Proxy-${key}`] = parameters.headers[key]
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

    return this.client.request<TData>({
      method,
      headers,
      baseURL: `${this.options.host}/api/v4/functions/backend/${this.integrationId}/bearer-proxy`,
      url: endpoint,
      params: parameters && parameters.query,
      data: parameters && parameters.body
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
type BearerClientOptions = { host: string; timeout?: number; httpClientSettings: AxiosRequestConfig }

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
