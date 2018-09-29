# NPM Registry Manager

Another NPM registry manager, like the [nrm](https://github.com/Pana/nrm)

- Support npm and yarn

## Install

```
$ npm install -g onrm

# or

$ yarn global add onrm
```

## Example

- ls

```
$ onrm ls

* npm ------ https://registry.npmjs.org/ [npm]
  cnpm ----- http://r.cnpmjs.org/
* taobao --- https://registry.npm.taobao.org/ [yarn]
  nj ------- https://registry.nodejitsu.com/
  rednpm --- http://registry.mirror.cqupt.edu.cn/
  npmMirror  https://skimdb.npmjs.com/registry/
  edunpm --- http://registry.enpmjs.org/
```

- current

```
$ onrm current

npm ---- https://registry.npmjs.org/
yarn --- https://registry.npm.taobao.org/
```

- use

```
$ onrm use taobao

set ( npm, yarn ) registry https://registry.npm.taobao.org/

$ onrm use npm npm

set ( npm ) registry https://registry.npmjs.org/

$ onrm use npm yarn

set ( yarn ) registry https://registry.npmjs.org/
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
  use <name> [type]        Change registry to registry, type is one of [yarn, npm]
  add <name> <url> [home]  Add one custom registry
  del <name>               Delete one custom registry
  help                     Print this help
```
