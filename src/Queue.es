'use strict'

import { debugMethods } from 'simple-debugger'
import { shuffle, isNaN, isNull, isArray } from 'lodash'
import { inspect } from 'util'

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
      throw new Error(`Queue#copy problem: arg must be a Queue\
        \n\t arg: ${inspect(q)}`)

    this._storage = q._storage.concat()
    this._queue   = q._queue.concat()
    return this
  }

  restore(q) {
    if (!isArray(q._queue) || !isArray(q._storage))
      throw new Error(`Queue#restore problem: arg must be { _queue :: Array, _storage :: Array }\
        \n\t arg: ${inspect(q)}`)

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
    this._queue.forEach(queueId => {
      let storageId = this._getStorageIdByQueueId(queueId)
      let item = this._getItemByStorageId(storageId)
      func.call(context, item, storageId)
    })
    return this
  }

  map(func, context) {
    this._queue.forEach(queueId => {
      let storageId = this._getStorageIdByQueueId(queueId)
      let item = this._getItemByStorageId(storageId)
      let newItem = func.call(context, item, storageId)
      this._setItemByStorageId(storageId, newItem)
    })
    return this
  }

  _newStorageId() {
    return this._storage.length
  }

  _getStorageIdByQueueId(queueId) {
    return this._queue[queueId]
  }

  _getStorageIdByItem(item) {
    return this._storage.indexOf(item)
  }

  _getQueueIdByStorageId(storageId) {
    return this._queue.indexOf(storageId)
  }

  _getItemByStorageId(storageId) {
    return this._storage[storageId]
  }

  _setItemByStorageId(storageId, item) {
    this._storage[storageId] = item
    return this
  }

  add(item) {
    let storageId = this._newStorageId()

    this._queue.push(storageId)
    this._storage.push(item)

    return storageId
  }

  replace(storageId, newItem) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#replace problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}`)

    this._setItemByStorageId(storageId, newItem)
    return this
  }

  del(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#del problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}`)

    let queueId = this._getQueueIdByStorageId(storageId)
    if (queueId === -1)
      throw new Error(`Queue#del problem: queueId not found by storageId\
        \n\t storageId: ${inspect(storageId)}\
        \n\t item: ${inspect(this._storage[storageId])}`)

    delete this._storage[storageId]
    this._queue.splice(queueId, 1)

    return this
  }

  delByValue(item) {
    if (!this.hasByValue(item))
      throw new Error(`Queue#delByValue problem: storageId not found by item\
        \n\t item: ${inspect(item)}`)

    let storageId = this.id(item)
    return this.del(storageId)
  }

  has(storageId) {
    storageId = parseInt(storageId)
    return this._storage.hasOwnProperty(storageId)
  }

  hasByValue(item) {
    if (isNaN(item))
      throw new Error(`Queue#hasByValue problem: search by NaN not allowed!`)

    let id = this._getStorageIdByItem(item)
    return id !== -1
  }

  exists(item) {
    return this.hasByValue(item)
  }

  get(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#get problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}`)
    return this._getItemByStorageId(storageId)
  }

  getByValue(item) {
    let id = this._getStorageIdByItem(item)
    if (id === -1)
      throw new Error(`Queue#getByValue problem: id by item not found\
        \n\t item: ${inspect(item)}`)

    return id
  }

  id(item) {
    return this.getByValue(item)
  }

  all() {
    let q = this._queue
    let r = []
    for (var index = 0; index !== q.length; index++) {
      let storageId = this._getStorageIdByQueueId(index)
      let item = this._getItemByStorageId(storageId)
      r.push(item)
    }

    return r
  }

  shuffle() {
    return shuffle(this.all())
  }

  next() {
    if (!this.size())
      throw new Error(`Queue#next problem: empty queue\
        \n\t queue: ${inspect(this._queue)}\
        \n\t storage: ${inspect(this._storage)}`)

    let storageId = this._queue.shift()
    if (!this.has(storageId))
      throw new Error(`Queue#next problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}\
        \n\t queue: ${inspect(this._queue)}\
        \n\t storage: ${inspect(this._storage)}`)

    let item = this._getItemByStorageId(storageId)
    delete this._storage[storageId]

    return item
  }

  shift() {
    return this.next()
  }

  last() {
    if (!this.size())
      throw new Error(`Queue#last problem: empty queue\
        \n\t queue: ${inspect(this._queue)}\
        \n\t storage: ${inspect(this._storage)}`)

    let storageId = this._queue.pop()
    if (!this.has(storageId))
      throw new Error(`Queue#last problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}\
        \n\t queue: ${inspect(this._queue)}\
        \n\t storage: ${inspect(this._storage)}`)

    let item = this._getItemByStorageId(storageId)
    delete this._storage[storageId]

    return item
  }

  pop() {
    return this.last()
  }

  toTail(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#toTail problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}`)

    let queueId = this._getQueueIdByStorageId(storageId)
    if (queueId === -1)
      throw new Error(`Queue#toTail problem: queueId not found by storageId\
        \n\t storageId: ${inspect(storageId)}\
        \n\t item: ${inspect(this._storage[storageId])}`)

    this._queue.splice(queueId, 1)
    this._queue.push(storageId)

    return this
  }

  toHead(storageId) {
    storageId = parseInt(storageId)
    if (!this.has(storageId))
      throw new Error(`Queue#toHead problem: item not found by storageId\
        \n\t storageId: ${inspect(storageId)}`)

    let queueId = this._getQueueIdByStorageId(storageId)
    if (queueId === -1)
      throw new Error(`Queue#toHead problem: queueId not found by storageId\
        \n\t storageId: ${inspect(storageId)}\
        \n\t item: ${inspect(this._storage[storageId])}`)

    this._queue.splice(queueId, 1)
    this._queue.unshift(storageId)

    return this
  }

  size() {
    return this._queue.length
  }
}
