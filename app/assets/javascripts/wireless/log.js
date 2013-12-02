var Log = {
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

  send: function( data ){
    if( data.operation === 'transmit' ){
      Simulator.total_send_message_num++;
    }
    $.ajax({
      type: "post",
      url: "/logs",
      data: {
        time: data.time,
        type: data.type,
        operation: data.operation,
        from: data.from,
        dest: data.dest,
        config: data.config,
        message: data.msg
      },
    });
  }
}