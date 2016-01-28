'use strict'

import { KV } from '../src'
import assert from 'power-assert'

describe('KV', () => {
  it('drop', () => {
    let kv = new KV()
    kv.set('a', 1)
    kv.set('b', 2)
    kv.drop()

    assert.ok(kv.values().length === 0)
    assert.ok(kv.keys().length === 0)
    assert.ok(kv.size() === 0)
  })

  it('copy - resolved', () => {
    let kv1 = new KV()
    kv1.set({ a: 'a' }, { 1: 1 })
    kv1.set({ b: 'b' }, { 2: 2 })

    let kv2 = new KV()
    kv2.copy(kv1)

    assert.deepStrictEqual(kv2.values(), kv1.values())
    assert.deepStrictEqual(kv2.keys(), kv1.keys())
    assert.ok(kv2.size() === kv1.size())
  })

  it('copy - rejected', () => {
    let kv = new KV()
    assert.throws(() => kv.copy({}),
      'it is impossible to copy an object of another type')
  })

  it('dump -> copy', () => {
    let kv1 = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv1.set(key, value))

    let dump = kv1.dump()
    let kv2 = new KV()
    kv2.copy(dump)

    assert.deepStrictEqual(kv1, kv2)
  })

  it('dump -> restore', () => {
    let kv1 = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv1.set(key, value))
    kv1.set({ c: 'c' }, 2)
    kv1.delByValue(0)
    kv1.delByValue(2)

    let dump = JSON.stringify(kv1.dump())
    let kv2 = new KV()
    kv2.restore(JSON.parse(dump))

    assert.deepStrictEqual(kv1, kv2)
  })

  it('keys', () => {
    let kv = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv.set(key, value))

    assert.deepStrictEqual(kv.keys(), keys)
  })

  it('values', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((value, key) => kv.set(key, value))

    assert.deepStrictEqual(kv.values(), values)
  })

  it('has - resolved', () => {
    let kv = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv.set(key, value))

    assert.ok(keys.every(key => kv.has(key)),
      'all keys must be exist')
  })

  it('has - rejected', () => {
    let kv = new KV()
    let existKeys = [ { a: 'a' }, { b: 'b' } ]
    let otherKeys = [ { c: 'c' }, { d: 'd' } ]
    existKeys.forEach((key, value) => kv.set(key, value))

    assert.ok(!otherKeys.some(key => kv.has(key)),
      'none of the key should not exist')
  })

  it('hasByValue - resolved', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((value, key) => kv.set(key, value))

    assert.ok(values.every(value => kv.hasByValue(value)),
      'all values must be exist')
  })

  it('hasByValue - rejected', () => {
    let kv = new KV()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 4: 4 } ]
    existValues.forEach((value, key) => kv.set(key, value))

    assert.ok(!otherValues.some(value => kv.hasByValue(value)),
      'none of the value should not exist')
  })

  it('get - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert.deepStrictEqual(kv.get(key), val)
  })

  it('get - rejected', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert.throws(() => kv.get({ c: 'c' }),
      'should not have this key')
  })

  it('getByValue - resolved', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]

    assert.ok(values.every((value, key) => {
      kv.set(key, value)
      return kv.getByValue(value) === key
    }), 'all values must be exist')
  })

  it('getByValue - rejected', () => {
    let kv = new KV()

    assert.throws(() => kv.getByValue({ 3: 3 }),
      'should not have this key')
  })

  it('add (set)', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert.ok(kv.has(key))
    assert.ok(kv.hasByValue(val))
    assert.ok(kv.size() === 1)
    assert.ok(kv.keys().length === 1)
    assert.ok(kv.values().length === 1)
    assert.deepStrictEqual(kv.keys(), [ key ])
    assert.deepStrictEqual(kv.values(), [ val ])
  })

  it('del - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)
    kv.del(key)

    assert.ok(kv.has(key) === false)
    assert.ok(kv.hasByValue(val) === false)
    assert.ok(kv.size() === 0)
    assert.ok(kv.keys().length === 0)
    assert.ok(kv.values().length === 0)
  })

  it('del - rejected', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert.throws(() => kv.del({ b: 'b' }),
      'should not have this key')
  })

  it('delByValue - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)
    kv.delByValue(val)

    assert.ok(kv.has(key) === false)
    assert.ok(kv.hasByValue(val) === false)
    assert.ok(kv.size() === 0)
    assert.ok(kv.keys().length === 0)
    assert.ok(kv.values().length === 0)
  })

  it('delByValue - rejected', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert.throws(() => kv.delByValue({ 3: 3 }),
      'should not have this value')
  })
})
