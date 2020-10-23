import path from 'path'
import fs from 'fs'
import os from 'os'

export interface RegistryConfig {
  registry: string
  home?: string
}

export interface ONRMConfig {
  version: number
  registries: Record<string, RegistryConfig>
}

export const ONRMRC = path.join(os.homedir(), '.onrmrc')

export function defaultConfig(): ONRMConfig {
  return {
    version: 1,
    registries: {
      npm: {
        home: 'https://www.npmjs.org',
        registry: 'https://registry.npmjs.org/'
      },
      yarn: {
        home: 'https://yarnpkg.com',
        registry: 'https://registry.yarnpkg.com/'
      },
      taobao: {
        home: 'https://npm.taobao.org',
        registry: 'https://registry.npm.taobao.org/'
      },
      github: {
        home: 'https://github.com/features/packages',
        registry: 'https://npm.pkg.github.com'
      }
    }
  }
}

export function saveConfig(conf: ONRMConfig) {
  fs.writeFileSync(ONRMRC, JSON.stringify(conf))
}

export function getConfig(): ONRMConfig {
  const conf = defaultConfig()

  if (fs.existsSync(ONRMRC)) {
    const str = fs.readFileSync(ONRMRC, { encoding: 'utf-8' })

    const localConf = JSON.parse(str)

    if (localConf.version === 1) {
      Object.assign(conf, localConf)
    }
  }

  return conf
}
