var ClickEvent = {
  sendEvent: function(name){
    createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
    console.log(name);
    $.ajax({
      type: "post",
      url: "/view_update",
      data: {
        id: DataList.view_id,
        page: name
      },
    });
  },

	init: function(){
		$("#receive_num").click(function(){
			ClickEvent.sendEvent("receive_num");
		});

		$("#send_num").click(function(){
			ClickEvent.sendEvent("send_num");
		});

		$("#connection_network").click(function(){
			createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
			console.log('connection');
			$.ajax({
      	type: "post",
      	url: "/view_update",
      	data: {
          id: DataList.view_id,
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
          id: DataList.view_id,
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
          id: DataList.view_id,
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
          id: DataList.view_id,
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
          id: DataList.view_id,
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
          id: DataList.view_id,
          page: 'hop_count'
        },
      });
    });

    $("#heat_map").click(function(){
      createjs.Ticker.removeEventListener(DataList.event_tag,DataList.event_func);
      console.log('heat_map');
      $.ajax({
        type: "post",
        url: "/view_update",
        data: {
          id: DataList.view_id,
          page: 'heat_map'
        },
      });
    });

    $("#user_heat_map").click(function(){
      ClickEvent.sendEvent("user_heat_map");
    });
	},
}