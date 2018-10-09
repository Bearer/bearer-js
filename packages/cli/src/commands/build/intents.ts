import { flags } from '@oclif/command'
import * as globby from 'globby'
import * as Listr from 'listr'
import * as path from 'path'
import * as webpack from 'webpack'

import BaseCommand from '../../BaseCommand'
import installDependencies from '../../tasks/installDependencies'
import { RequireScenarioFolder } from '../../utils/decorators'
import GenerateApiDocumenation from '../generate/apiDocumentation'

const skipInstall = 'skip-install'

export default class BuildIntents extends BaseCommand {
  static description = 'Build scenario intents'
  static hidden = true
  static flags = {
    ...BaseCommand.flags,
    [skipInstall]: flags.boolean({})
  }

  static args = []

  @RequireScenarioFolder()
  async run() {
    const { flags } = this.parse(BuildIntents)

    const tasks: Array<Listr.ListrTask> = [
      {
        title: 'Generate intents',
        task: async (ctx: any, _task: any) => {
          ctx.files = await this.transpile(this.locator.srcIntentsDir, this.locator.buildIntentsResourcePath('dist'))
        }
      },
      {
        title: 'Generate openapi.json',
        task: async (_ctx: any, _task: any) => {
          await GenerateApiDocumenation.run(['--silent'])
        }
      }
    ]
    if (!flags[skipInstall]) {
      tasks.unshift(installDependencies({ cwd: this.locator.scenarioRoot }))
    }

    try {
      const ctx = await new Listr(tasks).run()
      this.debug('Transpiled :\n', ctx.files.join('\n  * '))
      this.success('Built intents')
    } catch (e) {
      this.error(e)
    }
  }

  transpile = (entriesPath: string, distPath: string): Promise<Array<string>> => {
    return new Promise<Array<string>>(async (resolve, reject) => {
      try {
        const files = await globby([`${entriesPath}/*.ts`])
        if (!files.length) {
          return reject(new Error('No intent to transpile'))
        }

        const config: webpack.Configuration = {
          ...baseConfig,
          // optimization: {
          //   minimize: false
          // },
          entry: getEntries(files),
          output: {
            libraryTarget: 'commonjs2',
            filename: '[name].js',
            path: distPath
          }
        }

        webpack(config, (err: any, stats: webpack.Stats) => {
          if (err || stats.hasErrors()) {
            reject(
              stats.toString({
                builtAt: false,
                entrypoints: false,
                assets: false,
                version: false,
                timings: false,
                hash: false,
                modules: false,
                chunks: false, // Makes the build much quieter
                colors: true // Shows colors in the console
              })
            )
          } else {
            resolve(files)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

function getEntries(files: Array<string>): webpack.Entry {
  return files.reduceRight(
    (entriesAcc, file) => ({
      ...entriesAcc,
      [path.basename(file).split('.')[0]]: file
    }),
    {}
  )
}

const baseConfig: Partial<webpack.Configuration> = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            allowUnreachableCode: false,
            declaration: false,
            lib: ['es2017'],
            noUnusedLocals: false,
            noUnusedParameters: false,
            allowSyntheticDefaultImports: true,
            experimentalDecorators: true,
            moduleResolution: 'node',
            module: 'es6',
            target: 'es2017'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  target: 'node'
}
