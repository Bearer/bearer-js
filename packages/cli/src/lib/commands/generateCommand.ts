import * as copy from 'copy-template-dir'
import * as del from 'del'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as Case from 'case'
import * as intents from '@bearer/intents'
import * as templates from '@bearer/templates'
import * as rc from 'rc'
import Locator from '../locationProvider'

const INTENT = 'intent'
const VIEW = 'view'
enum TemplateTypes {
  setup = 'setup'
}
async function generateTemplates({
  emitter,
  templateType,
  locator
}: {
  emitter: any
  templateType: TemplateTypes
  locator: Locator
}) {
  const authConfig = require(locator.authConfigPath)

  const scenarioConfig = rc('scenario')
  const { scenarioTitle } = scenarioConfig

  const configKey = `${templateType}Views`

  const inDir = path.join(__dirname, `templates/generate/${templateType}`)
  const outDir = locator.buildViewsComponentsDir

  await del(`${outDir}*${templateType}*.tsx`).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'))
  })

  if (authConfig[configKey] && authConfig[configKey].length) {
    const vars = {
      componentName: Case.pascal(scenarioTitle),
      componentTagName: Case.kebab(scenarioTitle),
      fields: JSON.stringify(authConfig[configKey])
    }

    copy(inDir, outDir, vars, (err, createdFiles) => {
      if (err) throw err
      createdFiles.forEach(filePath => emitter.emit('generateIntent:fileGenerated', filePath))
    })
  }
}

const generate = (emitter, {}, locator: Locator) => async env => {
  const { scenarioRoot } = locator
  if (!scenarioRoot) {
    emitter.emit('rootPath:doesntExist')
    process.exit(1)
  }

  if (env.setup) {
    return generateTemplates({
      emitter,
      templateType: TemplateTypes.setup,
      locator
    })
  }

  if (env.blankView && typeof env.blankView === 'string') {
    return generateView({ emitter, locator, name: env.blankView, type: 'blank' })
  }

  if (env.blankView) {
    return generateView({ emitter, locator, type: 'blank' })
  }

  if (env.collectionView && typeof env.collectionView === 'string') {
    return generateView({ emitter, locator, name: env.collectionView, type: 'collection' })
  }

  if (env.collectionView) {
    return generateView({ emitter, locator, type: 'collection' })
  }

  const { template } = await inquirer.prompt([
    {
      message: 'What do you want to generate',
      type: 'list',
      name: 'template',
      choices: [
        {
          name: 'Intent',
          value: INTENT
        },
        {
          name: 'View',
          value: VIEW
        }
      ]
    }
  ])

  const params = { emitter, locator }

  switch (template) {
    case INTENT:
      generateIntent(params)
      break
    case VIEW:
      await generateView(params)
      break
    default:
  }
}

async function askForName() {
  const { name } = await inquirer.prompt([
    {
      message: 'Give it a name',
      type: 'input',
      name: 'name'
    }
  ])

  return name.trim()
}

async function generateView({
  emitter,
  locator,
  name,
  type
}: {
  locator: Locator
  emitter: any
  name?: string
  type?: string
}) {
  if (!name) {
    name = await askForName()
  }

  if (!type) {
    const typePrompt = await inquirer.prompt([
      {
        message: 'What type of view do you want to generate',
        type: 'list',
        name: 'type',
        choices: [
          {
            name: 'Blank',
            value: 'blank'
          },
          {
            name: 'Collection',
            value: 'collection'
          }
        ]
      }
    ])
    type = typePrompt.type
  }

  const componentName = Case.pascal(name)
  const vars = {
    viewName: componentName,
    componentTagName: Case.kebab(componentName)
  }
  const inDir = path.join(__dirname, 'templates/generate', type + 'View')
  const outDir = path.join(locator.srcViewsDir, 'components')

  copy(inDir, outDir, vars, (err, createdFiles) => {
    if (err) throw err
    createdFiles.forEach(filePath => emitter.emit('generateView:fileGenerated', filePath))
  })
}

const filteredChoices = (intents: Record<string, any>, propertyFlag) =>
  Object.keys(intents)
    .filter(intent => intents[intent][propertyFlag])
    .map(intent => ({
      name: intents[intent].display,
      value: intent
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

const choices = [
  ...filteredChoices(intents, 'isGlobalIntent'),
  new inquirer.Separator(),
  ...filteredChoices(intents, 'isStateIntent')
]

function getActionExample(intentType, authType) {
  return templates[authType][intentType]
}

async function generateIntent({ emitter, locator }: { emitter: any; locator: Locator }) {
  const { intentType } = await inquirer.prompt([
    {
      message: 'What type of intent do you want to generate',
      type: 'list',
      name: 'intentType',
      choices
    }
  ])
  const name = await askForName()
  const authConfig = require(locator.authConfigPath)
  const actionExample = getActionExample(intentType, authConfig.authType)
  const vars = { intentName: name, authType: authConfig.authType, intentType, actionExample }
  const inDir = path.join(__dirname, 'templates/generate/intent')
  const outDir = locator.srcIntentsDir

  copy(inDir, outDir, vars, (err, createdFiles) => {
    if (err) throw err
    createdFiles.forEach(filePath => emitter.emit('generateIntent:fileGenerated', filePath))
  })
}

export function useWith(program, emitter, config, locator): void {
  program
    .command('generate')
    .alias('g')
    .description(
      `Generate intent or view.
    $ bearer generate
  `
    )
    // .option('-t, --type <intentType>', 'Intent type.')
    .option('--blank-view [name]', 'generate blank view')
    .option('--collection-view [name]', 'generate collection view')
    .option('--setup', 'generate setup file')
    .action(generate(emitter, config, locator))
}
