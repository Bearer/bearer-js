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

    // read from env
  }

  get(name: OptionName) {
    return this.conf[name]
  }

  readFromEnv = () => {
    return (Object.keys(OPTIONS) as OptionName[]).reduce(
      (acc, name) => {
        const value = process.env[OPTIONS[name]['key']] || OPTIONS[name]['default']
        const formatter = OPTIONS[name]['format']
        acc[name] = formatter ? formatter(value) : value
        return acc
      },
      {} as Record<OptionName, any>
    )
  }

  readFromConfigFile = () => {
    // read from bearer.yml
    // read from config/bearer.yml
    // read from BEARER_CONFIG_FILE
    return {}
  }
}

export const initConfig = () => {
  config = new Configuration()
  logger.debug('Bearer agent initialized with %j', config.conf)
}

type OptionName = keyof typeof OPTIONS

type OptionConfig = {
  key: string
  default: any
  format?: (input: any) => any
  choices?: Set<any>
}

const OPTIONS: Record<string, OptionConfig> = {
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
    format: commaSeparatedListToArray,
    default: []
  },
  log_level: {
    key: 'BEARER_AGENT_LOG_LEVEL',
    choices: new Set(['ALL', 'RESTRICTED']),
    default: 'RESTRICTED'
  },
  filtered: {
    key: 'BEARER_AGENT_FILTERED',
    format: commaSeparatedListToArray,
    default: []
  },
  report_host: {
    key: 'BEARER_AGENT_REPORT_HOST',
    default: 'https://agent.bearer.sh'
  }
}

function commaSeparatedListToArray(commaList: string) {
  if (typeof commaList === 'string') {
    return commaList.split(',').map(part => part.trim())
  }
  return commaList
}
