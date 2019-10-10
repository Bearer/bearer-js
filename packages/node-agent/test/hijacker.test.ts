import { hijack } from '../src/hijacker'
const get = jest.fn()
const request = jest.fn()

const httpModule = {
  get,
  request
} as any

describe('hijacker', () => {
  test('it updates the given module', () => {
    const hijacked = hijack(httpModule)

    expect(hijacked.get).not.toEqual(get)
    expect(hijacked.request).not.toEqual(request)
  })

  describe.skip('capture outgoing requests', () => {
    test('does not track bearer requests', () => {})

    describe('when request is successful', () => {
      test('reports REQUEST_END with additional information')
    })

    describe('when error occur', () => {
      test('reports REQUEST_ERROR', () => {})
    })

    describe('when timeout occurs', () => {
      test('reports REQUEST_TIMEOUT', () => {})
    })
  })
})
