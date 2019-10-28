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
  const searchParams = new URLSearchParams()

  function addParams(key: string, value: any): void {
    if (value === null || value === undefined) {
      return
    }

    if (typeof value === 'object') {
      return Object.keys(value).forEach(nestedKey => addParams(`${key}[${nestedKey}]`, value[nestedKey]))
    }

    searchParams.append(key, value)
  }

  for (const key of Object.keys(params)) {
    addParams(key, params[key])
  }

  return searchParams.toString()
}
