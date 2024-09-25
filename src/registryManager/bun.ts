import { RegistryManager } from './base'
import fs from 'fs'
import os from 'os'
import path from 'path'
import toml from '@iarna/toml'
import { which } from '../utils'

const CONFIG_FILE = '.bunfig.toml'

class Bun extends RegistryManager {
  configPath = `${path.join(os.homedir(), CONFIG_FILE)}`

  protected checkIsExist(): Promise<boolean> {
    return which('bun')
  }

  async setRegistry(value: string): Promise<boolean> {
    if (!(await this.isExist())) {
      return false
    } else {
      const conf = this.readBunConfig()

      conf.install ||= {}
      conf.install.registry = value

      this.saveBunConfig(conf)
      return true
    }
  }

  async getRegistry(): Promise<string> {
    if (!(await this.isExist())) {
      return ''
    }

    const conf = this.readBunConfig()

    return conf.install?.registry || 'https://registry.npmjs.org/'
  }

  async getVersion(): Promise<string> {
    return (await this.isExist()) ? await this.exec('bun --version') : ''
  }

  readBunConfig(): any {
    try {
      if (!fs.existsSync(this.configPath)) {
        return {}
      }

      const file = fs.readFileSync(this.configPath, 'utf-8')
      return toml.parse(file)
    } catch (error) {
      console.log(`Parse ${this.configPath} failed`, error)
      return {}
    }
  }

  saveBunConfig(config: any) {
    fs.writeFileSync(this.configPath, toml.stringify(config))
  }
}

export const bun = new Bun()
