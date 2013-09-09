var Log = {
	create: function(time, host, dest, req, size){
		$.ajax({
  		url: "/",
 			data: {
    		time: time,
    		host: host,
    		dest: dest,
    		req:  req,
    		size: size
  		},
  	});
	},
}