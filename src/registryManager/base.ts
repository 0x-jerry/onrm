import { run } from '@0x-jerry/utils/node'

export abstract class RegistryManager {
  protected abstract checkIsExist(): Promise<boolean>

  abstract setRegistry(value: string): Promise<boolean>
  abstract getRegistry(): Promise<string>
  abstract getVersion(): Promise<string>

  private _isExist?: boolean

  async isExist(): Promise<boolean> {
    if (this._isExist === undefined) {
      this._isExist = await this.checkIsExist()
    }

    return this._isExist
  }

  protected async exec(command: string) {
    const result = await run(command, process.env, { collectOutput: true, silent: true })

    return result.trim()
  }
}
