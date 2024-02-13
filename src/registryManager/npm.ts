import { RegistryManager } from './base'
import shelljs from 'shelljs'

class Npm extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!shelljs.which('npm')
  }

  setRegistry(value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      this.exec(`npm config set registry ${value}`)
      return true
    }
  }

  getRegistry(): string {
    if (!this.isExist()) {
      return ''
    }

    return this.exec(`npm config get registry`)
  }

  getVersion(): string {
    return this.isExist() ? this.exec('npm -v') : ''
  }
}

export const npm = new Npm()
