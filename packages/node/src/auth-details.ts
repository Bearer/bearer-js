export class TokenData {
  public readonly active: boolean
  public readonly clientID: string
  public readonly expiresAt?: Date
  public readonly issuedAt: Date
  public readonly scopes?: string[]
  public readonly tokenType: TokenType
  public readonly value: string

  constructor(rawData: TokenRawData) {
    const expectScopes = rawData.token_type === 'bearer' || rawData.token_type === 'refresh'

    this.active = rawData.active
    this.clientID = rawData.client_id
    this.expiresAt = rawData.exp ? new Date(rawData.exp * 1000) : undefined
    this.issuedAt = new Date(rawData.iat * 1000)
    this.scopes = rawData.scope ? rawData.scope.split(' ') : expectScopes ? [] : undefined
    this.tokenType = rawData.token_type
    this.value = rawData.value
  }
}

const pick = <T, K extends keyof T>(object: T, ...keys: K[]): Pick<T, K> => {
  const result: any = {}

  for (const key of keys) {
    const value = object[key]

    if (value !== undefined) {
      result[key] = object[key]
    }
  }

  return result
}

export const translateAuthDetails = (rawData: any) => {
  const authDetails: TotalAuthDetails = pick(
    rawData,
    'callbackParams',
    'clientID',
    'clientSecret',
    'consumerKey',
    'consumerSecret',
    'idTokenJwt',
    'tokenResponse',
    'tokenSecret',
    'signatureMethod'
  )

  if (rawData.idToken) {
    authDetails.idToken = new TokenData(rawData.idToken)
  }

  if (rawData.refreshToken) {
    authDetails.refreshToken = new TokenData(rawData.refreshToken)
  }

  return {
    ...authDetails,
    rawData,
    accessToken: new TokenData(rawData.accessToken)
  } as AuthDetails
}

export enum TokenType {
  OAuth1 = 'oauth',
  OAuth2AccessToken = 'bearer',
  OAuth2RefreshToken = 'refresh', // Not defined in RFC7662
  OpenIDConnect = 'id' // Not defined in RFC7662
}

type TokenRawData = {
  active: boolean
  client_id: string
  exp?: number
  iat: number
  scope?: string
  token_type: TokenType
  value: string
}

interface AuthDetailsBase {
  callbackParams: Record<string, string>
  rawData: any
  tokenResponse: {
    body: any
    headers: Record<string, string>
  }
}

export enum OAuth1SignatureMethod {
  HmacSha1 = 'HMAC-SHA1',
  RsaSha1 = 'RSA-SHA1',
  PlainText = 'PLAINTEXT'
}

export interface OAuth1AuthDetails extends AuthDetailsBase {
  consumerKey: string
  consumerSecret: string
  signatureMethod: OAuth1SignatureMethod
  tokenSecret: string
  accessToken: TokenData
}

export interface OAuth2AuthDetails extends AuthDetailsBase {
  clientID: string
  clientSecret: string
  idTokenJwt?: any
  accessToken: TokenData
  idToken?: TokenData
  refreshToken?: TokenData
}

export type AuthDetails = OAuth1AuthDetails | OAuth2AuthDetails
type TotalAuthDetails = Partial<OAuth1AuthDetails & OAuth2AuthDetails>
