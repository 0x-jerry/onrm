import minimist from 'minimist'
import { actions } from './actions'
import pc from 'picocolors'
import { version } from '../package.json'

const argv = minimist(process.argv.slice(2))

resolveArgv(argv)

async function resolveArgv(argv: any = {}) {
  const { help, h } = argv
  const [actionName, ...params] = argv._
  console.log(pc.cyan(`onrm v${version}`), '\n')

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

  try {
    await action(...params)
  } catch (error) {
    console.log(error)
  }
}

function printUsage() {
  console.log(`  Usage: onrm [command] [options]

  Options:

    -h, --help                    output usage information

  Commands:

    ls                            List all the registries
    config                        Output config file path, and content
    use <name> [type]             Change registry to registry, type is one of [yarn, npm, bun]
    add <name> <registry> [home]  Add one custom registry
    rm <name>                     Delete one custom registry
    rename <old name> <new name>  Rename exist registry
`)
}
