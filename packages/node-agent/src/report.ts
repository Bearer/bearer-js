import https from 'https'
import throttle from 'lodash.throttle'
import { logger as debug } from './logger'
import { REPORT_HOST } from './constants'
import { get as getConfig } from './config'

const logger = debug.extend('report')
const queue: Record<string, any> = []
const REPORT_BATCH_SIZE = 50
const DRAIN_INTERVAL = 10 * 1000

const runtimeInfo = {
  runtime: {
    type: 'node',
    version: process.version
  },
  agent: {
    type: 'node',
    version: require('../package.json').version
  }
}

export const enqueue = (report: Record<string, any>) => {
  queue.push({ ...report, runtimeInfo })
  setImmediate(drain)
}

function imperativeDrain() {
  const reportItems = queue.splice(0, REPORT_BATCH_SIZE)
  if (!reportItems.length) {
    logger('no items to report')
    return
  }
  logger('reporting %s items', reportItems.length)
  const req = https.request(
    {
      hostname: REPORT_HOST,
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

      // A chunk of data has been recieved.
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          logger('report sent')
        } else {
          logger('error wild sending report adding to the queue')
          queue.push(...reportItems)
        }
        setImmediate(drain)
      })
    }
  )
  req.on('error', () => {
    logger('Error while reporting to bearer')
    queue.push(...reportItems)
    setImmediate(drain)
  })
  const payload = { secretKey: getConfig().secret_key, logs: reportItems }
  logger('sending: %j', payload)
  req.write(JSON.stringify(payload))
  req.end()
}

process.on('SIGTERM', () => {
  imperativeDrain()
})
const drain = throttle(imperativeDrain, DRAIN_INTERVAL, { leading: true, trailing: true })
