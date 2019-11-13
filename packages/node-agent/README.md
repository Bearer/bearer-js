# @bearer/node-agent

TODO

## Installation

First, you'll need a Bearer's Secret Key: https://app.bearer.sh/keys

```bash
npm install @bearer/node-agent
# or
yarn add @bearer/node-agent
```

Configure the Bearer's agent with your secert key:

```bash
echo '{ "secret": "you private key" }' > bearer.json
```

At the top of the main module of your app, add:

```js
require('@bearer/node-agent')
```

Final step: `start your application` :-)

## Configuration

Bearer allows you to setup your up using both environment variables and bearer.yml file.

### Using ENV variables

| Variable name            |                                                                                 |          |
| ------------------------ | ------------------------------------------------------------------------------- | -------- |
| BEARER_SECRET_KEY        | Your Bearer private key                                                         | Required |
| BEARER_AGENT_DISABLED    | Disbale the bearer agent is this variable is set (whatever the value is)        | Optional |
| BEARER_AGENT_IGNORE      | Comma separated list of domain you do not want to be monitored by the agent     | Optional |
| BEARER_AGENT_LOG_LEVEL   | `ALL` or `RESTRICTED` set the level of information you want the agent to gather | Optional |
| BEARER_AGENT_FILTERED    | Comma separated list of header names you want to be filtered                    | Optional |
| BEARER_AGENT_CONFIG_FILE | Absolute location of your `bearer.json`                                         | Optional |

### Using json file

Bearer will try to find the `bearer.json` configuration file in root source of your project.
Below you can find configuration options we support currently:

```json
{
  "debugLevel": "RESTRICTED",
  "disabled": false,
  "secret": "your secret key",
  "ignored": ["domain.com", "example.com"],
  "filtered": "header-to-filter"
}
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Bearer/bearer-js . This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.
