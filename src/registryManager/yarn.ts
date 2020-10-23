import { RegistryManager } from './base'
import shelljs from 'shelljs'

class Yarn extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!shelljs.which('yarn')
  }

  getVersion(): string {
    return this.exec('yarn -v')
  }

  setConfig(key: string, value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      this.exec(`yarn config set ${key} ${value}`)
      return true
    }
  }

  getConfig(key: string): string {
    if (!this.isExist()) {
      return ''
    }

    return this.exec(`yarn config get ${key}`)
  }
}

export const yarn = new Yarn()
