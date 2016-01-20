'use strict'

import { debugMethods } from 'simple-debugger'
import { shuffle, isNumber, isNull, isUndefined, isArray } from 'lodash'
import { format } from 'util'

export default class Queue {
  constructor() {
    debugMethods(this)

    this._storage = []
    this._queue = []
  }

  drop() {
    this._storage.length = 0
    this._queue.length = 0
    return this
  }

  copy(q) {
    if (!isArray(q._queue) || !isArray(q._storage))
      throw new Error(`Queue#copy problem: arg must be a Queue`
        + format(`\n\t arg: %j`, q))

    this._storage = q._storage.concat()
    this._queue   = q._queue.concat()
    return this
  }

  restore(q) {
    if (!isArray(q._queue) || !isArray(q._storage))
      throw new Error(`Queue#restore problem: arg must be { _queue :: Array, _storage :: Array }`
        + format(`\n\t arg: %j`, q))

    this._storage = q._storage.concat()
    this._queue   = q._queue.concat()

    for (let index = 0; index !== this._storage.length; index++) {
      if (isNull(this._storage[index])) delete this._storage[index]
    }

    return this
  }

  dump() {
    return {
      _storage: this._storage.concat(),
      _queue: this._queue.concat()
    }
  }

  toJSON() {
    return this.dump()
  }

  forEach(func, context) {
    return this.each(func, context)
  }

  each(func, context) {
    this._queue.forEach(id => {
      let v = this.get(id)
      func.call(context, v, id)
    })
    return this
  }

  _newStorageId() {
    return this._storage.length
  }

  _getStorageId(item) {
    return this._storage.indexOf(item)
  }

  _getQueueId(storageId) {
    return this._queue.indexOf(storageId)
  }

  id(item) {
    let id = this._getStorageId(item)
    if (id === -1)
      throw new Error(`Queue#id problem: id by item not found`
        + format('\n\t item: %j', item))
    return id
  }

  add(item) {
    let storageId = this._newStorageId()

    this._queue.push(storageId)
    this._storage.push(item)

    return storageId
  }

  del(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#del problem: item not found by storageId`
        + format(`\n\t storageId: %j`, storageId))

    let queueId = this._getQueueId(storageId)
    if (!isNumber(queueId))
      throw new Error(`Queue#del problem: queueId not found by storageId`
        + format(`\n\t storageId: %j`, storageId)
        + format(`\n\t item: %j`, this._storage[storageId]))

    delete this._storage[storageId]
    this._queue.splice(queueId, 1)

    return this
  }

  delByValue(item) {
    if (!this.hasByValue(item))
      throw new Error(`Queue#delByValue problem: storageId not found by item`
        + format(`\n\t item: %j`, item))

    let storageId = this.id(item)
    return this.del(storageId)
  }

  has(storageId) {
    storageId = parseInt(storageId)
    let el = this._storage[storageId]
    return !isUndefined(el)
  }

  hasByValue(item) {
    let id = this._getStorageId(item)
    return id !== -1
  }

  exists(item) {
    return this.hasByValue(item)
  }

  get(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#get problem: item not found by storageId`
        + format(`\n\t storageId: %j`, storageId))
    return this._storage[storageId]
  }

  getByValue(item) {
    return this.id(item)
  }

  all() {
    return this._storage.filter(v => !isUndefined(v))
  }

  shuffle() {
    return shuffle(this.all())
  }

  next() {
    if (!this.size())
      throw new Error(`Queue#next problem: empty queue`
        + format(`\n\t queue: %j`, this._queue)
        + format(`\n\t storage: %j`, this._storage))
    if (this._queue.some(e => isUndefined(e)))
      throw new Error(`Queue#next problem: queue has hole`
        + format(`\n\t queue: %j`, this._queue)
        + format(`\n\t storage: %j`, this._storage))

    let storageId = this._queue.shift()
    if (!this.has(storageId))
      throw new Error(`Queue#next problem: item not found by storageId`
        + format(`\n\t storageId: %j`, storageId)
        + format(`\n\t queue: %j`, this._queue)
        + format(`\n\t storage: %j`, this._storage))

    let item = this.get(storageId)
    delete this._storage[storageId]

    return item
  }

  shift() {
    return this.next()
  }

  toTail(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#toTail problem: item not found by storageId`
        + format(`\n\t storageId: %j`, storageId))

    let queueId = this._getQueueId(storageId)
    if (!isNumber(queueId))
      throw new Error(`Queue#toTail problem: queueId not found by storageId`
        + format(`\n\t storageId: %j`, storageId)
        + format(`\n\t item: %j`, this._storage[storageId]))

    this._queue.splice(queueId, 1)
    this._queue.push(storageId)

    return this
  }

  toHead(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#toHead problem: item not found by storageId`
        + format(`\n\t storageId: %j`, storageId))

    let queueId = this._getQueueId(storageId)
    if (!isNumber(queueId))
      throw new Error(`Queue#toHead problem: queueId not found by storageId`
        + format(`\n\t storageId: %j`, storageId)
        + format(`\n\t item: %j`, this._storage[storageId]))

    this._queue.splice(queueId, 1)
    this._queue.unshift(storageId)

    return this
  }

  size() {
    return this._queue.length
  }
}
