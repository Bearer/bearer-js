import * as requests from './requests'

export function generateUniqueId(n) {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

export function storeSecret(referenceId: string, payload: any) {
  return putItem(referenceId, { ...payload, ReadAllowed: false })
}

export function storeData(referenceId: string, payload: any) {
  return putItem(referenceId, { ...payload, ReadAllowed: true })
}

export function getData(referenceId: string) {
  const request = requests.intentRequest({
    intentName: referenceId,
    scenarioId: 'items'
  })
  return request({})
}

export function removeData(referenceId: string) {
  const request = requests.intentRequest({
    intentName: referenceId,
    scenarioId: 'items'
  })
  return request(
    {},
    {
      method: 'DELETE'
    }
  )
}

function putItem(referenceId: string, payload: any) {
  const request = requests.intentRequest({
    intentName: referenceId,
    scenarioId: 'items'
  })
  return request(
    {},
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  )
}
