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

		$("#send_num").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('send_num');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
        	page: 'send_data'
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

		$("#send_count").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('send_count');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
        	page: 'send_count'
      	},
    	});
		});

    $("#user_send_count").click(function(){
      createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
      console.log('user_send_count');
      $.ajax({
        type: "post",
        url: "/view_update",
        data: {
          page: 'user_send_count'
        },
      });
    });

    $("#user_receive_count").click(function(){
      createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
      console.log('user_receive_count');
      $.ajax({
        type: "post",
        url: "/view_update",
        data: {
          page: 'user_receive_count'
        },
      });
    });

    $("#latency").click(function(){
      createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
      console.log('latency');
      $.ajax({
        type: "post",
        url: "/view_update",
        data: {
          page: 'latency'
        },
      });
    });

    $("#hop_count").click(function(){
      createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
      console.log('hop_count');
      $.ajax({
        type: "post",
        url: "/view_update",
        data: {
          page: 'hop_count'
        },
      });
    });
	},
}