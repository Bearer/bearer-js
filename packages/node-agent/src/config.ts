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
    this.conf = this.readFromEnv()
    // read from env
  }

  get(name: OptionName) {
    return this.conf[name]
  }

  readFromEnv = () => {
    return (Object.keys(OPTIONS) as OptionName[]).reduce(
      (acc, name) => {
        const value = process.env[OPTIONS[name]['key']]
        acc[name] = value || OPTIONS[name]['default']
        return acc
      },
      {} as Record<OptionName, any>
    )
  }
}

export const initConfig = () => {
  config = new Configuration()
  logger.debug('Bearer agent initialized with %j', config.conf)
}

type OptionName = keyof typeof OPTIONS

const OPTIONS = {
  disabled: {
    key: 'BEARER_AGENT_DISABLED',
    default: false
  },
  secret: {
    key: 'BEARER_SECRET_KEY',
    default: ''
  }
}
