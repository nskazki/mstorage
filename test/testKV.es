'use strict'

import { isObject, isUndefined } from 'lodash'
import { deepEqual, equal, ok } from 'assert'
import { KV } from '../src'

let assert = (actual, expected, message) => {
  if (isUndefined(message)) {
    message = expected
    return ok(actual, message)
  }

  return isObject(actual) && isObject(expected)
    ? deepEqual(actual, expected, message)
    : equal(actual, expected, message)
}

describe('KV', () => {
  it('drop', () => {
    let kv = new KV()
    kv.set('a', 1)
    kv.set('b', 2)
    kv.drop()

    assert(kv.values().length, 0, 'values array must be empty')
    assert(kv.keys().length, 0, 'keys array must be empty')
    assert(kv.size(), 0, 'size must be zero')
  })

  it('copy - resolved', () => {
    let kv1 = new KV()
    kv1.set({ a: 'a' }, { 1: 1 })
    kv1.set({ b: 'b' }, { 2: 2 })

    let kv2 = new KV()
    kv2.copy(kv1)

    assert(kv2.values(), kv1.values(), 'values arrays must be equal')
    assert(kv2.keys(), kv1.keys(), 'keys arrays must be equal')
    assert(kv2.size(), kv1.size(), 'sizes must be equal')
  })

  it('copy - rejected', done => {
    let kv = new KV()

    try {
      kv.copy({})
      done(new Error('it is impossible to copy an object of another type'))
    } catch (_err) {
      done()
    }
  })

  it('keys', () => {
    let kv = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv.set(key, value))

    assert(kv.keys(), keys, 'keys must be equal')
  })

  it('values', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((value, key) => kv.set(key, value))

    assert(kv.values(), values, 'values must be equal')
  })

  it('has - resolved', () => {
    let kv = new KV()
    let keys = [ { a: 'a' }, { b: 'b' } ]
    keys.forEach((key, value) => kv.set(key, value))
    let done = keys.every(key => kv.has(key))

    assert(done, 'all keys must be exist')
  })

  it('has - rejected', () => {
    let kv = new KV()
    let existKeys = [ { a: 'a' }, { b: 'b' } ]
    let otherKeys = [ { c: 'c' }, { d: 'd' } ]
    existKeys.forEach((key, value) => kv.set(key, value))
    let done = !otherKeys.some(key => kv.has(key))

    assert(done, 'none of the key should not exist')
  })

  it('hasByValue - resolved', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((value, key) => kv.set(key, value))
    let done = values.every(value => kv.hasByValue(value))

    assert(done, 'all values must be exist')
  })

  it('hasByValue - rejected', () => {
    let kv = new KV()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 4: 4 } ]
    existValues.forEach((value, key) => kv.set(key, value))
    let done = !otherValues.some(value => kv.hasByValue(value))

    assert(done, 'none of the value should not exist')
  })

  it('get - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert(kv.get(key), val, 'values must be equal')
  })

  it('get - rejected', done => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    try {
      kv.get({ c: 'c' })
      done(new Error('should not have this key'))
    } catch (_err) {
      done()
    }
  })

  it('getByValue - resolved', () => {
    let kv = new KV()
    let values = [ { 1: 1 }, { 2: 2 } ]

    let done = values.every((value, key) => {
      kv.set(key, value)
      return kv.getByValue(value) === key
    })
    assert(done, 'all values must be exist')
  })

  it('getByValue - rejected', done => {
    let kv = new KV()
    try {
      kv.getByValue({ 3: 3 })
      done(new Error('should not have this key'))
    } catch (_err) {
      done()
    }
  })

  it('add (set)', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    assert(kv.has(key), 'key must be exist')
    assert(kv.hasByValue(val), 'value must be exist')
    assert(kv.size(), 1, 'size must be 1')
    assert(kv.keys().length, 1, 'keys length must be 1')
    assert(kv.values().length, 1, 'values length must be 1')
    assert(kv.keys()[0], key, 'keys must be equal')
    assert(kv.values()[0], val, 'values must be equal')
  })

  it('del - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)
    kv.del(key)

    assert(kv.has(key), false, 'key should not exist')
    assert(kv.hasByValue(val), false, 'value should not exist')
    assert(kv.size(), 0, 'size must be 0')
    assert(kv.keys().length, 0, 'keys length must be 0')
    assert(kv.values().length, 0, 'values must be 0')
  })

  it('del - rejected', done => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    try {
      kv.del({ b: 'b' })
      done(new Error('should not have this key'))
    } catch (_err) {
      done()
    }
  })

  it('delByValue - resolved', () => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)
    kv.delByValue(val)

    assert(kv.has(key), false, 'key should not exist')
    assert(kv.hasByValue(val), false, 'value should not exist')
    assert(kv.size(), 0, 'size must be 0')
    assert(kv.keys().length, 0, 'keys length must be 0')
    assert(kv.values().length, 0, 'values must be 0')
  })

  it('delByValue - rejected', done => {
    let kv = new KV()
    let key = { a: 'a' }
    let val = { 1: 1 }
    kv.set(key, val)

    try {
      kv.delByValue({ 3: 3 })
      done(new Error('should not have this value'))
    } catch (_err) {
      done()
    }
  })
})
