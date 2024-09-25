import { which } from '../utils'
import { RegistryManager } from './base'

class Yarn extends RegistryManager {
  protected checkIsExist(): Promise<boolean> {
    return which('yarn')
  }

  async getVersion(): Promise<string> {
    return (await this.isExist()) ? await this.exec('yarn -v') : ''
  }

  async setRegistry(value: string): Promise<boolean> {
    if (!(await this.isExist())) {
      return false
    } else {
      await this.exec(`yarn config set registry ${value}`)
      return true
    }
  }

  async getRegistry(): Promise<string> {
    if (!(await this.isExist())) {
      return ''
    }

    const stdout = await this.exec(`yarn config get registry`)

    return stdout.replace('warning package.json: No license field', '').trim()
  }
}

export const yarn = new Yarn()
