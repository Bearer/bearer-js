import OS from 'os'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'

import { Configuration } from './config'

const oldEnv = { ...process.env }

afterEach(() => {
  setEnv(oldEnv)
})

describe('Configuration', () => {
  describe('when config is read from bearer.yml', () => {
    const cwd = process.cwd()

    const dir = path.join(OS.tmpdir(), 'tmp')

    beforeEach(done => {
      rimraf(dir, () => {
        fs.mkdirSync(dir)
        process.chdir(dir)
        const file = path.join(dir, 'bearer.json')
        dumpConfig(
          {
            from: 'bearer.json',
            debugLevel: 'debug',
            disabled: false,
            secret: 'secret from file',
            ignored: ['ignore.from.file'],
            log_level: 'ALL',
            filtered: ['filtere-from-file']
          },
          file,
          done
        )
      })
    })

    afterEach(done => {
      rimraf(dir, () => {
        process.chdir(cwd)
        done()
      })
    })

    test('load config properly from bearer.yml', () => {
      const instance = new Configuration()

      expect(instance.conf).toMatchInlineSnapshot(`
        Object {
          "debugLevel": "debug",
          "disabled": false,
          "filtered": Array [
            "filtere-from-file",
          ],
          "from": "bearer.json",
          "ignored": Array [
            "ignore.from.file",
          ],
          "log_level": "ALL",
          "report_host": "https://agent.bearer.sh",
          "secret": "secret from file",
        }
      `)
    })
  })

  describe('when config is read from env', () => {
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

    test('load config properly', () => {
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

function dumpConfig(config: any, file: string, done: () => {}) {
  fs.writeFile(file, JSON.stringify(config), { encoding: 'utf8' }, done)
}
