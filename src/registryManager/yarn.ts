import { RegistryManager } from './type'
import shelljs from 'shelljs'

class Yarn implements RegistryManager {
  isExist(): boolean {
    return !!shelljs.which('yarn')
  }

  setConfig(key: string, value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      shelljs.exec(`yarn config set ${key} ${value}`)
      return true
    }
  }
}

export const yarn = new Yarn()
