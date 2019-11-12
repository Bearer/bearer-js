import { Configuration } from './config'
import OS from 'os'

const oldEnv = { ...process.env }

afterEach(() => {
  setEnv(oldEnv)
})

describe('Configuration', () => {
  describe.skip('when config is read from config/bearer.yml', () => {
    test('load config properly config/bearer.yml', () => {})
  })

  describe.skip('when config is read from bearer.yml', () => {
    test('load config properly from bearer.yml', () => {})
  })

  describe('when config is read from BEARER_CONFIG_FILE', () => {
    beforeAll(() => {
      setEnv({
        BEARER_CONFIG_FILE: '/whatever/file.yml',
        BEARER_AGENT_DEBUG_LEVEL: 'warn',
        BEARER_AGENT_DISABLED: 'true',
        BEARER_SECRET_KEY: 'secret from env',
        BEARER_AGENT_IGNORE: 'bin.bearer.sh, foobar.com ',
        BEARER_AGENT_LOG_LEVEL: 'ALL',
        BEARER_AGENT_FILTERED: 'hiddenHeader'
      })
    })
    test('load config properly BEARER_CONFIG_FILE', () => {
      const instance = new Configuration()

      expect(instance.conf).toMatchInlineSnapshot(`
        Object {
          "debugLevel": "warn",
          "disabled": "true",
          "filtered": Array [
            "hiddenHeader",
          ],
          "from": "/whatever/file.yml",
          "ignored": Array [
            "bin.bearer.sh",
            "foobar.com",
          ],
          "log_level": "ALL",
          "report_host": "https://agent.bearer.sh",
          "secret": "secret from env",
        }
      `)
    })
  })

  describe('defaults', () => {
    const instance = new Configuration()

    test('token', () => {
      expect(instance.get('secret')).toBeUndefined()
    })
  })
})

function setEnv(env: any) {
  process.env = Object.assign(process.env, env)
}
