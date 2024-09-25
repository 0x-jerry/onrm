import { which } from '../utils'
import { RegistryManager } from './base'

class Npm extends RegistryManager {
  protected checkIsExist(): Promise<boolean> {
    return which('npm')
  }

  async setRegistry(value: string): Promise<boolean> {
    if (!(await this.isExist())) {
      return false
    } else {
      await this.exec(`npm config set registry ${value}`)
      return true
    }
  }

  async getRegistry(): Promise<string> {
    if (!(await this.isExist())) {
      return ''
    }

    return this.exec(`npm config get registry`)
  }

  async getVersion(): Promise<string> {
    return (await this.isExist()) ? await this.exec('npm -v') : ''
  }
}

export const npm = new Npm()
