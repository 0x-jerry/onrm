# NPM Registry Manager

Another NPM registry manager, like the [nrm](https://github.com/Pana/nrm)

## Install

```sh
npm install -g onrm

# or

yarn global add onrm
```

## Usage

```
Usage: onrm [options] [command]

Options:

  -V, --version            output the version number
  -h, --help               output usage information

Commands:

  ls                       List all the registries
  current                  Show current registry name
  use <name>               Change registry to registry
  add <name> <url> [home]  Add one custom registry
  del <name>               Delete one custom registry
  help                     Print this help
```
