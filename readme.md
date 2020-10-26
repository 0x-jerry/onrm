# NPM Registry Manager

Another NPM registry manager, like the [nrm](https://github.com/Pana/nrm)

- Support npm, yarn, and all other tools that read config from `.npmrc` or `.yarnrc`

## Install

```
$ npm install -g onrm

# or

$ yarn global add onrm
```

## Example

![example](./assets/example.gif)

## Usage

```
  Usage: onrm [command] [options]

  Options:

    -h, --help                    output usage information

  Commands:

    ls                            List all the registries
    config                        Output config file path, and content
    use <name> [type]             Change registry to registry, type is one of [yarn, npm]
    add <name> <registry> [home]  Add one custom registry
    rm <name>                     Delete one custom registry
    rename <old name> <new name>  Rename exist registry
```
