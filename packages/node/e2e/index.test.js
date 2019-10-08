const bearer = require('@bearer/node')
const installedPkg = require('@bearer/node/package.json')

function expectedResult(method) {
  return {
    args: {
      foo: 'bar'
    },
    headers: {
      accept: 'text/plain',
      'content-type': 'txt',
      host: 'postman-echo.com',
      'my-custom-header': 'my-custom-header-value',
      'user-agent': 'Bearer.sh',
      'x-amzn-trace-id': /Root.*/,
      'x-forwarded-port': '443',
      'x-forwarded-proto': 'https'
    },

    url: `https://postman-echo.com/${method}?foo=bar`
  }
}

const DEFAULT_HEADERS = {
  'my-custom-header': 'my-custom-header-value',
  accept: 'text/plain',
  'content-type': 'txt'
}

const DEFAULT_QUERY = {
  foo: 'bar'
}
async function makeRequest(api, method, headers = {}, query = {}) {
  return await api[method](`/${method}`, {
    headers,
    query
  })
}

function makeTest(api, method, headers = DEFAULT_HEADERS, query = DEFAULT_QUERY) {
  return async () => {
    response = await makeRequest(api, method, headers, query)
    expect(response.data).toMatchObject(expectedResult(method))
  }
}

describe('requests', () => {
  beforeAll(() => {
    console.log(`Running @bearer/node@${installedPkg.version}`)
  })
  const api = bearer('sk_production_d1zTnXpHIudTiVFYp3CnC7wE16NdFvCi', {
    host: 'https://proxy.staging.bearer.sh'
  }).integration('postman_echo')
  describe('GET', () => {
    it('sends GET request to echo server', makeTest(api, 'get'))
  })

  describe('POST', () => {
    it('sends POST request to echo server', makeTest(api, 'post'))
  })

  describe('PUT', () => {
    it('sends PUT request to echo server', makeTest(api, 'put'))
  })

  describe('PATCH', () => {
    it('sends PATCH request to echo server', makeTest(api, 'patch'))
  })

  describe('DELETE', () => {
    it('sends DELETE request to echo server', makeTest(api, 'delete'))
  })

  describe('DELETE', () => {
    it('sends DELETE request to echo server', makeTest(api, 'delete'))
  })
})
