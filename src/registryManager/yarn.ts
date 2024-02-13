import { RegistryManager } from './base'
import shelljs from 'shelljs'

class Yarn extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!shelljs.which('yarn')
  }

  getVersion(): string {
    return this.isExist() ? this.exec('yarn -v') : ''
  }

  setRegistry(value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      this.exec(`yarn config set registry ${value}`)
      return true
    }
  }

  getRegistry(): string {
    if (!this.isExist()) {
      return ''
    }

    const stdout = this.exec(`yarn config get registry`)

    return stdout.replace('warning package.json: No license field', '').trim()
  }
}

export const yarn = new Yarn()
