var Log = {
  queue: [],
  limit_size: 30,

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
      data: {
        key: Simulator.user_id,
        data_list: this.queue
      },
    });
    this.queue = [];
  },

  send: function( data ){
    if( data.operation === 'transmit' ){
      Simulator.total_send_message_num++;
    }
    this.queue.push(this.save(data));
    if( this.queue.length >= Log.limit_size){
      $.ajax({
        type: "post",
        url: "/logs",
        data: {
          key: Simulator.user_id,
          data_list: this.queue
        },
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
      data: {
        key: Simulator.user_id,
        data_list: this.queue
      },
      success: function(obj){
        alert('Simulation Finish!');
        window.location = '/history';
        //window.location = '/result' + '?key=' + Simulator.user_id;
      }
    });
  },

  transmit_message: function( from, dest, data ){
    return message = {
      time: Simulator.time,
      type: 'normal',
      operation: 'transmit',
      from: from.eid,
      dest: dest.eid,
      created_at: data.created_at
    };
  },
}