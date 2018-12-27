import * as React from 'react'
import * as Renderer from 'react-test-renderer'
import * as ShallowRenderer from 'react-test-renderer/shallow'

import DummyContext from '../__test__/utils/dummy-context'

import fromBearer from './from-bearer'

describe('fromBearer', () => {
  const tagName = 'bearer-component'
  const eventName = 'bearer-component-prop-set'
  const TestComponent = fromBearer<{ foo?: string }>(tagName)

  it('renders bearer component tag', () => {
    const renderer = ShallowRenderer.createRenderer()
    const tree = renderer.render(<TestComponent foo="bar" />)
    expect(tree).toMatchSnapshot()
  })

  it('adds and removes event listeners', () => {
    const addEventListener = jest.fn(_name => null)
    const removeEventListener = jest.fn(_name => null)
    const createNodeMock = (_element: any) => {
      return {
        addEventListener,
        removeEventListener
      }
    }

    const render = Renderer.create(<TestComponent foo="bar" />, { createNodeMock })
    render.unmount()

    expect(addEventListener.mock.calls.length).toBe(1)
    expect(addEventListener.mock.calls[0][0]).toBe(eventName)
    expect(removeEventListener.mock.calls.length).toBe(1)
    expect(removeEventListener.mock.calls[0][0]).toBe(eventName)
  })

  it('calls context handler when propSet events are dispatched', () => {
    const payload = {
      detail: {
        foo: 'baz'
      }
    }
    const handlerMock = jest.fn(_x => null)

    const createNodeMock = (_element: any) => {
      return {
        addEventListener(name: string, handler: (e: any) => void) {
          if (name === eventName) {
            handler(payload)
          }
        }
      }
    }

    Renderer.create(
      <DummyContext onHandlePropUpdates={handlerMock}>
        <TestComponent foo="bar" />
      </DummyContext>,
      { createNodeMock }
    )

    expect(handlerMock.mock.calls.length).toBe(1)
    expect(handlerMock.mock.calls[0][0]).toBe(payload)
  })

  it('props from context flow to component', () => {
    const createNodeMock = (_element: any) => ({ addEventListener: jest.fn(_name => null) })

    const initialContext = { bar: 'boo' }
    const render = Renderer.create(
      <DummyContext initialContext={initialContext}>
        <TestComponent />
      </DummyContext>,
      { createNodeMock }
    )
    expect(render.toJSON()).toMatchSnapshot()
  })

  it('adds callbacks for component events', () => {
    const addEventListener = jest.fn(_name => null)
    const removeEventListener = jest.fn(_name => null)
    const onShared = jest.fn(_name => null)
    const createNodeMock = (_element: any) => {
      return {
        addEventListener,
        removeEventListener
      }
    }
    const outputEventName = 'bearer-6d29c4-share-slack-beta-4-feature-shared'
    const props = {
      [outputEventName]: onShared
    }
    const initialContext = { bar: 'boo' }
    const render = Renderer.create(
      <DummyContext initialContext={initialContext}>
        <TestComponent {...props} />
      </DummyContext>,
      { createNodeMock }
    )
    expect(render.toJSON()).toMatchSnapshot()
    render.unmount()
    expect(addEventListener.mock.calls.length).toBe(2)
    expect(addEventListener.mock.calls[1][0]).toBe(outputEventName)
    expect(addEventListener.mock.calls[1][1]).toBe(onShared)
    expect(removeEventListener.mock.calls.length).toBe(2)
    expect(removeEventListener.mock.calls[1][0]).toBe(outputEventName)
    expect(removeEventListener.mock.calls[1][1]).toBe(onShared)
  })
})