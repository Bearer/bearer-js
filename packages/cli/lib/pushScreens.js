const AWS = require('aws-sdk') // from AWS SDK
const fs = require('fs') // from node.js
const path = require('path') // from node.js
const globby = require('globby')
const mime = require('mime-types')
const rc = require('rc')
const serviceClient = require('./serviceClient')

const DIST_DIRECTORY = 'dist'
const WWW_DIRECTORY = 'www'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const pushScreens = async (
  screensDirectory,
  scenarioTitle,
  OrgId,
  emitter,
  {
    DeploymentUrl,
    bearerConfig: {
      authorization: {
        AuthenticationResult: { IdToken: token }
      }
    }
  }
) =>
  new Promise(async (resolve, reject) => {
    const configuration = {
      distPath: path.join(screensDirectory, DIST_DIRECTORY),
      wwwPath: path.join(screensDirectory, WWW_DIRECTORY)
    }

    const integrationsClient = serviceClient(DeploymentUrl)
    try {
      emitter.emit('screen:upload:start')

      const files = await globby([
        configuration.distPath,
        configuration.wwwPath
      ])

      const paths = files.map(filePath =>
        filePath.replace(screensDirectory + path.sep, '')
      )

      await asyncForEach(files, async (filePath, i) => {
        try {
          const fileContent = fs.readFileSync(filePath)
          const Key = `${OrgId}/${scenarioTitle}/${paths[i]}`
          const res = await integrationsClient.signedUrl(token, Key, 'screen')
          const s3Client = serviceClient(res.body)
          await s3Client.upload(fileContent.toString(), {
            'Content-Type': mime.lookup(filePath)
          })
        } catch (e) {
          emitter.emit('screen:fileUpload:error', e)
          reject(e)
        }
      })
      resolve('done')
    } catch (e) {
      emitter.emit('screen:upload:error', e)
      reject(e)
    }
  })

module.exports = pushScreens
