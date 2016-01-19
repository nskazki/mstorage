'use strict'

import { HashVault } from '../src'
import assert from './prettyAssert'

describe('HashVault', () => {
  it('init', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv.init(values)

    assert(hv.size(), 2, 'size must be 2')
  })

  it('copy', () => {
    let hv1 = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv1.init(values)

    let hv2 = new HashVault()
    hv2.copy(hv1)

    assert(hv1.size(), hv2.size(), 'sizes must be equal')
  })

  it('dump -> copy', () => {
    let hv1 = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    hv1.init(values)

    let dump = hv1.dump()
    let hv2 = new HashVault()
    hv2.copy(dump)

    assert(hv1, hv2, 'vaults must be equal')
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

    assert(hv1, hv2, 'vaults must be equal')
  })

  it('getByValue - resolved (id)', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      let id = hv.add(val)
      assert(hv.getByValue(val), id, 'ids must be equal')
    })
  })

  it('getByValue - rejected (id)', done => {
    let hv = new HashVault()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    hv.add(existVal)

    try {
      hv.getByValue(otherVal)
      done(new Error('value does not exist'))
    } catch (_err) {
      done()
    }
  })

  it('add', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val, size) => {
      let id = hv.add(val)
      assert(hv.hasByValue(val), 'value must be exist')
      assert(hv.has(id), 'id must be exist')
      assert(hv.getByValue(val), id, 'ids must be equal')
      assert(hv.size(), size + 1, 'sizes must be equal')
    })
  })

  it('del - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val) => {
      let id = hv.add(val)
      hv.del(id)
      assert(hv.size(), 0, 'size must be 0')
      assert(hv.hasByValue(val), false, 'value should not exist')
      assert(hv.has(id), false, 'id should not exist')
    })
  })

  it('del - rejected', done => {
    let hv = new HashVault()
    let val = { 1: 1 }
    let existId = hv.add(val)
    let otherId = existId - 1

    try {
      hv.del(otherId)
      done(new Error('id should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('delByValue - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach((val) => {
      let id = hv.add(val)
      hv.delByValue(val)
      assert(hv.size(), 0, 'size must be 0')
      assert(hv.hasByValue(val), false, 'value should not exist')
      assert(hv.has(id), false, 'id should not exist')
    })
  })

  it('delByValue - rejected', done => {
    let hv = new HashVault()
    let existVal = { 1: 1 }
    let otherVal = { 3: 3 }
    hv.add(existVal)

    try {
      hv.delByValue(otherVal)
      done(new Error('value should not exist'))
    } catch (_err) {
      done()
    }
  })

  it('has - resolved', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      let id = hv.add(val)
      assert(hv.has(id), 'id must be exist')
    })
  })

  it('has - rejected', () => {
    let hv = new HashVault()
    let val = { 1: 1 }
    let existId = hv.add(val)
    let otherId = existId - 1
    assert(hv.has(otherId), false, 'id should not exist')
  })

  it('hasByValue - resolved (exists)', () => {
    let hv = new HashVault()
    let values = [ { 1: 1 }, { 2: 2 } ]
    values.forEach(val => {
      hv.add(val)
      assert(hv.hasByValue(val), 'value must be exist')
    })
  })

  it('hasByValue - rejected (exists)', () => {
    let hv = new HashVault()
    let existValues = [ { 1: 1 }, { 2: 2 } ]
    let otherValues = [ { 3: 3 }, { 4: 4 } ]
    existValues.forEach(val => hv.add(val))

    let done = !otherValues.some(val => hv.hasByValue(val))
    assert(done, 'none of the value should not exist')
  })
})
