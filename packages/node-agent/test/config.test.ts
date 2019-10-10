import fs from 'fs'
import path from 'path'
import rm from 'rimraf'

import { parse, get } from '../src/config'

const oldEnv = process.env
const base = process.cwd()
const tmp = path.join(base, 'tmp')

beforeEach(() => {
  // reset Env
  process.env = {
    ...oldEnv
  }
})

describe('config', () => {
  describe('read from env', () => {
    beforeAll(() => {
      process.env.BEARER_SECRET_KEY = 'read from env'
      parse()
    })

    test('set config values', () => {
      const config = get()

      expect(config).toMatchInlineSnapshot(`
        Object {
          "enabled": true,
          "secret_key": "read from env",
        }
      `)
    })
  })

  describe('read from file', () => {
    beforeEach(done => {
      rm(tmp, () => {
        fs.mkdirSync(tmp)
        // write file
        fs.writeFileSync(
          path.join(tmp, 'bearer.json'),
          JSON.stringify({
            secret_key: 'read from file',
            enabled: false
          })
        )

        process.chdir(tmp)
        parse()
        done()
      })
    })

    afterEach(() => {
      rm.sync(tmp)
      process.chdir(base)
    })

    test('set config values', () => {
      const config = get()

      expect(config).toMatchInlineSnapshot(`
        Object {
          "enabled": false,
          "secret_key": "read from file",
        }
      `)
    })
  })
})
