import nock from 'nock'

import clientFactory, { bearer } from './client'
const secretKey = 'spongeBobApiKey'
const okResponse = { ok: 'ok' }
const distantApi = jest.fn(() => okResponse)

describe('Bearer client', () => {
  const client = clientFactory(secretKey)

  beforeEach(() => {
    distantApi.mockClear()
  })

  it('returns a client instance', () => {
    expect(client).toBeInstanceOf(bearer)
  })

  it('throws an error if the API KEY is not correct', () => {
    expect(() => {
      clientFactory(undefined as any)
    }).toThrowError(
      `Invalid Bearer API key provided.  Value: undefined \
You'll find you API key at this location: https://app.bearer.sh/keys`
    )
  })

  describe('#integration', () => {
    const pkg = require('../package.json')
    const integrationName = '12345'
    const api = client.integration(integrationName)
    const query = { sponge: 'bob' }
    const headers = { 'User-Agent': `Bearer-Node (${pkg.version})` }
    const body = '{"body":"data"}'

    interface IMockRequestParams {
      method: string
      extraHeaders?: Record<string, string>
      body?: any
    }

    const mockRequest = ({ method, extraHeaders = {}, body }: IMockRequestParams) => {
      nock('https://proxy.bearer.sh', {
        reqheaders: {
          authorization: secretKey,
          ...headers,
          ...extraHeaders
        }
      })
        .intercept(`/${integrationName}/test`, method, body)
        .once()
        .query(query)
        .reply(200, distantApi)
    }

    it('performs correct API calls', async () => {
      mockRequest({ body, method: 'POST' })

      const { data } = await api.post('/test', { headers, query, body })

      expect(distantApi).toHaveBeenCalled()
      expect(data).toEqual(okResponse)
    })

    describe('#request', () => {
      it('supports GET requests', async () => {
        mockRequest({ method: 'GET' })

        const { data } = await api.request('GET', '/test', { headers, query })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('supports HEAD requests', async () => {
        mockRequest({ method: 'HEAD' })

        const { data } = await api.request('HEAD', '/test', { headers, query })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('supports POST requests', async () => {
        mockRequest({ body, method: 'POST' })

        const { data } = await api.request('POST', '/test', { headers, query, body })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('supports PUT requests', async () => {
        mockRequest({ body, method: 'PUT' })

        const { data } = await api.request('PUT', '/test', { headers, query, body })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('supports PATCH requests', async () => {
        mockRequest({ body, method: 'PATCH' })

        const { data } = await api.request('PATCH', '/test', { headers, query, body })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('supports DELETE requests', async () => {
        mockRequest({ body, method: 'DELETE' })

        const { data } = await api.request('DELETE', '/test', { headers, query, body })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })
    })

    describe('#auth', () => {
      it('sends any configured auth id in a Bearer-Auth-Id header', async () => {
        const authId = 'abcde12345...'
        mockRequest({ method: 'POST', extraHeaders: { 'Bearer-Auth-Id': authId } })

        const { data } = await api.auth(authId).post('/test', { query })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })

      it('has an alias function "authenticate"', async () => {
        expect(api.authenticate).toEqual(api.auth)
      })
    })

    describe('#setup', () => {
      it('sends any configured setup id in a Bearer-Setup-Id header', async () => {
        const setupId = 'test-setup-id'
        mockRequest({ method: 'GET', extraHeaders: { 'Bearer-Setup-Id': setupId } })

        const { data } = await api.setup(setupId).get('/test', { query })

        expect(distantApi).toHaveBeenCalled()
        expect(data).toEqual(okResponse)
      })
    })

    describe('getAuth', () => {
      const authId = 'test-auth-id'

      const mockRequest = (data: any) => {
        nock('https://auth.bearer.sh', {
          reqheaders: {
            authorization: secretKey,
            ...headers
          }
        })
          .get(`/apis/${integrationName}/auth/${authId}`)
          .once()
          .reply(200, data)
      }

      it('raises an error when there is no auth id set', async () => {
        expect(api.getAuth()).rejects.toMatchSnapshot()
      })

      describe('OAuth 1', () => {
        const details = {
          callbackParams: { oauth_token: 'test-token', oauth_verifier: 'test-verifier' },
          consumerKey: 'test-consumer-key',
          consumerSecret: 'test-secret',
          signatureMethod: 'HMAC-SHA1',
          tokenSecret: 'test-token-secret',
          accessToken: {
            active: true,
            value: 'test-token',
            client_id: 'test-consumer-key',
            iat: 1574087265,
            token_type: 'oauth'
          }
        }

        it('fetches the auth details and translates them to a friendly format', async () => {
          mockRequest(details)

          const authDetails = await api.auth(authId).getAuth()

          expect(authDetails).toMatchSnapshot()
        })
      })

      describe('OAuth 2', () => {
        const minimalDetails = {
          callbackParams: {
            code: 'test-code'
          },
          clientID: 'test-client-id',
          clientSecret: 'test-secret',
          tokenResponse: {
            headers: { 'content-type': 'application/json' },
            body: { access_token: 'test-access-token' }
          },
          accessToken: {
            active: true,
            value: 'test-access-token',
            client_id: 'test-client-id',
            iat: 1573661439,
            token_type: 'bearer'
          }
        }

        const fullDetails = {
          ...minimalDetails,
          accessToken: {
            ...minimalDetails.accessToken,
            exp: 1573665039,
            scope: 'read write'
          },
          idToken: {
            active: true,
            value: 'test-id-token',
            client_id: 'test-client-id',
            iat: 1573661439,
            token_type: 'id'
          },
          idTokenJwt: {
            some: 'id-data'
          },
          refreshToken: {
            active: true,
            value: 'test-refresh-token',
            client_id: 'test-client-id',
            iat: 1573661439,
            scope: 'read write',
            token_type: 'refresh'
          }
        }

        it('fetches the auth details and translates them to a friendly format', async () => {
          mockRequest(fullDetails)

          const authDetails = await api.auth(authId).getAuth()

          expect(authDetails).toMatchSnapshot()
        })

        it('works when optional values are missing', async () => {
          mockRequest(minimalDetails)

          const authDetails = await api.auth(authId).getAuth()

          expect(authDetails).toMatchSnapshot()
        })
      })
    })
  })
})
