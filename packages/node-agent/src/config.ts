import fs from 'fs'
import path from 'path'
import Joi from '@hapi/joi'
import { logger as debug } from './logger'
const logger = debug.extend('config')

const BEARER_SECRET_KEY = 'BEARER_SECRET_KEY'
const BEARER_DISABLED = 'BEARER_DISABLED'
const falsyValues = ['false', 'no', 0, '0']

const schema = Joi.object().keys({
  secret_key: Joi.string().required(),
  enabled: Joi.boolean()
    .truthy('true', 'yes', 1, '1')
    .falsy(...falsyValues)
    .default(true)
})

let config: Config = {
  secret_key: undefined,
  enabled: true
}

export function parse() {
  const file = process.env.BEARER_CONFIG || path.join(process.cwd(), 'bearer.json')
  let parsedConfig: Partial<Config> = {}

  if (fs.existsSync(file)) {
    try {
      parsedConfig = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }))
    } catch (error) {
      console.error('Incorrect bearer config format, please make sure a valid json has been provided')
    }
  } else {
    parsedConfig.secret_key = process.env[BEARER_SECRET_KEY]

    if (process.env[BEARER_DISABLED]) {
      parsedConfig.enabled = !falsyValues.includes(process.env[BEARER_DISABLED]!)
    }
  }

  // read from env

  const { value, error } = schema.validate(parsedConfig)

  if (error) {
    console.error(`Invalid config: ${error.message}`)
  } else {
    logger('Valid configuration found')
    config = value as Config
  }
}

export function get(): Config {
  return config
}

type Config = {
  secret_key: string | undefined
  enabled?: boolean
}
