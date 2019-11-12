import OS from 'os'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'

import { Configuration } from './config'

const oldEnv = { ...process.env }

beforeEach(() => {
  process.env = { ...oldEnv }
})

afterAll(() => {
  process.env = oldEnv
})

describe('Configuration', () => {
  describe('read configuration from file', () => {
    const cwd = process.cwd()
    const dir = path.join(OS.tmpdir(), 'tmp')

    beforeEach(done => {
      rimraf(dir, () => {
        fs.mkdirSync(dir)
        process.chdir(dir)
        done()
      })
    })

    afterEach(done => {
      rimraf(dir, () => {
        process.chdir(cwd)
        done()
      })
    })

    describe('when config is read from bearer.yml', () => {
      beforeEach(done => {
        rimraf(dir, () => {
          fs.mkdirSync(dir)
          const file = path.join(dir, 'bearer.json')
          dumpConfig(
            {
              from: 'bearer.json',
              debugLevel: 'debug',
              disabled: false,
              secret: 'secret from file',
              ignored: ['ignore.from.file'],
              logLevel: 'ALL',
              filtered: ['filtere-from-file']
            },
            file,
            done
          )
        })
      })

      test('load config properly from bearer.yml', () => {
        const instance = new Configuration()

        expect(instance.conf).toMatchObject({
          debugLevel: 'debug',
          disabled: false,
          filtered: ['filtere-from-file'],
          ignored: ['ignore.from.file'],
          logLevel: 'ALL',
          report_host: 'https://agent.bearer.sh',
          secret: 'secret from file'
        })
      })
    })

    describe('when BEARER_CONFIG_FILE is provided', () => {
      const file = path.join(dir, 'custom-filename.json')

      beforeEach(done => {
        setEnv({ BEARER_CONFIG_FILE: file })

        dumpConfig(
          {
            debugLevel: 'debug',
            disabled: false,
            secret: 'secret from custom location',
            ignored: ['ignore.custom.location'],
            logLevel: 'ALL',
            filtered: ['custom-file-filter']
          },
          file,
          done
        )
      })

      test('load config properly from custom file location', () => {
        const instance = new Configuration()

        expect(instance.conf).toMatchObject({
          debugLevel: 'debug',
          disabled: false,
          filtered: ['custom-file-filter'],
          ignored: ['ignore.custom.location'],
          logLevel: 'ALL',
          report_host: 'https://agent.bearer.sh',
          secret: 'secret from custom location'
        })
      })
    })
  })

  describe('when config is read from env', () => {
    beforeEach(() => {
      setEnv({
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
          "from": undefined,
          "ignored": Array [
            "bin.bearer.sh",
            "foobar.com",
          ],
          "logLevel": "ALL",
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
  process.env = { ...process.env, ...env }
}

function dumpConfig(config: any, file: string, done: () => {}) {
  fs.writeFile(file, JSON.stringify(config), { encoding: 'utf8' }, done)
}
