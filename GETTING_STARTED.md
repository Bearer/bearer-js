# Bearer

This repository contains

- [@bearer/express](./packages/express)
- [@bearer/js](./packages/js)
- [@bearer/node](./packages/node)
- [@bearer/react](./packages/react)

## How to get Started

**Install NVM**: [site link](https://github.com/creationix/nvm)

Mac Users:

```bash
brew install nvm
```

_Follow carefully post install instructions_

**Install correct node version**

```bash
nvm install
nvm use
```

---

We use [Lerna](https://github.com/lerna/lerna) to manage dependencies.

```bash
// install dependencies
yarn install


// Install dependencies and link packages together
yarn lerna bootstrap
```

_Now You should be able to go into each packages and run existing command (ex: yarn start)_

## Development

### Conventional commits

As we try to be as clear as possible on changes within bearer packages, we adopted [conventional commits](https://conventionalcommits.org/) as pattern for git commits.

_Learn more https://conventionalcommits.org/_

This repository is [commitizen](https://github.com/commitizen/cz-cli) friendly, which means you can use the below command to generate your commits. (in the root directory).

_Learn more about Commitizen and available solutions https://github.com/commitizen/cz-cli_

```bash
yarn cm
```

Using conventional commits allow us (through lerna) to generate automatically the [CHANGELOG](./CHANGELOG.md) and pick the correct version

### Local package use

Sometimes you need to test locally your changes before publishing anything. Here's some tips you can use.

If you want to use these packages in a local environment (in repositories not contained in this one)

_assuming we have a package named "@bearer/node"_

```bash
lerna exec yarn link --scope='@bearer/node'

// somewhere else on you computer inside a integration, for example

yarn link '@bearer/node'
```
