import { getConfig, ONRMConfig, ONRMRC, RegistryConfig, saveConfig } from './config'
import inquirer from 'inquirer'
import { npm, RegistryManager, yarn } from './registryManager'
import chalk from 'chalk'
import { printTable } from './print'
import highlight from 'cli-highlight'

const managers: Record<string, RegistryManager> = {
  npm,
  yarn
}

async function add(name: string, registry: string, homeUrl: string = '') {
  const currentConf: RegistryConfig = {
    registry: String(registry),
    home: String(homeUrl)
  }

  const conf = getConfig()
  const existConf = conf.registries[name]

  if (existConf) {
    const answer = await inquirer.prompt({
      message: `Found exist registry [${chalk.blue(name)}], override it ?`,
      name: 'isOverride',
      type: 'confirm',
      default: true
    })
    console.log()

    if (answer.isOverride) {
      Object.assign(existConf, currentConf)
      saveConfig(conf)

      console.log(`Update registry [${chalk.blue(name)}](${chalk.green(registry)}) successful.`)
      return
    }

    ls()
    return
  }

  conf.registries[name] = currentConf

  saveConfig(conf)
  console.log(`Add registry [${chalk.blue(name)}](${chalk.green(registry)}) successful.`)
}

function del(name: string) {
  const conf = getConfig()

  const exist = conf.registries[name]
  if (!exist) {
    console.log(`Not found registry for [${chalk.blue(name)}].\n`)
    _printRegistry(conf.registries)
    return
  }

  delete conf.registries[name]
  saveConfig(conf)
  console.log(`Delete registry [${chalk.blue(name)}](${chalk.green(exist.registry)}) successful.`)
}

function use(name: string, type?: 'npm' | 'yarn') {
  const conf = getConfig()
  const registryConf = conf.registries[name]

  if (!registryConf) {
    console.log(`Not found registry named [${name}]!\n`)
    _printRegistry(conf.registries)
    return
  }

  if (type) {
    managers[type].setConfig('registry', registryConf.registry)
    console.log(`Set registry(${name}) for [${type}] successful!`)
    return
  }

  for (const key in managers) {
    const manager = managers[key]
    manager.setConfig('registry', registryConf.registry)
  }

  console.log(
    `Set registry(${chalk.blue(`${name}-${registryConf.registry}`)}) for` +
      ` [${chalk.green(Object.keys(managers).join(', '))}] successful!`
  )
}

function _printRegistry(registries: ONRMConfig['registries']) {
  const table: string[][] = []

  const used: { type: string; registry: string }[] = []

  for (const key in managers) {
    const manager = managers[key]
    used.push({
      type: key,
      registry: manager.getConfig('registry')
    })
  }

  table.push(['*', 'Name', 'Registry', 'Home url', 'Used by'])

  for (const key in registries) {
    const registryConf = registries[key]

    const usedBy = used
      .filter((u) => u.registry.replace(/\/$/, '') === registryConf.registry.replace(/\/$/, ''))
      .map((u) => u.type)
      .join(', ')

    table.push([usedBy ? '*' : '', key, registryConf.registry, registryConf.home || '', usedBy])
  }

  printTable(table)
}

function ls() {
  const conf = getConfig()
  _printRegistry(conf.registries)
}

function config() {
  const conf = getConfig()

  console.log('Config path:', chalk.green(ONRMRC), '\n')

  console.log(highlight(JSON.stringify(conf, null, 2), { language: 'json', ignoreIllegals: true }))
}

export const actions = {
  add,
  use,
  del,
  ls,
  config
}
