'use strict';

/**
 * Simple pure javascript heap implimentation
 * Storage is a simple array with amortized insert costs to allow very fast inserts on large heaps
 * Supports insert and pop for both min and max heaps
 * 
 * Pass in optional cmp function to control how objects are sorted
 * cmp should take a two arguments and return a boolean indicating which should be sorted first
 * 
 * Mark Meyer | mark@photo-mark.com
 * 
 */
const AMORT_MULT = 2

class Heap{
    constructor(cmp){
        this._s = new Array(1)
        this._comp = cmp || ((a, b) => a < b)
        this._size = 0
    }
    static fromArray(arr, comp = ((a, b) => a < b)) {
        let h = new Heap(comp)
        h._s = arr.slice()
        h._size = arr.length
        h.heapify()
        return h
    }
    get length(){
         return this._size
    }
    get root(){
        return this._s[0]
    }   
    *[Symbol.iterator](){
        /* Allows iteration over heap 
           i.e. Array.from(heap) or for (n of heap){}
           THIS IS DESTRUCTIVE. It works by removing elements 
           off the top of the heap.
        */
        let v = this.pop()
        while (v){
            yield v
            v = this.pop()
        }     
    }
    copy () {
        let copy = new Heap(this._comp)
        copy._s = this._s.slice()
        copy._size = this._size
        return copy
    }
    heapify(){
        for (let i = this._size - 1; i >= 0; i--){
            this.bubbledown(i)
        } 
    }
    insert(object){
        if(this._size == this._s.length) {
            let newArr = new Array(this._size * AMORT_MULT)
            for (let i = 0; i < this._s.length; i++)(
                newArr[i] = this._s[i]
            )
            this._s = newArr
        }
        this._s[this._size] = object
        this._size += 1
        this.bubbleup(this._size -1)
    }
    pop(){
        if (this._size === 0) return undefined
        if (this._size === 1) {
            this._size -= 1
            let item = this._s[0]
            this._s =  new Array(1)
            return item 
        }
        let item = this._s[0]
        this._s[0] = this._s[this._size - 1]
        this._s[this._size - 1] = undefined
        this._size -= 1
        this.bubbledown(0)  
           
        if (this._s.length > this._size * AMORT_MULT){
            this._s = this._s.slice(0, this._size)
        }
        return item
    }
    bubbleup(index){
        let bubbled = this._s[index]
        let comp = this._comp
        while(index > 0) {
            let parent_index = Math.floor((index-1)/2)
            if (! comp(bubbled, this._s[parent_index])) break
            this._s[index] = this._s[parent_index]
            index = parent_index
        }
        this._s[index] = bubbled
    }
    bubbledown(index){
        let cmp = this._comp
        let len = this._size
        let bubbled = this._s[index]
        let max = Math.floor(this._size / 2)
        while (index < max){
            let c_l = index * 2 + 1 
            let c_r = c_l + 1
            let lightest = this._s[c_l]    
            if(c_r < len && cmp(this._s[c_r], lightest) ){
                c_l = c_r
                lightest = this._s[c_r]
            }
            if(cmp(bubbled, lightest) ) break
            this._s[index] = lightest
            index = c_l
        } 
        this._s[index] = bubbled
     }
 }

module.exports = Heap