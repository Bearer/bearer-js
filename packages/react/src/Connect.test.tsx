import * as React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'

const integration = 'my-dummy-integration'
const params = { someParam: 'some-param', otherParam: 'other-param' }

const connect = jest.fn((_one, _two, { authId }) => {
  if (authId === 'failure') {
    return Promise.reject({ integration, authId })
  }
  return Promise.resolve({ integration, authId: authId || 'random' })
})

jest.mock('./bearer-provider', () => {
  const BearerContext = React.createContext<any>({ bearer: { connect } })
  return { BearerContext }
})

import Connect from './Connect'

describe('Connect', () => {
  beforeEach(() => {
    connect.mockClear()
  })

  describe('when success authentication', () => {
    test('it renders Click button', async () => {
      const success = jest.fn()
      const { getByText } = renderConnect({ success, integration })

      expect(getByText('Click')).not.toBeNull()
      fireEvent.click(getByText(/Click/i))

      expect(connect).toHaveBeenCalledWith(integration, 'my-setup', { params, authId: 'auth-id' })
      // next tick
      await waitForElement(() => getByText(/Click/i))
      expect(success).toHaveBeenCalledWith({ authId: 'auth-id', integration: 'my-dummy-integration' })
    })
  })

  describe('when failing authentication', () => {
    test('it renders Click button', async () => {
      const success = jest.fn()
      const onError = jest.fn()

      const { getByText } = renderConnect({ success, onError, authId: 'failure' })

      expect(getByText('Click')).not.toBeNull()
      fireEvent.click(getByText(/Click/i))

      expect(connect).toHaveBeenCalledWith('dummy', 'my-setup', { params, authId: 'failure' })

      await waitForElement(() => getByText(/Failure retry/i))

      expect(success).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith({
        authId: 'failure',
        error: { authId: 'failure', integration: 'my-dummy-integration' },
        integration: 'dummy'
      })
    })
  })
})

function renderConnect({
  success = jest.fn(),
  integration = 'dummy',
  setup = 'my-setup',
  authId = 'auth-id',
  onError = jest.fn()
}: any) {
  return render(
    <Connect
      integration={integration}
      setupId={setup}
      onSuccess={success}
      onError={onError}
      authId={authId}
      params={params}
      render={({ connect, error }) =>
        !error ? <button onClick={connect}>Click</button> : <button onClick={connect}>Failure retry</button>
      }
    />
  )
}
