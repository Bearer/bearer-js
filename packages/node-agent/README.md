# @bearer/node-agent

The bearer's node agent is a module that helps you send diagnostic data to the bearer's platform.

## Getting started

### Add the agent to you application.

```bash
npm install @bearer/node-agent
#or
yarn add @bearer/node-agent
```

### Configure the agent

Use a config file

```bash
echo '{ secret_key: "YOUR_SECRET_KEY" }' > bearer.json
```

or provide required environment variables

```bash
export BEARER_SECRET_KEY='YOUR_SECRET_KEY'
```

### Require the agent the earlier as possible during the startup phase of you application.

_Assuming index.js is your application entrypoint_

```javascript
require('@bearer/node-agent')

// you application code goes here. ex:
const express = require('express')
//....
```
