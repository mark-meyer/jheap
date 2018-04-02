/**
 * Simple pure javascript heap implimentation
 * Storage is a simple array
 * Supports insert and pop for both min and max heaps
 * 
 * Pass in optional cmp function to control how objects are sorted
 * cmp should take a two arguments and return a boolean indicating which should be sorted first
 * 
 * Mark Meyer | mark@photo-mark.com
 * 
 */

class Heap{
    constructor(cmp){
        this._s = new Array(1)
        this._comp = cmp || ((a, b) => a < b)
        this._size = 0
    }
    static fromArray(arr, comp = ((a, b) => a < b)) {
        /* from Skiena */
        let h = new Heap(comp)
        h._s = new Array(arr.length * 2)
        for (let i = 0; i < arr.length; i++){
          h._s[i] = arr[i]  
        }
        h._size = arr.length
        for (let i = arr.length; i >= 0; i--){
            h.bubbledown(i)
        }
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
        return copy
    }
    heapify(){
        for (let i = this._s.length; i >= 0; i--){
            this.bubbledown(i)
        } 
    }
    insert(object){
        if(this._size == this._s.length) {
            let newArr = new Array(this._size * 2)
            for (let i =0 ; i < this._s.length; i++)(
                newArr[i] = this._s[i]
            )
            this._s = newArr
        }
        this._s[this._size] = object
        this._size += 1
        this.bubbleup(this.length -1)
    }
    pop(){
        if (this.length === 0){
            return undefined
        }
        if (this.length === 1) {
            this._size -= 1
            let item = this._s[0]
            this._s =  new Array(1)
            return item // last item or undefined if empty
        }
        let item = this._s[0]
        this._s[0] = this._s[this._size -1]
        this._s[this._size -1] = undefined
        this.bubbledown(0)
        this._size -= 1
        if (this._s.length > this._size * 2){
            this._s = this._s.slice(0, this._size)
        }
        return item
    }
    bubbleup(index){
        if(index <= 0) return // at top
        let parent_index = Math.floor((index-1)/2)
       
        if (this._comp(this._s[index], this._s[parent_index])){
            [this._s[parent_index], this._s[index]] = [this._s[index],this._s[parent_index] ]
            this.bubbleup(parent_index)
        }
    }
    bubbledown(index){
        let c = index * 2 + 1 /* child index */
        let swapIndex = index
 
        for (let i = 0; i <= 1; i++){
            if(c+i < this.length && this._comp(this._s[c+i], this._s[swapIndex])){
                    swapIndex = c+i
            }
        }
        if (swapIndex != index){
            [this._s[swapIndex], this._s[index]] = [this._s[index],this._s[swapIndex] ]
            this.bubbledown(swapIndex)
        }    
     }
 }

module.exports = Heap