import fs from 'fs'
import path from 'path'
import { logger } from './logger'

let config: Configuration

export class Configuration {
  static getConfig = (name: OptionName) => {
    if (!config) {
      initConfig()
    }
    return config.get(name)
  }

  conf: Record<OptionName, any>

  constructor() {
    this.conf = {
      ...this.readFromEnv(),
      ...this.readFromConfigFile()
    }

    if (!this.get('secret')) {
      logger.error('No secret key provided, agent is not enabled')
    }
  }

  get(name: OptionName) {
    return this.conf[name]
  }

  readFromEnv = () => {
    return (Object.keys(OPTIONS) as OptionName[]).reduce(
      (acc, name) => {
        const value = process.env[OPTIONS[name]['key']] || OPTIONS[name]['default']
        const formatter = OPTIONS[name]['formatter']
        acc[name] = formatter ? formatter(value) : value
        return acc
      },
      {} as Record<OptionName, any>
    )
  }

  readFromConfigFile = () => {
    const configPath = configFilePath()
    if (configPath) {
      for (const encoding of encodings) {
        const config = tryReadConfigFile(configPath, encoding)
        if (Object.keys(config).length) {
          return config
        }
      }
    }
    return {}
  }
}

const encodings = ['utf8', 'utf-8', 'ascii', 'binary', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'hex', 'base64']
function tryReadConfigFile(path: string, encoding: string) {
  try {
    const config = fs.readFileSync(path, encoding)
    return JSON.parse(config)
  } catch (err) {
    // TODO: log error
    return {}
  }
}

function configFilePath() {
  const rootConfig = path.join(process.cwd(), 'bearer.json')
  if (fs.existsSync(rootConfig)) {
    return rootConfig
  }

  const fromEnvPath = process.env['BEARER_CONFIG_FILE']
  if (fromEnvPath && fs.existsSync(fromEnvPath)) {
    return fromEnvPath
  }
}

export const initConfig = () => {
  config = new Configuration()
  logger.debug('Bearer agent initialized with %j', config.conf)
}

type OptionName =
  | 'from'
  | 'debugLevel'
  | 'disabled'
  | 'secret'
  | 'ignored'
  | 'logLevel'
  | 'filtered'
  | 'report_host'
  | 'throttleDisabled'

type ConfigOption = {
  key: string
  default: any
  formatter?: (input: any) => any
  choices?: Set<any>
}

const OPTIONS: Record<OptionName, ConfigOption> = {
  from: {
    key: 'BEARER_CONFIG_FILE',
    default: undefined
  },
  debugLevel: {
    key: 'BEARER_AGENT_DEBUG_LEVEL',
    default: 'info'
  },
  disabled: {
    key: 'BEARER_AGENT_DISABLED',
    default: false
  },
  secret: {
    key: 'BEARER_SECRET_KEY',
    default: undefined
  },
  ignored: {
    key: 'BEARER_AGENT_IGNORE',
    formatter: commaSeparatedListToArray,
    default: []
  },
  logLevel: {
    key: 'BEARER_AGENT_LOG_LEVEL',
    choices: new Set(['ALL', 'RESTRICTED']),
    default: 'ALL'
  },
  filtered: {
    key: 'BEARER_AGENT_FILTERED',
    formatter: commaSeparatedListToArray,
    default: []
  },
  report_host: {
    key: 'BEARER_AGENT_REPORT_HOST',
    default: 'https://agent.bearer.sh'
  },
  throttleDisabled: {
    key: 'BEARER_AGENT_THROTTLE_DISABLED',
    default: false
  }
}

function commaSeparatedListToArray(commaList: string) {
  if (typeof commaList === 'string') {
    return commaList.split(',').map(part => part.trim())
  }
  return commaList
}
