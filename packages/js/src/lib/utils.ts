/**
 * cleanOptions remove all undefined keys
 * @param obj {object}
 */
export function cleanOptions(obj: Record<string, any>) {
  return Object.keys(obj).reduce(
    (acc, key: string) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key]
      }
      return acc
    },
    {} as Record<string, any>
  )
}

/**
 * buildQuery: transform an object to a valid query string
 * @param params {object}
 */

export function buildQuery(params: Record<string, any>) {
  function encode(key: string, value: any): string[] {
    if (value === null || value === undefined) {
      return []
    }

    if (typeof value === 'object') {
      return flatMap(Object.keys(value), nestedKey => encode(`${key}[${nestedKey}]`, value[nestedKey]))
    }

    return [encodeURIComponent(key) + '=' + encodeURIComponent(value)]
  }

  return flatMap(Object.keys(params), key => encode(key, params[key])).join('&')
}

const flatMap = <T, U>(items: T[], f: (item: T) => U[]): U[] => ([] as U[]).concat(...items.map(f))
