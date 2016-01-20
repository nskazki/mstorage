# mstorage

```
npm i -S mstorage
```

```js
import { KV } from 'mstorage'

var kv = new KV()
var key = { a: 'a' }
var val = [ 1, 2 ]
kv.set(key, val)

console.log(kv.has(key))
console.log(kv.hasByValue(val))
console.log(kv.get(key))
console.log(kv.getByValue(val))

import { Queue } from 'mstorage'

var q = new Queue()
var id1 = q.add({ 1: 1 })
var id2 = q.add({ 2: 2 })
q.toTail(id1)
var next = q.next()
assert.deepEqual(next, { 2: 2 })

import { HashVault } from 'mstorage'

var array = []
for (var index = 0; index !== 1e6; index++) 
    array.push({ 1: index })

var hv = new HashVault(array)
assert(hv.exists({ 1: 100 }))
assert(hv.exists({ 1: 10000 }))
assert(hv.exists({ 1: 10000000 }))
```

## Methods

#### KV

* [`drop`](#drop---erase-storage-)
* [`copy` alias for `restore`](#copy-alias-for-restore-)
* [`dump` & `restore`](#dump--restore-)
* [`keys`](#keys---return-list-of-keys-)
* [`values`](#values---return-list-of-values-)
* [`has`](#has-)
* [`hasByValue` alias for `exists`](#hasbyvalue-alias-for-exists-)
* [`get`](#get-)
* [`getByValue` alias fot `id`](#getbyvalue-alias-for-id-)
* [`set` alias for `add`](#set-alias-for-add-)
* [`del`](#del-)
* [`delByValue`](#delbyvalue-)
* [`size`](#size-)

#### Queue

* [`drop`](#drop-)
* [`copy`](#copy-)
* [`dump` & `restore`](#dump--restore--1)
* [`each` alias for `forEach`](#each-alias-for-foreach-)
* [`add`](#add-)
* [`del`](#del--1)
* [`delByValue`](#delbyvalue--1)
* [`has`](#has--1)
* [`hasByValue` alias for `exists`](#hasbyvalue-alias-for-exists--1)
* [`get`](#get--1)
* [`getByValue` alias for `id`](#getbyvalue-alias-for-id--1)
* [`all`](#all-)
* [`shuffle`](#shuffle-)
* [`next` alias for `shift`](#next-alias-for-shift-)
* [`toTail`](#totail-)
* [`toHead`](#tohead-)
* [`size`](#size--1)

#### HashVault

* [`init`](#init-)
* [`drop`](#drop--1)
* [`copy` alias for `restore`](#copy-alias-for-restore--1)
* [`dump` & `restore`](#dump--restore--2)
* [`getByValue` alias for `id`](#getbyvalue-alias-for-id--2)
* [`add`](#add--1)
* [`del`](#del--2)
* [`delByValue`](#delbyvalue--2)
* [`has`](#has--2)
* [`hasByValue` alias for `exists`](#hasbyvalue-alias-for-exists--2)
* [`size`](#size--2)

## KV

Key-Value storage

#### `drop` - erase storage [[🛨]](#kv)
 ```js
 var kv = new KV()
 kv.set('a', 1)
 kv.drop()
 assert.equal(kv.size(), 0)
 ```

#### `copy` alias for `restore` [[🛨]](#kv)
```js
var kv1 = new KV()
var kv2 = new KV()

kv1.set('a', 1)
kv2.copy(kv1)

assert.deepEqual(kv1.keys(), kv2.keys())
```

#### `dump` & `restore` [[🛨]](#kv)
```js
var kv1 = new KV()
var kv2 = new KV()

kv1.set('a', 1)
var str = JSON.stringify(kv1.dump())
// or just call JSON.stringify(kv1)
kv2.restore(JSON.parse(str))

assert.deepEqual(kv1.keys(), kv2.keys())
```

#### `keys` - return list of keys [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.keys(), [ 'a' ])
```

#### `values` - return list of values [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.values(), [ 1 ])
```

#### `has` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert(kv.has('a'))
```

#### `hasByValue` alias for `exists` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert(kv.hasByValue(1))
```

#### `get` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.get('a'), 1)
```

#### `getByValue` alias for `id` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.getByValue(1), 'a')
```

#### `set` alias for `add` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.get('a'), 1)
```

#### `del` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
kv.del('a')
assert.equal(kv.size(), 0)
```

#### `delByValue` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
kv.delByValue(1)
assert.equal(kv.size(), 0)
```

#### `size` [[🛨]](#kv)
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.size(), 1)
```

## Queue

#### `drop` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
q.drop()
assert.equal(q.size(), 0)
```

#### `copy` [[🛨]](#queue)
```js
var q1 = new Queue()
var q2 = new Queue()

q1.add(1)
q2.copy(q1)

assert.deepEqual(q1.all(), q2.all())
```

#### `dump` & `restore` [[🛨]](#queue)
```js
var q1 = new Queue()
var q2 = new Queue()

q1.add(1)
var str = JSON.stringify(q1.dump())
// or just call JSON.stringify(q1)
q2.restore(JSON.parse(str))
// WARNING! all null values will be replaced to undefined

assert.deepEqual(q1.all(), q2.all())
```

#### `each` alias for `forEach` [[🛨]](#queue)
``` js
var q = new Queue()
q.add(1)
q.add(2)
q.each(console.log)
```

#### `add` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```
 
#### `del` [[🛨]](#queue)
``` js
var q = new Queue()
var id = q.add(1)
q.del(id)
assert.equal(q.size(), 0)
```

#### `delByValue` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
q.delByValue(1)
assert.equal(q.size(), 0)
```

#### `has` [[🛨]](#queue)
```js
var q = new Queue()
var id = q.add(1)
assert(q.has(id))
```

#### `hasByValue` alias for `exists` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
assert(q.hasByValue(1))
```

#### `get` [[🛨]](#queue)
```js
var q = new Queue()
var id = q.add(1)
assert.equal(q.get(id), 1)
```

#### `getByValue` alias for `id` [[🛨]](#queue)
```js
var q = new Queue()
var id = q.add(1)
assert.equal(q.getByValue(1), id)
```

#### `all` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
q.add(2)
assert.deepEqual(q.all(), [ 1, 2 ])
```

#### `shuffle` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
q.add(2)
console.log(q.shuffle())
```

#### `next` alias for `shift` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
var next = q.next()
assert.equal(next, 1)
assert.equal(q.size(), 0)
```

#### `toTail` [[🛨]](#queue)
```js
var q = new Queue()
var id1 = q.add(1)
var id2 = q.add(2)
q.toTail(id1)
assert.equal(q.next(), 2)
```

#### `toHead` [[🛨]](#queue)
```js
var q = new Queue()
var id1 = q.add(1)
var id2 = q.add(2)
q.toHead(id2)
assert.equal(q.next(), 2)
```

#### `size` [[🛨]](#queue)
```js
var q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```

## HashVault

storage of sorted hashes

#### `init` [[🛨]](#hashvault)
```js
var hv = new HashVault()
var array = [ 1, 2, 3, 4, 5 ]
hv.init(array)
assert.equal(hv.size(), array.length)
```

#### `drop` [[🛨]](#hashvault)
```js
var hv = new HashVault()
hv.add(1)
hv.drop()
assert.equal(hv.size(), 0)
```

#### `copy` alias for `restore` [[🛨]](#hashvault)
```js
var hv1 = new HashVault()
var hv2 = new HashVault()

hv1.add(1)
hv1.add(2)

hv2.copy(hv1)
assert.equal(hv1.size(), hv2.size())
```

#### `dump` & `restore` [[🛨]](#hashvault)
```js
var hv1 = new HashVault()
var hv2 = new HashVault()

hv1.add(1)
hv1.add(2)

var str = JSON.stringify(hv1.dump())
// or just call JSON.stringify(hv1)
hv2.copy(JSON.parse(str))

assert.ok(hv2.exists(1))
assert.ok(hv2.exists(2))
```

#### `getByValue` alias for `id` [[🛨]](#hashvault)
```js
var hv = new HashVault()
var id = hv.add(1)
assert.equal(hv.getByValue(1), id)
```

#### `add` [[🛨]](#hashvault)
```js
var hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```

#### `del` [[🛨]](#hashvault)
```js
var hv = new HashVault()
var id = hv.add(1)
hv.del(id)
assert.equal(hv.size(), 0)
```

#### `delByValue` [[🛨]](#hashvault)
```js
var hv = new HashVault()
hv.add(1)
hv.delByValue(1)
assert.equal(hv.size(), 0)
```

#### `has` [[🛨]](#hashvault)
```js
var hv = new HashVault()
var id = hv.add(1)
assert(hv.has(id))
```

#### `hasByValue` alias for `exists` [[🛨]](#hashvault)
```js
var hv = new HashVault()
hv.add(1)
assert(hv.hasByValue(1))
```

#### `size` [[🛨]](#hashvault)
```js
var hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```
