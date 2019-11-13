import https from 'https'
import throttle from 'lodash.throttle'
import { logger } from './logger'
import { Configuration } from './config'

const queue: ReportLog[] = []
const REPORT_BATCH_SIZE = 5
const DRAIN_INTERVAL = 10 * 1000

const runtimeInfo = {
  type: 'node' as 'node',
  version: process.version
}

const agentInfo = {
  type: 'node' as 'node',
  version: require('../package.json').version
}

export const enqueue = (report: ReportLog) => {
  queue.push(report)
  setImmediate(drain)
}

export function imperativeDrain() {
  const reportItems = queue.splice(0, REPORT_BATCH_SIZE)
  if (!reportItems.length) {
    logger.debug('no items to report')
    return
  }

  logger.debug('reporting %s items', reportItems.length)
  const req = https.request(
    {
      hostname: Configuration.getConfig('report_host'),
      port: 443,
      path: '/logs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    res => {
      // @ts-ignore
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          logger.debug('report sent')
        } else {
          logger.error('error while sending report adding to the queue')
          queue.push(...reportItems)
        }
        setImmediate(drain)
      })
    }
  )

  req.on('error', e => {
    logger.error('Error while reporting to bearer', e)
    queue.push(...reportItems)
    setImmediate(drain)
  })

  const payload: Report = {
    runtime: runtimeInfo,
    agent: {
      ...agentInfo,
      log_level: Configuration.getConfig('logLevel')
    },
    secretKey: Configuration.getConfig('secret'),
    logs: reportItems
  }
  logger.debug('sending: %j', payload)
  req.write(JSON.stringify(payload))
  req.end()
}

process.on('SIGTERM', () => {
  imperativeDrain()
})

export const drain = throttle(imperativeDrain, DRAIN_INTERVAL, { leading: true, trailing: true })

type Report = {
  secretKey: string
  runtime: {
    type: 'node'
    version: string
  }
  agent: {
    type: 'node'
    version: string
    log_level: string
  }
  logs: ReportLog[]
}

type ReportLog = RestrictedReportLog | FullReportLog

export type RestrictedReportLog = {
  port?: number
  protocol: 'http' | 'https'
  path: string
  hostname: string
  method: string
  startedAt: number
  endedAt: number
  type: 'REQUEST_END' // # REQUEST_ERROR | REQUEST_END
  statusCode: number
  url: string
}

export type FullReportLog = RestrictedReportLog & {
  requestHeaders: Record<string, string | number>
  requestBody: string
  responseHeaders: Record<string, string | number>
  responseBody: string
}
