# jheap
Pure-Javascript heap implementation. A heap is a simple data structure that maintains 'heap' order while supporting basic operations of insertion and extracting the minumim.  

## Install
Using npm:
```shell
$ npm i jheap --save
```

## Basic Use
``` js
const Heap = require('jheap')
/* create new heap */
let h = new Heap()
/* Add items */
h.insert(10)
h.insert(1)
h.insert(5)
h.insert(2)
let length = h.length  // --> 4
/* extract root */
let smallest = h.pop() // --> 1
length = h.length      // --> 3
```
You can also create a heap from an array:
``` js
const Heap = require('jheap')
/* create new heap */
let h = Heap.fromArray([2, 5, 7, 1, 8])
/* extract root */
let smallest = h.pop() // --> 1
```

The heap supports the iterator protocol so this works (almost) as expected. However, **these are destructive** becuase it extracts the root off the heap as it iterates:
```js
/* create new heap */
let h = Heap.fromArray([2, 5, 7, 1, 8])
let array = Array.from(h) // --> [1, 2, 5, 7, 8]

h = Heap.fromArray([2, 5, 7, 1, 8])
for (item of h) {
    // --> 1, 2, etc.
} 

h = Heap.fromArray([2, 5, 7, 1, 8])
array = [...h] // --> [1, 2, 5, 7, 8]
```

To get the root non-destructively use the `root` property:
```js
h = Heap.fromArray([2, 5, 7, 1, 8])
let root = h.root // --> 1
```

To produce an array from a heap in a non-destructive way, first create a copy. This is a shallow copy. If the heap contains complex objects, this copy will still point to the original objects
```js
h = Heap.fromArray([2, 5, 7, 1, 8])
h2 = h.copy()
array = [...h2] // --> [ 1, 2, 5, 7, 8 ]
/* original is unaffected */
h.root     // --> 1
h.length   // --> 5
/* copy has been exhausted */
h2.root    // --> undefined
h2.length  // --> 0
```

## Compare function
The default behavior of jheap is a min-heap sorted by the items. The root will always be the smallest value. To alter this, for example to create a max-heap, pass a function that takes two arguments `a` and `b` into the contructor that returns true when `a` should bubble up above `b`.

```js
let maxHeap = new Heap((a,b) => a > b)
maxHeap.insert(6)
maxHeap.insert(10)
maxHeap.insert(5)
maxHeap.insert(2)
let root = maxHeap.root // --> 10
```

```js
let stringHeap = new Heap((a,b) => a.toLowerCase() < b.toLowerCase())
stringHeap.insert('Theropoda')
stringHeap.insert('ornithischia')
stringHeap.insert('sauropodomorpha')
stringHeap.insert('Diplodocoidea')
let a = [...stringHeap] // --> [ 'Diplodocoidea', 'ornithischia', 'sauropodomorpha', 'Theropoda' ]
```

You can also use this to store more complex objects in the heap:
```js
let h = new Heap((a,b) => a.rank < b.rank)
h.insert({rank:6, name:"orange"})
h.insert({rank:2, name:"blue"})
h.insert({rank:5, name:"yellow"})
h.insert({rank:9, name:"green"})
let root = h.root // --> { rank: 2, name: 'blue' }
```

The factory function `fromArray` also accepts a compare function as it's second argument:
```js
let colors = [
    {rank:6, name:"orange"},
    {rank:2, name:"blue"},
    {rank:5, name:"yellow"},
    {rank:9, name:"green"}
]
let h = Heap.fromArray(colors, (a,b) => a.rank < b.rank)

let root = h.root // --> { rank: 2, name: 'blue' }
```

## Maintain heap order
Altering the sort value of elements within the heap can break the heap order. Calling `heapify()` on the heap will repair it
```js
let colors = [
    {rank:6, name:"orange"},
    {rank:2, name:"blue"},
    {rank:5, name:"yellow"},
    {rank:9, name:"green"}
]
let h = Heap.fromArray(colors, (a,b) => a.rank < b.rank)
colors[0].rank = 1
let root = h.root // --> still points to blue
h.heapify()
root = h.root // --> now correctly points to orange
```