var PriorityQueue = function(){
  this.heap=[]; 
  this.pointer=0;
};
 
PriorityQueue.prototype = {
  push: function(data){
    var p, i;
    i = this.pointer++;
    while (i>0){
      p=Math.floor((i-1)/2);
      if(this.heap[p].cost<=data.cost)break;
      this.heap[i]=this.heap[p];
      i=p;
    }
    this.heap[i] = data;
  },
  
  pop: function(){
    var ret=this.heap[0],
        x=this.heap[--this.pointer],
        i=0,a,b;

    while (i*2+1<this.pointer) {
      a=i*2+1; 
      b=i*2+2; 
      if(b<this.pointer && this.heap[b].cost<this.heap[a].cost) a=b;
      if(this.heap[a].cost>=x.cost)break;
      this.heap[i]=this.heap[a];
      i=a;
    }
    this.heap[i]=x;
    this.heap.pop();
    return ret;
  },
  
  size: function(){
    return this.heap.length;
  }
};