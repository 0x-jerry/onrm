export interface RegistryManager {
  isExist(): boolean

  setConfig(key: string, value: string): boolean

  getConfig(key: string): string
}
