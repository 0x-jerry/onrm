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

async function onLs() {
  const {registries, currentRegIndex} = await getRegistriesWithCurrent();

  let msg = '\n';
  registries.forEach((r, i) => {
    msg += (i === currentRegIndex.npm || i === currentRegIndex.yarn) ? '* ' : '  ';

    msg += (r.name + ' ').padEnd(10, '-') + ' ';
    msg += r.registry + ' ';

    let pkg = (i === currentRegIndex.npm ? 'npm ' : ' ') + (i === currentRegIndex.yarn ? 'yarn' : '');

    pkg = pkg.trim().split(/\s/).join(', ');

    msg += pkg && `[${ pkg }]`;
    msg += '\n';
  })

  shelljs.echo(msg)
}

async function onCurrent() {
  const info = await getCurrentRegistry();

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
async function onUse(name, type) {
  const info = await setCurrentRegistry(name, type);
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
 * @param {function} cb
 */
function exec(cmd, cb) {
  if (DEBUG) {
    shelljs.echo('Command is', cmd);
  }

  // Error handle wrapper
  let cbWrapper = null
  if (cb) {
    cbWrapper = (code, stdout, stderr) => {
      stderr && shelljs.echo('Error ', stderr);

      cb(code, stdout, stderr);
    }
  }

  const result = shelljs.exec(cmd, {
    silent: true
  }, cbWrapper);

  if (!cb && result.stderr) {
    shelljs.echo('Error ', result.stderr);
  }

  return result;
}

async function getRegistriesWithCurrent() {
  const regs = getRegistries().all;
  const info = await getCurrentRegistry();

  let currentRegIndex = {
    npm: -1,
    yarn: -1
  }

  if (info.npm) {
    currentRegIndex.npm = regs.findIndex(r => info.npm.includes(r.registry));
  }

  if (info.yarn) {
    currentRegIndex.yarn = regs.findIndex(r => info.yarn.includes(r.registry));
  }

  return {
    registries: regs,
    currentRegIndex: currentRegIndex
  }
}

/**
 *
 * @param {string} cmd command
 * @param {string=} type Pkg type, one of [yarn, npm], exec both if null
 * @returns {Promise}
 */
function execPkgManagerCommand(cmd, type) {
  const types = ['npm', 'yarn'];
  type = types.find(t => t === type);

  const execTypes = type ? [type] : types;

  const msg = {
    npm: false,
    yarn: false
  };

  return new Promise((resolve) => {
    let count = 0;

    const resolveWithMsg = () => {
      if (count >= execTypes.length) {
        resolve(msg);
      }
    }

    execTypes.forEach(t => {
      if (shelljs.which(t)) {
        exec(`${ t } ${ cmd }`, (code, stdout, stderr) => {
          count++;
          msg[t] = !stderr && (stdout || true);
          resolveWithMsg();
        });
      } else {
        count++;
        shelljs.echo(`not found ${ t } command`)
        resolveWithMsg();
      }
    })
  })
}

function getCurrentRegistry() {
  return execPkgManagerCommand('config get registry');
}

/**
 *
 * @param {string} name registry name
 * @param {string=} type package manager type, yarn or npm, default exec both command
 */
async function setCurrentRegistry(name, type) {
  const regs = getRegistries().all;
  const find = regs.find(r => r.name === name);

  let msg = {
    npm: null,
    yarn: null
  };

  if (find) {
    msg = await execPkgManagerCommand(`config set registry ${ find.registry }`, type)
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
