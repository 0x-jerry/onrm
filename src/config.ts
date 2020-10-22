import path from 'path'
import fs from 'fs'
import os from 'os'

interface RegistryConfig {
  name: string
  registry: string
  home?: string
}

interface ONRMConfig {
  registries: RegistryConfig[]
}

const ONRMRC = path.join(os.homedir(), '.onrmrc')

export function defaultConfig(): ONRMConfig {
  return {
    registries: [
      {
        name: 'npm',
        home: 'https://www.npmjs.org',
        registry: 'https://registry.npmjs.org/'
      },
      {
        name: 'yarn',
        home: 'https://yarnpkg.com',
        registry: 'https://registry.yarnpkg.com/'
      },
      {
        name: 'taobao',
        home: 'https://npm.taobao.org',
        registry: 'https://registry.npm.taobao.org/'
      },
      {
        name: 'github',
        home: 'https://github.com/features/packages',
        registry: 'https://npm.pkg.github.com'
      }
    ]
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

    Object.assign(conf, localConf)
  }

  return conf
}
