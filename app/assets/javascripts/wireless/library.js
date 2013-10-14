var Library = {
  sample: function(array, num){
    
    if(array.length === 0) return [];

    var new_array = [],
        check_list = {},
        size = array.length,
        i, index;

    for( i = 0; i < num; i++){
      index = Math.random() * size | 0;
      while(check_list[index] !== undefined){
        index = Math.random() * size | 0;
      }
      new_array.push(array[index]);
      check_list[index] = true;
    }

    return new_array;
  },
};
