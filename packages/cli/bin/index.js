#!/usr/bin/env node

require('../scripts/check-version')
const { version } = require('../package.json')
const { CLI } = require('../lib/cli')
const setupConfig = require('../lib/setupConfig')

const EventEmitter = require('events')

const emitter = new EventEmitter()
const inquirer = require('inquirer')

const config = setupConfig()
const program = require('commander')
const deployCmd = require('../lib/commands/deployCommand')
const generateCmd = require('../lib/commands/generateCommand')
const initCmd = require('../lib/commands/initCommand')
const signupCmd = require('../lib/commands/signupCommand')
const loginCmd = require('../lib/commands/loginCommand')

const cliOutput = require('../lib/cliOutput.js')

const cli = new CLI(program, emitter, config)
cliOutput(emitter, config)

program.version(version, '-v, --version')

cli.use(initCmd)
cli.use(generateCmd)
cli.use(deployCmd)
cli.use(signupCmd)
cli.use(loginCmd)

cli.parse(process.argv)
