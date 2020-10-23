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

    const stdout = this.exec(`yarn config get ${key}`)

    return stdout.replace('warning package.json: No license field', '').trim()
  }
}

export const yarn = new Yarn()
