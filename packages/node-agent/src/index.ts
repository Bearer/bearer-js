import semver from 'semver'
import { hijack } from './hijacker'
import { initConfig, Configuration } from './config'
import { logger } from './logger'

// check config
initConfig()

if (!Configuration.getConfig('disabled')) {
  // TODO: check if the http module has already been loaded
  hijack(require('http'))

  if (semver.satisfies(process.version, '>=9.0.0 || 8.9.0')) {
    hijack(require('https'))
  }
} else {
  logger.info('agent has been manually disabled, update your configuration to re-enable it')
}
