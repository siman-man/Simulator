var Log = {
  queue: [],

	create: function(time, host, dest, req, size){
		$.ajax({
  		url: "/simulates",
 			data: {
    		time: time,
    		host: host,
    		dest: dest,
    		req:  req,
    		size: size
  		},
  	});
	},

  init: function( data ){
    this.queue.push(this.save(data));
    $.ajax({
      type: "post",
      url: "/logs",
      data: {data_list: this.queue},
    });
    this.queue = [];
  },

  send: function( data ){
    if( data.operation === 'transmit' ){
      Simulator.total_send_message_num++;
    }
    this.queue.push(this.save(data));
    if( this.queue.length >= 10){
      $.ajax({
        type: "post",
        url: "/logs",
        data: {data_list: this.queue},
      });
      this.queue = [];
    }
  },

  save: function(data){
    return {
      time: data.time,
      type: data.type,
      operation: data.operation,
      from: data.from,
      dest: data.dest,
      config: data.config,
      message: data.msg
    }
  },

  finish: function( data ){
    this.queue.push(this.save(data));
    $.ajax({
      type: "post",
      url: "/logs",
      data: {data_list: this.queue},
      success: function(obj){
        alert('Simulation Finish!');
        window.location = '/result';
      }
    });
  },
}