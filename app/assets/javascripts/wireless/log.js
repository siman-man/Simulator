var Log = {
	create: function(time, host, dest, req, size){
		var log = 'hello';
		
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

		$("textarea#log").append(log);
	},
}