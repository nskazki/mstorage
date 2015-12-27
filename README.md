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

* `drop`
* `copy`
* `keys`
* `values`
* `has`
* `hasByValue` alias for `exists`
* `get`
* `getByValue` alias fot `id`
* `set` alias for `add`
* `del`
* `delByValue`
* `size` 

#### Queue

* `drop` 
* `copy`
* `each` alias for `forEach` 
* `add`
* `del`
* `delByValue`
* `has`
* `hasByValue` alias for `exists`
* `get`
* `getByValue` alias for `id`
* `all`
* `shuffle`
* `next` alias for `shift`
* `toTail`
* `toHead`
* `size`

#### HashVault

* `init`
* `drop`
* `copy`
* `getByValue` alias for `id`
* `add`
* `del`
* `delByValue`
* `has`
* `hasByValue` alias for `exists`
* `size`

## KV

Key-Value storage

#### `drop` - erase storage
 ```js
 var kv = new KV()
 kv.set('a', 1)
 kv.drop()
 assert.equal(kv.size(), 0)
 ```

#### `copy` - copy from other KV
```js
var kv1 = new KV()
var kv2 = new KV()
kv1.set('a', 1)
kv2.copy(kv1)
assert.deepEqual(kv1.keys(), kv2.keys())
```

#### `keys` - return list of keys
```js
var kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.keys(), [ 'a' ])
```

#### `values` - return list of values
```js
var kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.values(), [ 1 ])
```

#### `has`
```js
var kv = new KV()
kv.set('a', 1)
assert(kv.has('a'))
```

#### `hasByValue` alias for `exists`
```js
var kv = new KV()
kv.set('a', 1)
assert(kv.hasByValue(1))
```

#### `get`
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.get('a'), 1)
```

#### `getByValue` alias for `id`
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.getByValue(1), 'a')
```

#### `set` alias for `add`
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.get('a'), 1)
```

#### `del`
```js
var kv = new KV()
kv.set('a', 1)
kv.del('a')
assert.equal(kv.size(), 0)
```

#### `delByValue`
```js
var kv = new KV()
kv.set('a', 1)
kv.delByValue(1)
assert.equal(kv.size(), 0)
```

#### `size`
```js
var kv = new KV()
kv.set('a', 1)
assert.equal(kv.size(), 1)
```

## Queue

#### `drop` 
```js
var q = new Queue()
q.add(1)
q.drop()
assert.equal(q.size(), 0)
```

#### `copy`
```js
var q1 = new Queue()
var q2 = new Queue()

q1.add(1)
q2.copy(q1)

assert.deepEqual(q1.all(), q2.all())
```

#### `each` alias for `forEach` 
``` js
var q = new Queue()
q.add(1)
q.add(2)
q.each(console.log)
```

#### `add`
```js
var q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```
 
#### `del`
``` js
var q = new Queue()
var id = q.add(1)
q.del(id)
assert.equal(q.size(), 0)
```

#### `delByValue`
```js
var q = new Queue()
q.add(1)
q.delByValue(1)
assert.equal(q.size(), 0)
```

#### `has`
```js
var q = new Queue()
var id = q.add(1)
assert(q.has(id))
```

#### `hasByValue` alias for `exists`
```js
var q = new Queue()
q.add(1)
assert(q.hasByValue(1))
```

#### `get`
```js
var q = new Queue()
var id = q.add(1)
assert.equal(q.get(id), 1)
```

#### `getByValue` alias for `id`
```js
var q = new Queue()
var id = q.add(1)
assert.equal(q.getByValue(1), id)
```

#### `all`
```js
var q = new Queue()
q.add(1)
q.add(2)
assert.deepEqual(q.all(), [ 1, 2 ])
```

#### `shuffle`
```js
var q = new Queue()
q.add(1)
q.add(2)
console.log(q.shuffle())
```

#### `next` alias for `shift`
```js
var q = new Queue()
q.add(1)
var next = q.next()
assert.equal(next, 1)
assert.equal(q.size(), 0)
```

#### `toTail`
```js
var q = new Queue()
var id1 = q.add(1)
var id2 = q.add(2)
q.toTail(id1)
assert.equal(q.next(), 2)
```

#### `toHead`
```js
var q = new Queue()
var id1 = q.add(1)
var id2 = q.add(2)
q.toHead(id2)
assert.equal(q.next(), 2)
```

#### `size`
```js
var q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```

## HashVault

storage of sorted hashes

#### `init`
```js
var hv = new HashVault()
var array = [ 1, 2, 3, 4, 5 ]
hv.init(array)
assert.equal(hv.size(), array.length)
```

#### `drop`
```js
var hv = new HashVault()
hv.add(1)
hv.drop()
assert.equal(hv.size(), 0)
```

#### `copy`
```js
var hv1 = new HashVault()
var hv2 = new HashVault()

hv1.add(1)
hv1.add(2)

hv2.copy(hv1)
assert.equal(hv1.size(), hv2.size())
```

#### `getByValue` alias for `id`
```js
var hv = new HashVault()
var id = hv.add(1)
assert.equal(hv.getByValue(1), id)
```

#### `add`
```js
var hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```

#### `del`
```js
var hv = new HashVault()
var id = hv.add(1)
hv.del(id)
assert.equal(hv.size(), 0)
```

#### `delByValue`
```js
var hv = new HashVault()
hv.add(1)
hv.delByValue(1)
assert.equal(hv.size(), 0)
```

#### `has`
```js
var hv = new HashVault()
var id = hv.add(1)
assert(hv.has(id))
```

#### `hasByValue` alias for `exists`
```js
var hv = new HashVault()
hv.add(1)
assert(hv.hasByValue(1))
```

#### `size`
```js
var hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```
