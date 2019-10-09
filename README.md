# Bearer - The API Integration Framework

<p align="center">
  <a href="https://www.bearer.sh">
    <img alt="Bearer Documentation" src="https://static.bearer.sh/assets/share-min.jpg" width="500">
  </a>

  <p align="center">

Bearer provides all of the tools to build, run and manage API
<br/>
<a href="https://www.bearer.sh/?utm_source=github&utm_campaign=repository">Learn more</a>

  </p>
</p>

---

[![Version][version-svg]][package-url]
[![License][license-image]][license-url]
[![Build Status][ci-svg]][ci-url]

<details>
  <summary><strong>Table of contents</strong></summary>

- [Bearer - The API Integration Framework](#bearer---the-api-integration-framework)
  - [Why](#why)
  - [Documentation](#documentation)
  - [Contributing](#contributing)
  - [License](#license)
    </details>

## Why

You should use Bearer if you want to:

- Consume any API in minutes
- Map API endpoints to your app model
- Integrate into your code with one line
- Deploy and Scale without fuss
- Monitor every API call
- Manage your integrations

## Documentation

The documentation is available on the Bearer [doc center](http://docs.bearer.sh).

## Development

### Requirements

### CI/CD update

```bash
cp .envrc{.example,}
```

Install drone-cli
Install on linux:

```bash
curl -L https://github.com/drone/drone-cli/releases/latest/download/drone_linux_amd64.tar.gz | tar zx
sudo install -t /usr/local/bin drone
```

Install on MacOS:

```bash
brew tap drone/drone
brew install drone
```

## Contributing

We welcome all contributors, from casual to regular 💙

- **Bug report**. Is something not working as expected? [Send a bug report](https://github.com/bearer/bearer-js/issues/new).
- **Feature request**. Would you like to add something to the framework? [Send a feature request](https://github.com/bearer/bearer-js/issues/new).
- **Documentation**. Did you find a typo in the doc? [Open an issue](https://github.com/bearer/bearer-js/issues/new) and we'll take care of it.
- **Development**. If you don't know where to start, you can check the [open issues](https://github.com/bearer/bearer-js/issues?q=is%3Aissue+is%3Aopen).

To start contributing to code, you need to:

1. [Fork the project](https://help.github.com/articles/fork-a-repo/)
2. [Clone the repository](https://help.github.com/articles/cloning-a-repository/)
3. Checkout the [Getting Started](GETTING_STARTED.md)

## License

Bearer is [MIT licensed][license-url].

<!-- Badges -->

[version-svg]: https://img.shields.io/npm/v/@bearer/react.svg?style=flat-square
[package-url]: https://npmjs.org/package/@bearer/cli
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[ci-svg]: https://cloud.drone.io/api/badges/Bearer/bearer-js/status.svg
[ci-url]: https://cloud.drone.io/Bearer/bearer-js
[license-url]: LICENSE

<!-- Links -->

[bearer-website]: https://www.bearer.sh/?utm_source=github&utm_campaign=repository
