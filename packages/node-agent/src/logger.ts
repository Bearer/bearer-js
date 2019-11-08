import winston, { format } from 'winston'

export const logger = winston.createLogger({
  level: process.env['BEARER_AGENT_DEBUG_LEVEL'] || 'info',
  format: format.combine(format.splat(), format.json()),
  defaultMeta: { bearer: 'agent' },
  transports: [new winston.transports.Console()]
})
