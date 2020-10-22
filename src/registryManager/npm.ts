import { RegistryManager } from './type'
import shelljs from 'shelljs'

class Npm implements RegistryManager {
  isExist(): boolean {
    return true
  }

  setConfig(key: string, value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      shelljs.exec(`npm config set ${key} ${value}`)
      return true
    }
  }
}

export const npm = new Npm()
