# @bearer/cli

Bearer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@bearer/cli.svg)](https://npmjs.org/package/@bearer/cli)

[![CircleCI](https://circleci.com/gh/Bearer/bearer/packages/cli/tree/master.svg?style=shield)](https://circleci.com/gh/Bearer/bearer/packages/cli/tree/master)

[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/Bearer/bearer/packages/cli?branch=master&svg=true)](https://ci.appveyor.com/project/Bearer/bearer/packages/cli/branch/master)
[![Codecov](https://codecov.io/gh/Bearer/bearer/packages/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/Bearer/bearer/packages/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@bearer/cli.svg)](https://npmjs.org/package/@bearer/cli)
[![License](https://img.shields.io/npm/l/@bearer/cli.svg)](https://github.com/Bearer/bearer/packages/cli/blob/master/package.json)

<!-- toc -->
* [@bearer/cli](#bearer-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @bearer/cli
$ bearer COMMAND
running command...
$ bearer (-v|--version|version)
@bearer/cli/0.103.0 linux-x64 node-v10.15.3
$ bearer --help [COMMAND]
USAGE
  $ bearer COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bearer autocomplete [SHELL]`](#bearer-autocomplete-shell)
* [`bearer encrypt ENCRYPTIONKEY MESSAGE`](#bearer-encrypt-encryptionkey-message)
* [`bearer generate`](#bearer-generate)
* [`bearer generate:component [NAME]`](#bearer-generatecomponent-name)
* [`bearer generate:function [NAME]`](#bearer-generatefunction-name)
* [`bearer help [COMMAND]`](#bearer-help-command)
* [`bearer invoke FUNCTION_NAME`](#bearer-invoke-function-name)
* [`bearer link INTEGRATION_IDENTIFIER`](#bearer-link-integration-identifier)
* [`bearer login`](#bearer-login)
* [`bearer new [INTEGRATIONNAME]`](#bearer-new-integrationname)
* [`bearer push`](#bearer-push)
* [`bearer start`](#bearer-start)

## `bearer autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ bearer autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ bearer autocomplete
  $ bearer autocomplete bash
  $ bearer autocomplete zsh
  $ bearer autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.0/src/commands/autocomplete/index.ts)_

## `bearer encrypt ENCRYPTIONKEY MESSAGE`

Encrypt using bearer security

```
USAGE
  $ bearer encrypt ENCRYPTIONKEY MESSAGE

OPTIONS
  -h, --help   show CLI help
  --path=path
  --silent
```

_See code: [src/commands/encrypt.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/encrypt.ts)_

## `bearer generate`

Generate Function or Component

```
USAGE
  $ bearer generate

OPTIONS
  -h, --help   show CLI help
  --path=path
  --silent

ALIASES
  $ bearer g
```

_See code: [src/commands/generate/index.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/generate/index.ts)_

## `bearer generate:component [NAME]`

Generate a Bearer component

```
USAGE
  $ bearer generate:component [NAME]

OPTIONS
  -h, --help                        show CLI help
  -t, --type=blank|collection|root
  --path=path
  --silent

ALIASES
  $ bearer g:c
```

_See code: [src/commands/generate/component.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/generate/component.ts)_

## `bearer generate:function [NAME]`

Generate a Bearer Function

```
USAGE
  $ bearer generate:function [NAME]

OPTIONS
  -h, --help             show CLI help
  -t, --type=fetch|save
  --path=path
  --silent

ALIASES
  $ bearer g:f
```

_See code: [src/commands/generate/function.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/generate/function.ts)_

## `bearer help [COMMAND]`

display help for bearer

```
USAGE
  $ bearer help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `bearer invoke FUNCTION_NAME`

Invoke Function locally

```
USAGE
  $ bearer invoke FUNCTION_NAME

OPTIONS
  -h, --help       show CLI help
  -p, --path=path
```

_See code: [src/commands/invoke.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/invoke.ts)_

## `bearer link INTEGRATION_IDENTIFIER`

Link your local integration to a remote one

```
USAGE
  $ bearer link INTEGRATION_IDENTIFIER

OPTIONS
  -h, --help   show CLI help
  --path=path
  --silent
```

_See code: [src/commands/link.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/link.ts)_

## `bearer login`

Login to Bearer platform

```
USAGE
  $ bearer login

OPTIONS
  -e, --email=email
  -h, --help         show CLI help
  --path=path
  --silent
```

_See code: [src/commands/login.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/login.ts)_

## `bearer new [INTEGRATIONNAME]`

Generate a new integration

```
USAGE
  $ bearer new [INTEGRATIONNAME]

OPTIONS
  -a, --authType=OAUTH1|OAUTH2|BASIC|APIKEY|NONE  Authorization type
  -h, --help                                      show CLI help
  --path=path
  --silent
```

_See code: [src/commands/new.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/new.ts)_

## `bearer push`

Deploy Integration to Bearer Platform

```
USAGE
  $ bearer push

OPTIONS
  -h, --help   show CLI help
  --path=path
  --silent
```

_See code: [src/commands/push.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/push.ts)_

## `bearer start`

Start local development environment

```
USAGE
  $ bearer start

OPTIONS
  -h, --help    show CLI help
  --no-install
  --no-open
```

_See code: [src/commands/start.ts](https://github.com/Bearer/bearer/blob/v0.103.0/src/commands/start.ts)_
<!-- commandsstop -->
