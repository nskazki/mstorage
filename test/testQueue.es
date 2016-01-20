'use strict'

import { Queue } from '../src'
import assert from 'power-assert'

describe('Queue', () => {
  it('drop', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))
    q.drop()

    assert.ok(q.size() === 0)
    assert.ok(q.all().length === 0)
    assert.ok(q.shuffle().length === 0)
  })

  it('copy - resolved', () => {
    let q1 = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q1.add(val))

    let q2 = new Queue()
    q1.copy(q2)

    assert.deepStrictEqual(q2.all(), q1.all())
    assert.deepStrictEqual(q2.size(), q1.size())
  })

  it('copy - rejected', () => {
    let q = new Queue()

    assert.throws(() => q.copy({}))
  })

  it('dump -> copy', () => {
    let q1 = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q1.add(val))

    let dump = q1.dump()
    let q2 = new Queue()
    q2.copy(dump)

    assert.deepStrictEqual(q1, q2)
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

    assert.deepStrictEqual(q1, q2)
  })

  it('each (forEach)', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    let context = { }
    q.each(function (val, id) {
      assert.ok(val, values[id])
      assert.ok(context, this)
    }, context)
  })

  it('add', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)

    assert.ok(q.size() ===  1)
    assert.ok(q.all().length === 1)
    assert.ok(q.shuffle().length === 1)
    assert.ok(q.has(id))
    assert.ok(q.hasByValue(val))
    assert.ok(q.get(id) === val)
    assert.ok(q.getByValue(val) === id)
  })

  it('del - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)
    q.del(id)

    assert.ok(q.size() === 0)
    assert.ok(q.all().length === 0)
    assert.ok(q.shuffle().length === 0)
  })

  it('del - rejected', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    assert.throws(() => q.del(otherId))
  })

  it('delByValue - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)
    q.delByValue(val)

    assert.ok(q.hasByValue(val) === false)
    assert.ok(q.has(id) === false)
  })

  it('delByValue - rejected', () => {
    let q = new Queue()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    q.add(existVal)

    assert.throws(() => q.delByValue(otherVal))
  })

  it('has - resolved', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    let ids = values.map(val => q.add(val))

    assert.ok(ids.every(id => q.has(id)),
      'ids must be exist')
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

    assert.ok(values.every(val => q.hasByValue(val)),
      'all values must be exist')
  })

  it('hasByValue - rejected (exists)', () => {
    let q = new Queue()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 3: 3 } ]
    existValues.forEach(val => q.add(val))

    assert.ok(!otherValues.some(val => q.hasByValue(val)),
      'none of the value should not exist')
  })

  it('get - resolved', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let id = q.add(val)

    assert.ok(q.get(id) === val)
  })

  it('get - rejected', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    assert.throws(() => q.get(otherId))
  })

  it('getByValue - resolved (id)', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    assert.ok(values.every((val, index) => q.id(val) === index),
      'all values must have id')
  })

  it('getByValue - rejected (id)', () => {
    let q = new Queue()
    let val = { 1: 1 }
    q.add(val)

    assert.throws(() => q.id({ 3: 3 }))
  })

  it('all', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    assert.deepStrictEqual(q.all(), values)
  })

  it('shuffle', () => {
    let q = new Queue()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => q.add(val))

    assert.deepStrictEqual(
      q.shuffle().map(v => JSON.stringify(v)).sort(),
      values.map(v => JSON.stringify(v)).sort())
  })

  it('next (shift)', () => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    let id1 = q.add(val1)
    let id2 = q.add(val2)

    let next1 = q.next()
    assert.ok(next1 === val1)
    assert.ok(q.has(id1) === false)
    assert.ok(q.hasByValue(val1) === false)

    let next2 = q.next()
    assert.ok(next2 === val2)
    assert.ok(q.has(id2) === false)
    assert.ok(q.hasByValue(val2) === false)

    assert.throws(() => q.next(),
      'the queue must be empty')
  })

  it('toTail - resolved', () => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    let id1 = q.add(val1)
    q.add(val2)

    q.toTail(id1)
    assert.ok(q.get(id1) === val1, 'values must be equal')
    assert.ok(q.getByValue(val1) === id1, 'ids must be equal')

    assert.ok(q.next(), val2,
      'values must be equal')
  })

  it('toTail - rejected', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    assert.throws(() => q.toTail(otherId),
     'id does not exist')
  })

  it('toHead - resolved', () => {
    let q = new Queue()
    let val1 = { 1: 1 }
    let val2 = { 2: 2 }

    q.add(val1)
    let id2 = q.add(val2)

    q.toHead(id2)
    assert.ok(q.get(id2), val2)
    assert.ok(q.getByValue(val2))
    assert.ok(q.next(), val2)
  })

  it('toHead - rejected', () => {
    let q = new Queue()
    let val = { 1: 1 }
    let existId = q.add(val)
    let otherId = existId - 1

    assert.throws(() => q.toHead(otherId),
      'id does not exist')
  })
})
