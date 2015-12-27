# mstorage

```
npm i -S mstorage
```

```js
import { KV } from 'mstorage'

let kv = new KV()
let key = { a: 'a' }
let val = [ 1, 2 ]
kv.set(key, val)

console.log(kv.has(key))
console.log(kv.hasByValue(val))
console.log(kv.get(key))
console.log(kv.getByValue(val))

import { Queue } from 'mstorage'

let q = new Queue()
let id1 = q.add({ 1: 1 })
let id2 = q.add({ 2: 2 })
q.toTail(id1)
let next = q.next()
assert.deepEqual(next, { 2: 2 })

import { HashVault } from 'mstorage'

let array = []
for (let index = 0; index !== 1e6; index++) 
    array.push({ 1: index })

let hv = new HashVault(array)
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
* `hasByValue`
* `get`
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
 let kv = new KV()
 kv.set('a', 1)
 kv.drop()
 assert.equal(kv.size(), 0)
 ```

#### `copy` - copy from other KV
```js
let kv1 = new KV()
let kv2 = new KV()
kv1.set('a', 1)
kv2.copy(kv1)
assert.deepEqual(kv1.keys(), kv2.keys())
```

#### `keys` - return list of keys
```js
let kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.keys(), [ 'a' ])
```

#### `values` - return list of values
```js
let kv = new KV()
kv.set('a', 1)
assert.deepEqual(kv.values(), [ 1 ])
```

#### `has`
```js
let kv = new KV()
kv.set('a', 1)
assert(hv.has('a'))
```

#### `hasByValue`
```js
let kv = new KV()
kv.set('a', 1)
assert(hv.hasByValue(1))
```

#### `get`
```js
let kv = new KV()
kv.set('a', 1)
assert.equal(hv.get('a'), 1)
```

#### `set` alias for `add`
```js
let kv = new KV()
kv.set('a', 1)
assert.equal(hv.get('a'), 1)
```

#### `del`
```js
let kv = new KV()
kv.set('a', 1)
kv.del('a')
assert.equal(kv.size(), 0)
```

#### `delByValue`
```js
let kv = new KV()
kv.set('a', 1)
kv.delByValue(1)
assert.equal(kv.size(), 0)
```

#### `size`
```js
let kv = new KV()
kv.set('a', 1)
assert.equal(kv.size(), 1)
```

## Queue

#### `drop` 
```js
let q = new Queue()
q.add(1)
q.drop()
assert.equal(q.size(), 0)
```

#### `copy`
```js
let q1 = new Queue()
let q2 = new Queue()

q1.add(1)
q2.copy(q1)

assert.deepEqual(q1.all(), q2.all())
```

#### `each` alias for `forEach` 
``` js
let q = new Queue()
q.add(1)
q.add(2)
q.each(console.log)
```

#### `add`
```js
let q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```
 
#### `del`
``` js
let q = new Queue()
let id = q.add(1)
q.del(id)
assert.equal(q.size(), 0)
```

#### `delByValue`
```js
let q = new Queue()
q.add(1)
q.delByValue(1)
assert.equal(q.size(), 0)
```

#### `has`
```js
let q = new Queue()
let id = q.add(1)
assert(q.has(id))
```

#### `hasByValue` alias for `exists`
```js
let q = new Queue()
q.add(1)
assert(q.hasByValue(1))
```

#### `get`
```js
let q = new Queue()
let id = q.add(1)
assert.equal(q.get(id), 1)
```

#### `getByValue` alias for `id`
```js
let q = new Queue()
let id = q.add(1)
assert.equal(q.getByValue(1), id)
```

#### `all`
```js
let q = new Queue()
q.add(1)
q.add(2)
assert.deepEqual(q.all(), [ 1, 2 ])
```

#### `shuffle`
```js
let q = new Queue()
q.add(1)
q.add(2)
console.log(q.shuffle())
```

#### `next` alias for `shift`
```js
let q = new Queue()
q.add(1)
let next = q.next()
assert.equal(next, 1)
assert.equal(q.size(), 0)
```

#### `toTail`
```js
let q = new Queue()
let id1 = q.add(1)
let id2 = q.add(2)
q.toTail(id1)
assert.equal(q.next(), 2)
```

#### `toHead`
```js
let q = new Queue()
let id1 = q.add(1)
let id2 = q.add(2)
q.toHead(id2)
assert.equal(q.next(), 1)
```

#### `size`
```js
let q = new Queue()
q.add(1)
assert.equal(q.size(), 1)
```

## HashVault

storage of sorted hashes

#### `init`
```js
let hv = new HashVault()
let array = [ 1, 2, 3, 4, 5 ]
hv.init(array)
assert.equal(hv.size(), array.length)
```

#### `drop`
```js
let hv = new HashVault()
hv.add(1)
hv.drop()
assert.equal(hv.size(), 0)
```

#### `copy`
```js
let hv1 = new HashVault()
let hv2 = new HashVault()

hv1.add(1)
hv1.add(2)

hv2.copy(hv1)
assert.equal(hv1.size(), hv2.size())
```

#### `getByValue` alias for `id`
```js
let hv = new HashVault()
let id = hv.add(1)
assert.equal(hv.getByValue(1), id)
```

#### `add`
```js
let hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```

#### `del`
```js
let hv = new HashVault()
let id = hv.add(1)
hv.del(id)
assert.equal(hv.size(), 0)
```

#### `delByValue`
```js
let hv = new HashVault()
hv.add(1)
hv.delByValue(1)
assert.equal(hv.size(), 0)
```

#### `has`
```js
let hv = new HashVault()
let id = hv.add(1)
assert(hv.has(id))
```

#### `hasByValue` alias for `exists`
```js
let hv = new HashVault()
hv.add(1)
assert(hv.hasByValue(1))
```

#### `size`
```js
let hv = new HashVault()
hv.add(1)
assert.equal(hv.size(), 1)
```
