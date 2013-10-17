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


  send: function(time, type, msg){
    $.ajax({
      type: "post",
      url: "/logs",
      data: {
        time: time,
        type: type,
        message: msg
      },
    });
  }
}