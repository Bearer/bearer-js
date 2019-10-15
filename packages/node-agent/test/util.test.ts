import { isBearerMessage } from '../src/utils'

const correctSignature =
  'iCspwin5FHC7XoZUFA/tC0SNbtEwTqRDf2SHLu2owndl0PB3KQUo8bw3GloqQE3TtbiZZM+Jnc8aN/q1vitcstCkBwRACBXbtuWvlPF+bJh/CB6cvbWYrbqAXiU8HBkN5Ny8HAFkQ8n8vsLaq4ajygziEYH9KHazcJ1aPuepH5Er9n71/fA8pXXrFC3+nSy8sI6nlRzjDayAauBM/9O14mjTXn+uF+C1XOm6NArrdprvZltPS+3R1meUfRidSGE2zyDVA8Xqh+516l5NqdfzHWFvKt/FoIzaHYXz5R/DE/xY3rdJeMCg1HG65Rj0i/90kf7WUxy87rKTurJlkpBjcP8KRKvtkBHe14lL8jNV9Ir1nvQC2hVwzCMfryKFyP3i1I+xBY5c65ebZAepVOV3qMzpZJJDxqoOgGw58GNTrpCNey4ww642VxkRxXUlxAxACu03xGXCxE12//TJg783TdkgowxpFh9q8tdTYFa9/0mmRys4rZWXRu0ikld7a4tES8sWJJeoknUS0TiYb3CsxZ+MHh8zj4xrMLPF5pganKqRcwMRMhyJeO2Qp+8tDpiel3J4nL9qLxGpn9EzzfxKiZlkfmRDG4cSUWrx/4VhRqfdH/28jP0Jg40j+5CqUoQB3eXjoRl5QLXFNsvX5wXJ/CAwhBEfhoO99wcrUx70egE='
const correctPayload = 'some data to sign'

describe('isBearerMessage', () => {
  test('returns false if payload does not match signature', () => {
    expect(isBearerMessage('something bad', correctSignature)).toBeFalsy()
  })

  test('returns false if signature is not correct', () => {
    expect(isBearerMessage(correctPayload, 'bababababa')).toBeFalsy()
  })

  test('returns true if payload matches signature', () => {
    expect(isBearerMessage(correctPayload, correctSignature)).toBeTruthy()
  })
})
