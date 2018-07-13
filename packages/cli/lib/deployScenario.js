const pathJs = require('path')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const { prepare } = require('./commands/startCommand')
const buildArtifact = require('./buildArtifact')
const pushScenario = require('./pushScenario')
const pushScreens = require('./pushScreens')
const assembly = require('./assemblyScenario')
const storeCredentials = require('./storeCredentials')
const refreshToken = require('./refreshToken')
const invalidateCloudFront = require('./invalidateCloudFront')

const AUTH_CONFIG_FILE = 'auth.config.json'

const deployIntents = ({ scenarioUuid }, emitter, config) =>
  new Promise(async (resolve, reject) => {
    const { rootPathRc } = config

    if (!rootPathRc) {
      emitter.emit('rootPath:doesntExist')
      process.exit(1)
    }

    const rootLevel = pathJs.dirname(rootPathRc)
    const artifactDirectory = pathJs.join(rootLevel, '.bearer')
    const intentsDirectory = pathJs.join(rootLevel, 'intents')

    if (!fs.existsSync(artifactDirectory)) {
      fs.mkdirSync(artifactDirectory)
    }

    const scenarioArtifact = pathJs.join(
      artifactDirectory,
      `${scenarioUuid}.zip`
    )
    const handler = pathJs.join(artifactDirectory, config.HandlerBase)
    const output = fs.createWriteStream(scenarioArtifact)

    try {
      emitter.emit('intents:installingDependencies')
      await exec('yarn install', { cwd: intentsDirectory })

      await buildArtifact(
        output,
        handler,
        { path: intentsDirectory, scenarioUuid },
        emitter
      )

      const authConfigFilePath = pathJs.join(intentsDirectory, AUTH_CONFIG_FILE)
      await storeCredentials(authConfigFilePath, config, emitter)

      await pushScenario(
        scenarioArtifact,
        {
          Key: scenarioUuid
        },
        emitter,
        config
      )

      await assembly(scenarioUuid, emitter, config)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const deployScreens = ({ scenarioUuid }, emitter, config) =>
  new Promise(async (resolve, reject) => {
    const {
      scenarioConfig: { scenarioTitle },
      bearerConfig: { OrgId },
      BearerEnv
    } = config

    try {
      const { buildDirectory: screensDirectory } = await prepare(
        emitter,
        config
      )()
      if (!screensDirectory) {
        process.exit(1)
        return false
      }

      emitter.emit('screens:generateSetupComponent')
      await exec('bearer generate --setup', { cwd: screensDirectory })

      emitter.emit('screens:generateConfigComponent')
      await exec('bearer generate --config', { cwd: screensDirectory })

      emitter.emit('screens:buildingDist')
      await exec('yarn build', {
        cwd: screensDirectory,
        pwd: screensDirectory,
        env: {
          BEARER_SCENARIO_ID: scenarioUuid,
          ...process.env,
          CDN_HOST: `https://static.${BearerEnv}.bearer.sh/${OrgId}/${scenarioTitle}/dist/${scenarioTitle}/`
        }
      })

      emitter.emit('screens:pushingDist')
      await pushScreens(screensDirectory, scenarioTitle, OrgId, emitter, config)

      emitter.emit('screen:upload:success')
      await invalidateCloudFront(emitter, config)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

module.exports = {
  deployIntents,
  deployScreens,
  deployScenario: ({ scenarioUuid }, emitter, config) =>
    new Promise(async (resolve, reject) => {
      try {
        const { ExpiresAt } = config.bearerConfig
        let calculatedConfig = config

        if (ExpiresAt < Date.now()) {
          calculatedConfig = await refreshToken(config, emitter)
        }
        await deployIntents({ scenarioUuid }, emitter, calculatedConfig)
        await deployScreens({ scenarioUuid }, emitter, calculatedConfig)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
}
