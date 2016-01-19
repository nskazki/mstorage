'use strict'

import { Queue } from '../src'
import assert from './prettyAssert'

describe('Queue', () => {
  it('drop', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))
    q.drop()

    assert(q.size(), 0, 'size must be 0')
    assert(q.all().length, 0, 'values array must be empty')
    assert(q.shuffle().length, 0, 'shuffled values array must be empty')
  })

  it('copy - resolved', () => {
    let q1 = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q1.add(val))

    let q2 = new Queue()
    q1.copy(q2)

    assert(q2.all(), q1.all(), 'values arrays must be equal')
    assert(q2.size(), q1.size(), 'sizes must be equal')
  })

  it('copy - rejected', done => {
    let q = new Queue()

    try {
      q.copy({})
      done(new Error('it is impossible to copy an object of another type'))
    } catch (_err) {
      done()
    }
  })

  it('dump -> copy', () => {
    let q1 = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q1.add(val))

    let dump = q1.dump()
    let q2 = new Queue()
    q2.copy(dump)

    assert(q1, q2, 'vaults must be equal')
  })

  it('dump -> restore', () => {
    let q1 = new Queue()
    let values = [ { 1: 1 }, 2 ]
    values.forEach(val => q1.add(val))
    let id = q1.add({ 3: 3 })
    q1.toHead(id)
    q1.delByValue(2)

    let dump = JSON.stringify(q1.dump())
    let q2 = new Queue()
    q2.restore(JSON.parse(dump))

    assert(q1.dump(), q2.dump(), 'vaults must be equal')
  })

  it('each (forEach)', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    let context = { }
    q.each(function (val, id) {
      assert(val, values[id], 'values must be equal')
      assert(context, this, 'contexts must be equal')
    }, context)
  })

  it('add', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)

    assert(q.size(), 1, 'size must be 1')
    assert(q.all().length, 1, 'values array length must be 1')
    assert(q.shuffle().length, 1, 'shuffled values array length must be 1')
    assert(q.has(id), 'id must be exist')
    assert(q.hasByValue(val), 'value must be exist')
    assert(q.get(id), val, 'values must be equal')
    assert(q.getByValue(val), id, 'ids must be equal')
  })

  it('del - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)
    q.del(id)

    assert(q.size(), 0, 'size must be 0')
    assert(q.all().length, 0, 'values array must be empty')
    assert(q.shuffle().length, 0, 'shuffled values array must be empty')
  })

  it('del - rejected', done => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1
    try {
      q.del(otherId)
      done(new Error('id should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('delByValue - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    q.add(val)
    q.delByValue(val)
  })

  it('delByValue - rejected', done => {
    let q = new Queue()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    q.add(existVal)

    try {
      q.delByValue(otherVal)
      done(new Error('value should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('has - resolved', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    let ids = values.map(val => q.add(val))
    let done = ids.every(id => q.has(id))
    assert(done, 'ids must be exist')
  })

  it('has - rejected', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1
    if (q.has(otherId)) throw new Error('id should not exist')
  })

  it('hasByValue - resolved (exists)', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    let done = values.every(val => q.hasByValue(val))
    assert(done, 'all values must be exist')
  })

  it('hasByValue - rejected (exists)', () => {
    let q = new Queue()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 3: 3 } ]
    existValues.forEach(val => q.add(val))

    let done = !otherValues.some(val => q.hasByValue(val))
    assert(done, 'none of the value should not exist')
  })

  it('get - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)

    assert(q.get(id), val, 'values must be equal')
  })

  it('get - rejected', done => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    try {
      q.get(otherId)
      done(new Error('id should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('getByValue - resolved (id)', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    let done = values.every((val, index) => q.id(val) === index)
    assert(done, 'all values must have id')
  })

  it('getByValue - rejected (id)', done => {
    let q = new Queue()
    let val = { 1: 1 }
    q.add(val)

    try {
      q.id({ 3: 3 })
      done(new Error('value should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('all', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    assert(q.all(), values, 'values must be equal')
  })

  it('shuffle', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    assert(
      q.shuffle().map(v => JSON.stringify(v)).sort(),
      values.map(v => JSON.stringify(v)).sort(),
      'values must be equal')
  })

  it('next (shift)', done => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    let id1 = q.add(val1)
    let id2 = q.add(val2)

    let next1 = q.next()
    assert(next1, val1, 'values must be equal')
    assert(q.has(id1), false, 'id1 should not exist')
    assert(q.hasByValue(val1), false, 'val1 should not exist')

    let next2 = q.next()
    assert(next2, val2, 'values must be equal')
    assert(q.has(id2), false, 'id2 should not exist')
    assert(q.hasByValue(val2), false, 'val2 should not exist')

    try {
      q.next()
      done(new Error('method call is not possible - the queue must be empty'))
    } catch (_err) {
      done()
    }
  })

  it('toTail - resolved', () => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    let id1 = q.add(val1)
    q.add(val2)

    q.toTail(id1)
    assert(q.get(id1), val1, 'values must be equal')
    assert(q.getByValue(val1), id1, 'ids must be equal')

    let next = q.next()
    assert(next, val2, 'values must be equal')
  })

  it('toTail - rejected', done => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    try {
      q.toTail(otherId)
      done(new Error('id does not exist'))
    } catch (_err) {
      done()
    }
  })

  it('toHead - resolved', () => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    q.add(val1)
    let id2 = q.add(val2)

    q.toHead(id2)
    assert(q.get(id2), val2, 'values must be equal')
    assert(q.getByValue(val2), id2, 'ids must be equal')

    let next = q.next()
    assert(next, val2, 'values must be equal')
  })

  it('toHead - rejected', done => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    try {
      q.toHead(otherId)
      done(new Error('id does not exist'))
    } catch (_err) {
      done()
    }
  })
})
