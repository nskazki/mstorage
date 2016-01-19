'use strict'

import { debugMethods } from 'simple-debugger'
import { isArray, isNull } from 'lodash'
import { format } from 'util'

export default class KV {
  constructor() {
    debugMethods(this)

    this._keys = []
    this._values = []
  }

  drop() {
    this._keys.length = 0
    this._values.length = 0
    return this
  }

  copy(kv) {
    if (!isArray(kv._keys) || !isArray(kv._values))
      throw new Error(`KV#copy problem: arg must be a KV`
        + format(`\n\t arg: %j`, kv))

    this._values = kv._values.concat()
    this._keys   = kv._keys.concat()
    return this
  }

  restore(kv) {
    if (!isArray(kv._keys) || !isArray(kv._values))
      throw new Error(`KV#restore problem: arg must be a { _keys :: Array, _values :: Array }`
        + format(`\n\t arg: %j`, kv))

    this._values = kv._values.map(v => isNull(v) ? undefined : v)
    this._keys   = kv._keys.map(v => isNull(v) ? undefined : v)
    return this
  }

  dump() {
    return {
      _values: this._values.concat(),
      _keys: this._keys.concat()
    }
  }

  toJSON() {
    return this.dump()
  }

  keys() {
    return this._keys
  }

  values() {
    return this._values
  }

  has(k) {
    return this._keyIndex(k) !== -1
  }

  hasByValue(value) {
    return this._valueIndex(value) !== -1
  }

  exists(value) {
    return this.hasByValue(value)
  }

  _keyIndex(k) {
    return this.keys().indexOf(k)
  }

  _valueIndex(v) {
    return this.values().indexOf(v)
  }

  _getKey(index) {
    return this.keys()[index]
  }

  _getValue(index) {
    return this.values()[index]
  }

  get(k) {
    if (!this.has(k))
      throw new Error(format(`KV#get problem: keys not has %j`, k))

    let index = this._keyIndex(k)
    return this._getValue(index)
  }

  getByValue(v) {
    if (!this.hasByValue(v))
      throw new Error(format(`KV#getByValue problem: values not has %j`, v))

    let index = this._valueIndex(v)
    return this._getKey(index)
  }

  id(v) {
    return this.getByValue(v)
  }

  add(k, v) {
    return this.set(k, v)
  }

  set(k, v) {
    this._values.push(v)
    this._keys.push(k)
    return this
  }

  del(k) {
    if (!this.has(k))
      throw new Error(format(`KV#del problem: keys not has %j`, k))

    let index = this._keyIndex(k)
    this._values.splice(index, 1)
    this._keys.splice(index, 1)
    return this
  }

  delByValue(v) {
    if (!this.hasByValue(v))
      throw new Error(format(`KV#delByValue problem: values not has %j`, v))

    let index = this._valueIndex(v)
    this._values.splice(index, 1)
    this._keys.splice(index, 1)
    return this
  }

  size() {
    return this.keys().length
  }
}
