import { RegistryManager } from './base'
import shelljs from 'shelljs'

class Npm extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!shelljs.which('npm')
  }

  setConfig(key: string, value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      this.exec(`npm config set ${key} ${value}`)
      return true
    }
  }

  getConfig(key: string): string {
    if (!this.isExist()) {
      return ''
    }

    return this.exec(`npm config get ${key}`)
  }

  getVersion(): string {
    return this.isExist() ? this.exec('npm -v') : ''
  }
}

export const npm = new Npm()
