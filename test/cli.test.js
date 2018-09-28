const {
  onAdd,
  onDel,
  getRegistries,
  clearLocalConfig
} = require('../bin/onrm');

const {
  expect
} = require('chai');

const config = require('../bin/config');
process.env.HOME = '~'

beforeEach(() => {
  clearLocalConfig();
})

describe('test ls command', () => {
  it('without local config register', () => {
    expect(getRegistries()).to.deep.eq(config.registries)
  })
})

describe('test add command', () => {
  it('should save the register', () => {
    const newReg = {
      name: 'test',
      register: 'https://test.org'
    }
    onAdd(newReg.name, newReg.register);
    expect(getRegistries()).to.deep.eq(config.registries.concat(newReg))
  })
})

describe('test delete command', () => {
  it('should delete the register', () => {
    const newReg = {
      name: 'test',
      register: 'https://test.org'
    }
    onAdd(newReg.name, newReg.register);
    onDel(newReg.name);
    expect(getRegistries()).to.deep.eq(config.registries)
  })
})
