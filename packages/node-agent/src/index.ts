import semver from 'semver'
import { hijack } from './hijacker'
import { logger } from './logger'
import { parse as parseConfig } from './config'

// check config
parseConfig()

// TODO: check if the http module has already been loaded
logger('Hijacking http')
hijack(require('http'))

if (semver.satisfies(process.version, '>=9.0.0 || 8.9.0')) {
  logger('Hijacking https')
  hijack(require('https'))
}
