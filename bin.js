const PKG = require('./package.json');
const program = require('commander')
const config = require('./config.js');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ONRMRC = path.join(os.homedir(), '.onrmrc');

program.version(PKG.version);

program
  .command('ls')
  .description('List all the registries')
  .action(onLs);

program
  .command('current')
  .description('Show current registry name')
  .action(onCurrent);

program
  .command('use <name>')
  .description('Change registry to registry')
  .action(onUse);

program
  .command('add <name> <url> [home]')
  .description('Add one custom registry')
  .action(onAdd);

program
  .command('del <name>')
  .description('Delete one custom registry')
  .action(onDel);

program
  .command('help')
  .description('Print this help')
  .action(onHelp);

program
  .parse(process.argv);

if (process.argv.length === 2) {
  onHelp();
}

// ------------------------------------------

function onLs() {
  const regs = getRegistries();

  shelljs.exec('npm config get registry', (_, stdout) => {
    const reg = stdout;
    const index = regs.findIndex(r => reg.includes(r.registry));

    let str = '\n';

    regs.forEach((r, i) => {
      str += `${((i === index ? '* ': '  ') + r.name+' ').padEnd(14, '-')} ${r.registry}`
      str += '\n';
    })

    shelljs.echo(str)
  })

}

function onCurrent() {
  shelljs.echo('')

  shelljs.exec('npm config get registry')
}

/**
 *
 * @param {string} name register name
 */
function onUse(name) {
  const regs = getRegistries();
  const find = regs.find(r => r.name === name);

  if (find) {
    shelljs.exec(`${npm} config set registry ${find.registry}`)
    shelljs.echo(`set registry ${find.registry}\n`);
  } else {
    shelljs.echo('not found', name);
  }
}

/**
 *
 * @param {string} name register name
 * @param {string} url register url
 * @param {string=} home register home page
 */
function onAdd(name, url, home) {
  const reg = {
    name,
    register: url
  };

  if (home !== undefined) {
    reg.home = home;
  }

  const conf = getLocalConfig();
  const foundIndex = conf.registries.findIndex(r => r.name === reg.name);

  if (foundIndex !== -1) {
    conf.registries[foundIndex] = reg;
  } else {
    conf.registries.push(reg);
  }

  saveConfig(conf);
}

/**
 *
 * @param {string} name register name
 */
function onDel(name) {
  const conf = getLocalConfig();
  const index = conf.registries.findIndex(r => r.name === name);
  if (index !== -1) {
    conf.registries.splice(index, 1);
  }
  saveConfig(conf);
}

function onHelp() {
  program.outputHelp();
}

// ------------------------------------

function getLocalConfig() {
  let configs = {
    registries: []
  };

  if (fs.existsSync(ONRMRC)) {
    configs = JSON.parse(fs.readFileSync(ONRMRC))
  } else {
    saveConfig(configs);
  }
  return configs;
}

/**
 *
 * @param {object} conf local config
 */
function saveConfig(conf) {
  fs.writeFileSync(ONRMRC, JSON.stringify(conf, null, 2), {
    encoding: 'utf-8'
  })
}

function clearLocalConfig() {
  let configs = {
    registries: []
  };
  saveConfig(configs);
}

function getRegistries() {
  const regs = getLocalConfig().registries || [];

  return config.registries.concat(regs);
}


module.exports = {
  onLs,
  onCurrent,
  onUse,
  onAdd,
  onDel,
  onHelp,
  clearLocalConfig,
  getRegistries
}
