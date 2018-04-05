const Heap = require('../index')
const assert = require('assert')
let h = new Heap()

describe("Basic operations", function(){
    it("first element is smallest item", function(){
        let h = new Heap()
        let arr = [8, 4, 2, 3, 7, 1, 9, 5, 6]
        arr.forEach(n => h.insert(n))
        let n = h.root
        assert.equal(n, 1)
    })
    it("items are popped in sorted descending order", function(){
        let h = new Heap()
        let arr = [8, 4, 2, 3, 7, 1, 9, 5, 6]
        arr.forEach(n => h.insert(n))
        let n = h.pop()
        let l = h.pop()
        do {
            assert(l > n);
            [n, l] = [l, h.pop()]
        } while (l)
    })
    it("iterator produces ordered items", function(){
        let h = new Heap()
        let arr = [8, 4, 2, 3, 7, 1, 9, 5, 6]
        arr.forEach(n => h.insert(n))
        let sorted = Array.from(h)
        assert.deepStrictEqual(sorted, [1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
    it("copy produces a new independent heap", function(){
        let h = new Heap()
        let arr = [8, 4, 2, 3, 7, 1, 9, 5, 6]
        arr.forEach(n => h.insert(n))
        let h2 = h.copy()
        let sorted = Array.from(h)
        assert.equal(h2.root, 1)
    })
})
describe("With a compare function", function(){
    it("first element is determined by compare", function(){
        let h = new Heap((a, b) => a.value > b.value)
        let arr = [{value: 2}, {value: 1}, {value: 7}, {value: 3}]
        arr.forEach(n => h.insert(n))
        let n = h.root
        assert.equal(n.value, 7)
    })
    it("items are popped in ascending order when comp function is opposite default", function(){
        let h = new Heap((a, b) => a > b)
        let arr = [8, 4, 2, 3, 7, 1, 9, 5, 6]
        arr.forEach(n => h.insert(n))
        let n = h.pop()
        let l = h.pop()
        do {
            assert(l < n);
            [n, l] = [l, h.pop()]
        } while (l)
    })
    it("works with more complex compare functions", function(){
        let h = Heap.fromArray(["Mark", "holly", "Al", "becky"], ((a,b)=> a.toLowerCase() < b.toLowerCase()))
        let arr = [...h]
        assert.deepStrictEqual(arr, ["Al", "becky", "holly", "Mark"])
    })
})
describe("fromArray factory", function(){
    it("produces heap from array", function(){
        let arr = [7, 2, 4, 8, 1, 9, 3, 6, 5]
        let h = Heap.fromArray(arr)
        assert.deepStrictEqual(Array.from(h), [1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
    it("produces heap from array with comparison function", function(){
        let arr = [7, 2, 4, 8, 1, 9, 3, 6, 5]
        let h = Heap.fromArray(arr, (a, b) => a > b)
        assert.deepStrictEqual(Array.from(h), [9, 8, 7, 6, 5, 4, 3, 2, 1])
    })
})
describe("heapfiy", function(){
    it("properly reorders heap when heapify is called", function(){
        let h = new Heap((a, b) => a.value < b.value)
        let arr = [{value: 2, name: "second"}, {value: 1, name: "first"}, {value: 7, name: "seventh"}, {value: 3, name: "third"}]
        arr.forEach(n => h.insert(n))
        assert.strictEqual(h.root, arr[1])
        arr[0].value = 0
        h.heapify()
        assert.strictEqual(h.root, arr[0])
    })
    it("should properly heapify leaf nodes", function(){
        let h =  Heap.fromArray([100, 100, 100, 100, 2], (a, b) => a< b)
        assert.equal(2, h.pop() )
    })
})