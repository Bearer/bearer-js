import { extractRequest } from './hijacker'

describe('hijacker', () => {
  test('it works', () => {})
})

describe('extractRequest', () => {
  describe('when a string is given', () => {
    test('extract url, search and headers', () => {
      expect(
        extractRequest('https://foo.bearer.sh/nested/path?queryParams=ok', {
          headers: {
            somethind: 'in-headers'
          }
        })
      ).toMatchInlineSnapshot(`
        Object {
          "fullUrl": [Function],
          "method": "GET",
          "options": Object {
            "headers": Object {
              "somethind": "in-headers",
            },
            "query": "?queryParams=ok",
          },
          "url": "https://foo.bearer.sh/nested/path",
        }
      `)
    })

    test('it appends / if none provided', () => {
      expect(extractRequest('https://foo.bearer.sh', undefined)).toMatchInlineSnapshot(`
        Object {
          "fullUrl": [Function],
          "method": "GET",
          "options": Object {
            "headers": Object {},
            "query": "",
          },
          "url": "https://foo.bearer.sh/",
        }
      `)
    })
  })

  describe('when a options are given', () => {})
})
