var PriorityQueue = function() {
  this.heap = []; 
  this.pointer = 0;
};
 
PriorityQueue.prototype = {
  push : function( data ) {
    var point, index;
    index = this.pointer++;
    while (index > 0) {
      
      point = Math.floor((index - 1) / 2);

      if (this.heap[point].cost <= data.cost ) break;
      this.heap[index] = this.heap[point];
      index = point;
    }
    this.heap[index] = data;
  },
  
  pop : function() {
    var ret = this.heap[0],
        x = this.heap[--this.pointer],
        index = 0, a, b;

    while (index * 2 + 1 < this.pointer) {
      a = index * 2 + 1; 
      b = index * 2 + 2; 
      if (b < this.pointer && this.heap[b].cost < this.heap[a].cost) a = b;

      if (this.heap[a].cost >= x.cost) break;
      this.heap[index] = this.heap[a];
      index = a;
    }
    this.heap[index] = x;
    
    this.heap.pop();
    return ret;
  },
  
  size : function() {
    return this.heap.length;
  }
};