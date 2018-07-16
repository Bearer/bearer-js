const { BEARER_INTEGRATION_HOST } = process.env
export interface IBearerConfig {
  integrationHost?: string
  integrationId?: string
  loadingComponent?: string
}

export default class BearerConfig {
  integrationHost: string = BEARER_INTEGRATION_HOST ||
  'https://int.staging.bearer.sh/'
  integrationId: string = ''
  loadingComponent: string

  constructor(options: IBearerConfig = {}) {
    this.update(options)
  }

  update(options: IBearerConfig) {
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
  }
}
