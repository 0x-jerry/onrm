# NPM Registry Manager

[![Npm Version](https://img.shields.io/badge/latest-v1.0.5-brightgreen.svg)](https://github.com/cwxyz007/onrm)
[![Node Version](https://img.shields.io/badge/node-8.x-brightgreen.svg)](https://nodejs.org)

Another NPM registry manager, like the [nrm](https://github.com/Pana/nrm)

- Support npm, yarn, and all other tools that read config from `.npmrc` or `.yarnrc`

## Install

```
$ npm install -g onrm

# or

$ yarn global add onrm
```

## Example

## Usage

```
  Usage: onrm [command] [options]

  Options:

    -h, --help                    output usage information

  Commands:

    ls                            List all the registries
    config                        Output onrm config content
    use <name> [type]             Change registry to registry, type is one of [yarn, npm]
    add <name> <registry> [home]  Add one custom registry
    del <name>                    Delete one custom registry
```
