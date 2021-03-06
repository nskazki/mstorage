'use strict'

import { debugMethods } from 'simple-debugger'
import { isArray, isNull, isNaN } from 'lodash'
import { inspect } from 'util'

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
      throw new Error(`KV#copy problem: arg must be a KV\
        \n\t arg: ${inspect(kv)}`)

    this._values = kv._values.concat()
    this._keys   = kv._keys.concat()
    return this
  }

  restore(kv) {
    if (!isArray(kv._keys) || !isArray(kv._values))
      throw new Error(`KV#restore problem: arg must be a { _keys :: Array, _values :: Array }\
        \n\t arg: ${inspect(kv)}`)

    this._values = kv._values.map(el => isNull(el) ? undefined : el)
    this._keys   = kv._keys.map(el => isNull(el) ? undefined : el)
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
    if (isNaN(k))
      throw new Error(`KV#has problem: search by NaN not allowed!`)

    return this._keyIndex(k) !== -1
  }

  hasByValue(value) {
    if (isNaN(value))
      throw new Error(`KV#hasByValue problem: search by NaN not allowed`)

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
      throw new Error(`KV#get problem: keys not has ${inspect(k)}`)

    let index = this._keyIndex(k)
    return this._getValue(index)
  }

  getByValue(v) {
    if (!this.hasByValue(v))
      throw new Error(`KV#getByValue problem: values not has ${inspect(v)}`)

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
    if (isNaN(k))
      throw new Error(`KV#set problem: using NaN as a key not allowed!`)

    this._values.push(v)
    this._keys.push(k)
    return this
  }

  del(k) {
    if (!this.has(k))
      throw new Error(`KV#del problem: keys not has ${inspect(k)}`)

    let index = this._keyIndex(k)
    this._values.splice(index, 1)
    this._keys.splice(index, 1)
    return this
  }

  delByValue(v) {
    if (!this.hasByValue(v))
      throw new Error(`KV#delByValue problem: values not has ${inspect(v)}`)

    let index = this._valueIndex(v)
    this._values.splice(index, 1)
    this._keys.splice(index, 1)
    return this
  }

  size() {
    return this.keys().length
  }
}
