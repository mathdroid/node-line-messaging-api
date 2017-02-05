import test from 'ava'
import Bot, { Messages } from '../src'
const ES5Bot = require('../src')

test('Sanity', t => t.is(true, !false))

test('ES6', t => t.is(typeof Bot, 'function'))

test('ES6 Messages', t => t.is(typeof Messages, 'function'))

test('ES5', t => t.is(typeof ES5Bot, 'function'))

test('ES5 Messages', t => t.is(typeof ES5Bot.Messages, 'function'))
