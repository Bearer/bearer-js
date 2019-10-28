import { buildQuery, cleanOptions } from '../../lib/utils'

describe('cleanOptions', () => {
  it('removes keys with undefined valued', () => {
    cleanOptions
    const params = {
      aNullParams: null,
      undefinedParams: undefined,
      falseParams: false,
      aString: 'ok',
      aNumber: 1
    }

    expect(cleanOptions(params)).toEqual({ aNullParams: null, falseParams: false, aString: 'ok', aNumber: 1 })
  })
})

describe('buildQuery', () => {
  it('creates a valid query string', () => {
    cleanOptions
    const params = {
      aNullParams: null,
      undefinedParams: undefined,
      falseParams: false,
      aString: 'ok with space and accents ééà',
      aNumber: 1,
      nested: {
        x: 1,
        y: 2,
        z: { a: 'hello' }
      }
    }

    expect(buildQuery(params)).toMatchInlineSnapshot(
      `"falseParams=false&aString=ok%20with%20space%20and%20accents%20%C3%A9%C3%A9%C3%A0&aNumber=1&nested%5Bx%5D=1&nested%5By%5D=2&nested%5Bz%5D%5Ba%5D=hello"`
    )
  })

  it('returns an empty string when there are no params', () => {
    const params = {}

    expect(buildQuery(params)).toEqual('')
  })

  it('filters empty params', () => {
    const params = {
      nullParam: null,
      undefinedParam: undefined,
      nested: {
        nullParam: null,
        undefinedParam: undefined
      },
      present: 'ok'
    }

    expect(buildQuery(params)).toEqual('present=ok')
  })
})
