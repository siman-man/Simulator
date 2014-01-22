var ClickEvent = {
	init: function(){
		$("#recieve_num").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('recieve_num');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
        	page: 'recieve_data'
      	},
    	});
		});

		$("#connection_network").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('connection');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
        	page: 'connection_network'
      	},
    	});
		});
	},
}