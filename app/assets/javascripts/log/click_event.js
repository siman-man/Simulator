var ClickEvent = {
	init: function(){
		$("#receive_num").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('receive_num');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
        	page: 'receive_data'
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