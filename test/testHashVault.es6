'use strict'

import { HashVault } from '../src'
import assert from 'power-assert'

describe('HashVault', () => {
  it('init', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv.init(values)

    assert.ok(hv.size() === 2)
  })

  it('copy', () => {
    let hv1 = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv1.init(values)

    let hv2 = new HashVault()
    hv2.copy(hv1)

    assert.ok(hv1.size() === hv2.size())
  })

  it('dump -> copy', () => {
    let hv1 = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv1.init(values)

    let dump = hv1.dump()
    let hv2 = new HashVault()
    hv2.copy(dump)

    assert.deepStrictEqual(hv1, hv2)
  })

  it('dump -> restore', () => {
    let hv1 = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]

    hv1.init(values)
    hv1.add({ 3: 3 })
    hv1.delByValue({ 2: 2 })

    let dump = JSON.stringify(hv1.dump())
    let hv2 = new HashVault()
    hv2.restore(JSON.parse(dump))

    assert.deepStrictEqual(hv1, hv2)
  })

  it('getByValue - resolved (id)', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      let id = hv.add(val)
      assert.ok(hv.getByValue(val) === id)
    })
  })

  it('getByValue - rejected (id)', () => {
    let hv = new HashVault()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    hv.add(existVal)

    assert.throws(() => hv.getByValue(otherVal))
  })

  it('add', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val, size) => {
      let id = hv.add(val)

      assert.ok(hv.hasByValue(val))
      assert.ok(hv.has(id))
      assert.ok(hv.getByValue(val) === id)
      assert.ok(hv.size() === size + 1)
    })
  })

  it('del - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val) => {
      let id = hv.add(val)
      hv.del(id)

      assert.ok(hv.size() === 0)
      assert.ok(hv.hasByValue(val) === false)
      assert.ok(hv.has(id) === false)
    })
  })

  it('del - rejected', () => {
    let hv = new HashVault()
    let val = { 1: 1 }
    let existId = hv.add(val)
    let otherId = existId - 1

    assert.throws(() => hv.del(otherId))
  })

  it('delByValue - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val) => {
      let id = hv.add(val)
      hv.delByValue(val)

      assert.ok(hv.size() === 0)
      assert.ok(hv.hasByValue(val) === false)
      assert.ok(hv.has(id) === false)
    })
  })

  it('delByValue - rejected', () => {
    let hv = new HashVault()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    hv.add(existVal)

    assert.throws(() => hv.delByValue(otherVal))
  })

  it('has - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      let id = hv.add(val)

      assert.ok(hv.has(id))
    })
  })

  it('has - rejected', () => {
    let hv = new HashVault()
    let val = { 1: 1 }
    let existId = hv.add(val)
    let otherId = existId - 1

    assert.ok(hv.has(otherId) === false)
  })

  it('hasByValue - resolved (exists)', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      hv.add(val)

      assert.ok(hv.hasByValue(val))
    })
  })

  it('hasByValue - rejected (exists)', () => {
    let hv = new HashVault()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 4: 4 } ]
    existValues.forEach(val => hv.add(val))

    assert.ok(!otherValues.some(val => hv.hasByValue(val)),
      'none of the value should not exist')
  })
})
