'use strict'

import { debugMethods } from 'simple-debugger'
import { isObject, isArray, isNumber } from 'lodash'
import { format } from 'util'
import xxhashjs from 'xxhashjs'

let obj2json = JSON.stringify

export default class HashVault {
  constructor(initArray) {
    debugMethods(this)

    this._array = []
    this._seed = 0xABCD
    if (initArray) this.init(initArray)
  }

  init(initArray) {
    this._array = initArray.map(el => {
      if (isObject(el)) el = obj2json(el)
      return xxhashjs(el, this._seed).toNumber()
    })

    this._array.sort((el1, el2) => el1-el2)
    return this
  }

  drop() {
    this._array.length = 0
    return this
  }

  copy(hv) {
    if (!isArray(hv._array) || !isNumber(hv._seed))
      throw new Error(`HashVault#copy problem: arg must be a HashVault`
        + format(`\n\t arg: %j`, hv))

    this._seed  = hv._seed
    this._array = hv._array.concat()
    return this
  }

  dump() {
    return {
      _array: this._array.concat(),
      _seed: this._seed
    }
  }

  id(searchEl) {
    let searchIndex = this._indexOf(searchEl)
    if (searchIndex === -1)
      throw new Error(`HashVault#id problem: searchIndex not found by searchEl`
        + format(`\n\t searchEl: %j`, searchEl))

    return searchIndex
  }

  getByValue(searchEl) {
    return this.id(searchEl)
  }

  add(newEl) {
    if (isObject(newEl)) newEl = obj2json(newEl)
    let newHash = xxhashjs(newEl, this._seed).toNumber()

    let newIndex = this._insertIndex(newHash)
    this._array.splice(newIndex, 0, newHash)

    return newIndex
  }

  del(oldIndex) {
    if (!this.has(oldIndex))
      throw new Error(`HashVault#del problem: oldEl not found by oldIndex!`
        + format(`\n\t oldIndex: %j`, oldIndex))

    this._array.splice(oldIndex, 1)
    return this
  }

  delByValue(oldEl) {
    let oldIndex = this._indexOf(oldEl)
    if (oldIndex === -1)
      throw new Error(`HashVault#delByValue problem: oldIndex not found by oldEl!`
        + format(`\n\t oldEl: %j`, oldEl))

    this._array.splice(oldIndex, 1)
    return this
  }

  has(index) {
    return isNumber(this._array[index])
  }

  hasByValue(searchEl) {
    return this.exists(searchEl)
  }

  exists(searchEl) {
    if (isObject(searchEl)) searchEl = obj2json(searchEl)
    let searchHash = xxhashjs(searchEl, this._seed).toNumber()

    let minIndex = 0
    let maxIndex = this._array.length - 1
    let currentIndex
    let currentElement

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0
      currentElement = this._array[currentIndex]

      if (currentElement < searchHash) {
        minIndex = currentIndex + 1
      } else if (currentElement > searchHash) {
        maxIndex = currentIndex - 1
      } else {
        return true
      }
    }

    return false
  }

  _indexOf(searchEl) {
    if (isObject(searchEl)) searchEl = obj2json(searchEl)
    var searchHash = xxhashjs(searchEl, this._seed).toNumber()

    var minIndex = 0
    var maxIndex = this._array.length - 1
    var currentIndex
    var currentElement

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0
      currentElement = this._array[currentIndex]

      if (currentElement < searchHash) {
        minIndex = currentIndex + 1
      } else if (currentElement > searchHash) {
        maxIndex = currentIndex - 1
      } else {
        return currentIndex
      }
    }

    return -1
  }

  _insertIndex(newHash) {
    if (this._array.length === 0)
      return 0

    let minIndex = 0
    let maxIndex = this._array.length - 1
    let currentIndex
    let currentElement

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0
      currentElement = this._array[currentIndex]

      if (currentElement < newHash) {
        minIndex = currentIndex + 1
      } else if (currentElement > newHash) {
        maxIndex = currentIndex - 1
      } else {
        break
      }
    }

    if (currentElement > newHash) {
      return currentIndex
    } else {
      return currentIndex + 1
    }
  }

  size() {
    return this._array.length
  }
}
