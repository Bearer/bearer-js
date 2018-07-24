import * as getPort from 'get-port'
import * as Router from 'koa-router'
import * as unzip from 'unzip-stream'
import * as fs from 'fs-extra'
import * as cosmiconfig from 'cosmiconfig'

import server = require('./server')
import Storage from './storage'
import { buildIntents } from '../../deployScenario'
import LocationProvider from '../../locationProvider'

function startLocalDevelopmentServer(scenarioUuid, emitter, config, locator: LocationProvider) {
  const rootLevel = locator.scenarioRoot
  const buildDir = locator.intentsBuildDir

  const LOCAL_DEV_CONFIGURATION = 'dev'
  const explorer = cosmiconfig(LOCAL_DEV_CONFIGURATION, {
    searchPlaces: [`config.${LOCAL_DEV_CONFIGURATION}.js`]
  })
  const router = new Router({ prefix: '/api/v1/' })

  return new Promise(async (resolve, reject) => {
    try {
      const { config: devIntentsContext = {} } = (await explorer.search(rootLevel)) || {}
      const intentsArtifact = await buildIntents(scenarioUuid, emitter, config, locator)

      fs.ensureDirSync(buildDir)
      await new Promise((resolve, reject) => {
        fs.createReadStream(intentsArtifact)
          .pipe(unzip.Extract({ path: buildDir }))
          .on('close', resolve)
          .on('error', reject)
      })
      const lambdas = require(buildDir)

      const { integration_uuid, intents } = require(locator.intentsBuildResourcePath('bearer.config.json'))

      const port = await getPort({ port: 3000 })
      const bearerBaseURL = `http://localhost:${port}/`
      for (let intent of intents) {
        const intentName = Object.keys(intent)[0]
        const endpoint = `${integration_uuid}/${intentName}`
        router.all(
          endpoint,
          (ctx, next) =>
            new Promise((resolve, reject) => {
              lambdas[intentName](
                {
                  context: {
                    ...devIntentsContext.global,
                    ...devIntentsContext[intentName],
                    bearerBaseURL
                  },
                  queryStringParameters: ctx.query,
                  body: ctx.request.body
                },
                {},
                (err, datum) => {
                  ctx.intentDatum = datum
                  next()
                  resolve()
                }
              )
            }),
          ctx => ctx.ok(ctx.intentDatum)
        )
      }
      const storage = Storage()
      server.use(storage.routes())
      server.use(storage.allowedMethods())
      server.use(router.routes())
      server.use(router.allowedMethods())

      server.listen(port, () => {
        emitter.emit('start:localServer:start', { port })
        emitter.emit('start:localServer:endpoints', {
          endpoints: [...storage.stack, ...router.stack]
        })
      })

      resolve(bearerBaseURL)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = startLocalDevelopmentServer
