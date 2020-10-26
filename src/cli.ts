import minimist from 'minimist'
import fs from 'fs'
import path from 'path'
import { actions } from './actions'
import chalk from 'chalk'

const argv = minimist(process.argv.slice(2))

resolveArgv(argv)

function resolveArgv(argv: any = {}) {
  const { help, h } = argv
  const [actionName, ...params] = argv._
  console.log(chalk.cyan(`onrm v${getVersion()}`), '\n')

  if (help || h || !actionName) {
    printUsage()
    return
  }

  type ACTIONS = keyof typeof actions

  const action: Function | undefined = actions[actionName as ACTIONS]

  if (!action) {
    printUsage()
    return
  }

  action(...params)
}

function printUsage() {
  console.log(`  Usage: onrm [options] [command]

  Options:

    -h, --help                    output usage information

  Commands:

    ls                            List all the registries
    config                        Output config file path, and content
    use <name> [type]             Change registry to registry, type is one of [yarn, npm]
    add <name> <registry> [home]  Add one custom registry
    rm <name>                     Delete one custom registry
    rename <old name> <new name>  Rename exist registry
`)
}

function getVersion(): string {
  const pkgPath = path.join(__dirname, '..', 'package.json')
  const pkgStr = fs.readFileSync(pkgPath, { encoding: 'utf-8' })
  const pkg = JSON.parse(pkgStr)

  return pkg.version
}
