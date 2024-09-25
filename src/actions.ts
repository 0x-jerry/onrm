import { getConfig, type ONRMConfig, ONRMRC, type RegistryConfig, saveConfig } from './config'
import { confirm } from '@inquirer/prompts'
import { bun, npm, RegistryManager, yarn } from './registryManager'
import pc from 'picocolors'
import { printTable } from './print'
import { highlight } from 'cli-highlight'

const managers: Record<string, RegistryManager> = {
  npm,
  yarn,
  bun
}

async function add(name: string, registry: string, homeUrl: string = '') {
  const currentConf: RegistryConfig = {
    registry: String(registry),
    home: String(homeUrl)
  }

  const conf = getConfig()
  const existConf = conf.registries[name]

  if (existConf) {
    const isOverride = await confirm({
      message: `Found exist registry [${pc.yellow(name)}], override it ?`,
      default: true
    })
    console.log()

    if (isOverride) {
      Object.assign(existConf, currentConf)
      saveConfig(conf)

      console.log(`Update registry [${pc.yellow(name)}](${pc.green(registry)}) successful.`)
      return
    }

    ls()
    return
  }

  conf.registries[name] = currentConf

  saveConfig(conf)
  console.log(`Add registry [${pc.yellow(name)}](${pc.green(registry)}) successful.`)
}

async function rm(name: string) {
  const conf = getConfig()

  const exist = conf.registries[name]
  if (!exist) {
    console.log(`Not found registry for [${pc.yellow(name)}].\n`)
    await _printRegistry(conf.registries)
    return
  }

  delete conf.registries[name]
  saveConfig(conf)
  console.log(`Delete registry [${pc.yellow(name)}](${pc.green(exist.registry)}) successful.`)
}

async function rename(oldName: string, newName: string) {
  const conf = getConfig()

  const exist = conf.registries[oldName]
  if (!exist) {
    console.log(`Not found registry for [${pc.yellow(oldName)}].\n`)
    await _printRegistry(conf.registries)
    return
  }

  conf.registries[newName] = conf.registries[oldName]
  delete conf.registries[oldName]
  saveConfig(conf)
  console.log(`Rename [${pc.yellow(oldName)}] to [${pc.green(newName)}] successful.`)
}

async function use(name: string, type?: 'npm' | 'yarn') {
  const conf = getConfig()
  const registryConf = conf.registries[name]

  if (!registryConf) {
    console.log(`Not found registry named [${pc.yellow(name)}]!\n`)
    await _printRegistry(conf.registries)
    return
  }

  if (type) {
    await managers[type].setRegistry(registryConf.registry)
    console.log(`Set registry(${pc.yellow(name)}) for [${pc.green(type)}] successful!`)
    return
  }

  for (const key in managers) {
    const manager = managers[key]
    await manager.setRegistry(registryConf.registry)
  }

  console.log(
    `Set registry(${pc.yellow(`${name} - ${registryConf.registry}`)}) for` +
      ` [${pc.green(Object.keys(managers).join(', '))}] successful!`
  )
}

async function _printRegistry(registries: ONRMConfig['registries']) {
  const table: string[][] = []

  const used: { type: string; registry: string }[] = []

  for (const key in managers) {
    const manager = managers[key]
    used.push({
      type: key,
      registry: await manager.getRegistry()
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

async function ls() {
  const conf = getConfig()
  await _printRegistry(conf.registries)
}

async function config() {
  const conf = getConfig()

  console.log('Config path:', pc.green(ONRMRC), '\n')

  console.log(highlight(JSON.stringify(conf, null, 2), { language: 'json', ignoreIllegals: true }))
}

export const actions = {
  add,
  use,
  rm,
  rename,
  ls,
  config
}
