import shelljs from 'shelljs'

export abstract class RegistryManager {
  protected abstract checkIsExist(): boolean

  abstract setRegistry(value: string): boolean
  abstract getRegistry(): string
  abstract getVersion(): string

  private _isExist?: boolean

  isExist(): boolean {
    if (this._isExist === undefined) {
      this._isExist = this.checkIsExist()
    }

    return this._isExist
  }

  protected exec(command: string) {
    const res = shelljs.exec(command, { silent: true })

    return res.stdout.trim()
  }
}
