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
      path: '/poc/ingest',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    res => {
      let data = ''

      // A chunk of data has been recieved.
      res.on('data', chunk => {
        data += chunk
        console.log('[BEARER]', 'data', data, res.statusCode)
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.error('All set')
        } else {
          queue.push(...reportItems)
        }
        setImmediate(drain)
      })
    }
  )
  req.on('error', () => {
    console.error('Error while reporting to bearer')
    queue.push(...reportItems)
    setImmediate(drain)
  })
  req.write(JSON.stringify({ clientId: getConfig().secret_key, logs: reportItems }))
  req.end()
}

process.on('SIGTERM', () => {
  imperativeDrain()
})
const drain = throttle(imperativeDrain, DRAIN_INTERVAL, { leading: true, trailing: true })
