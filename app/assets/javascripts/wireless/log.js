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
    $.ajax({
      type: "post",
      url: "/logs",
      data: {
        time: data.time,
        type: data.type,
        operation: data.operation,
        from: data.from,
        dest: data.dest,
        message: data.msg
      },
    });
  }
}