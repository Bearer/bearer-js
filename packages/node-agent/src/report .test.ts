import nock from 'nock'
import { enqueue, imperativeDrain } from './report'

jest.useFakeTimers()

describe('report', () => {
  const apiCall = jest.fn((uri, requestBody) => {
    return [200, '{}']
  })

  beforeEach(() => {
    apiCall.mockClear()

    nock('https://enpbfkbl19cks.x.pipedream.net')
      .post('/logs')
      .reply(apiCall)
  })

  describe('imperativeDrain', () => {
    test('does not perfom call if nothing is in the queue', async done => {
      imperativeDrain()

      expect(apiCall).not.toHaveBeenCalled()

      process.nextTick(() => {
        done()
      })
    })

    test('enqueue and send report in batch', async done => {
      enqueue({ whatever: 'data1' })
      enqueue({ whatever: 'data2' })

      jest.runAllImmediates()

      process.nextTick(() => {
        expect(apiCall).toHaveBeenNthCalledWith(
          1,
          '/logs',
          expect.objectContaining({
            agent: { log_level: 'ALL', type: 'node', version: expect.any(String) },
            logs: [{ whatever: 'data1' }, { whatever: 'data2' }],
            runtime: { type: 'node', version: process.version }
          })
        )

        done()
      })
    })
  })
})
