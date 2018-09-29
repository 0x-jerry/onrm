#!/usr/bin/env node

const PKG = require('../package.json');
const program = require('commander')
const config = require('./config');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ONRMRC = path.join(os.homedir(), '.onrmrc');

const DEBUG = false;

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
  .command('use <name> [type]')
  .description('Change registry to registry, type is one of [yarn, npm]')
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
  const regs = getRegistries().all;

  shelljs.exec('npm config get registry', {
    silent: true
  }, (_, stdout) => {
    const reg = stdout;
    const index = regs.findIndex(r => reg.includes(r.registry));

    let msg = '\n';

    regs.forEach((r, i) => {
      msg += `${((i === index ? '* ': '  ') + r.name+' ').padEnd(14, '-')} ${r.registry}`
      msg += '\n';
    })

    shelljs.echo(msg)
  })
}

function onCurrent() {
  const info = getCurrentRegistry();

  let msg = '';

  for (const key in info) {
    msg += `${ (key + ' ').padEnd(8, '-') } ${info[key]}`
  }

  msg = msg.trim(/\s/);

  shelljs.echo(`\n${ msg } \n`)
}

/**
 *
 * @param {string} name registry name
 * @param {string=} type package manager type, yarn or npm, default set both config
 */
function onUse(name, type) {
  const info = setCurrentRegistry(name, type);
  const pkg = (info.msg.npm ? 'npm' : '') + ' ' + (info.msg.yarn ? 'yarn' : '');

  const msg = info.find ?
    `set ( ${ pkg.trim().split(/\s/).join(', ') } ) registry ${ info.find.registry }` :
    `not found [ ${ name } ] registry`;

  shelljs.echo(`\n ${ msg } \n`);
}

/**
 *
 * @param {string} name registry name
 * @param {string} url registry url
 * @param {string=} home registry home page
 */
function onAdd(name, url, home) {
  const reg = {
    name,
    registry: url
  };

  if (home !== undefined) {
    reg.home = home;
  }

  addRegistry(reg);

  shelljs.echo(`\n add registry ${ name } -- ${ url }\n`);
}

/**
 *
 * @param {string} name registry name
 */
function onDel(name) {
  const msg = delRegistry(name) ?
    `delete registry ${ remove.name } -- ${ remove.registry }` :
    `not found ${ name } registry`;

  shelljs.echo(`\n ${ msg }\n`);
}

function onHelp() {
  program.outputHelp();
}

// ------------------------------------

/**
 *
 * @param {string} cmd
 */
function exec(cmd) {
  if (DEBUG) {
    shelljs.echo('Command is', cmd);
  }

  const result = shelljs.exec(cmd, {
    silent: true
  });

  if (result.stderr) {
    shelljs.echo('Error ', result.stderr);
  }

  return result;
}

/**
 *
 * @param {string} cmd command
 * @param {string=} type Pkg type, one of [yarn, npm], exec both if null
 */
function execPkgManagerCommand(cmd, type) {
  const types = ['npm', 'yarn'];
  type = types.find(t => t === type);

  const execTypes = type ? [type] : types;

  const msg = {
    npm: false,
    yarn: false
  };

  execTypes.forEach(t => {
    if (shelljs.which(t)) {
      const result = exec(`${ t } ${ cmd }`);
      msg[t] = !result.stderr && (result.stdout || true);
    } else {
      shelljs.echo(`not found ${ t } command`)
    }
  })

  return msg;
}

function getCurrentRegistry() {
  return execPkgManagerCommand('config get registry');
}

/**
 *
 * @param {string} name registry name
 * @param {string=} type package manager type, yarn or npm, default exec both command
 */
function setCurrentRegistry(name, type) {
  const regs = getRegistries().all;
  const find = regs.find(r => r.name === name);

  let msg = {
    npm: null,
    yarn: null
  };

  if (find) {
    msg = execPkgManagerCommand(`config set registry ${ find.registry }`, type)
  }

  return {
    find,
    msg
  };
}

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
  const localRegistries = getLocalConfig().registries || [];

  return {
    local: localRegistries,
    default: config.registries,
    all: config.registries.concat(localRegistries)
  };
}

/**
 *
 * @param {object} reg
 * @param {string} reg.name registry name
 * @param {string} reg.url registry url
 * @param {string=} reg.home registry home page
 */
function addRegistry(reg) {
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
 * @param {string} name registry name
 */
function delRegistry(name) {
  const conf = getLocalConfig();
  const index = conf.registries.findIndex(r => r.name === name);

  if (index !== -1) {
    conf.registries.splice(index, 1);
    saveConfig(conf);
  }

  return index !== -1;
}

module.exports = {
  addRegistry,
  delRegistry,
  setCurrentRegistry,
  getCurrentRegistry,
  clearLocalConfig,
  getRegistries
}
