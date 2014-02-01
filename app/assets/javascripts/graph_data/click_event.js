var ClickEvent = {
	init: function(){
    $("#epidemic_send_count").click(function(){
      console.log('epidemic_send_count =>');
      $.ajax({
        type: "post",
        url: "/graph_update",
        data: {
          page: 'epidemic_send_count'
        },
      });
    });

		$("#heat_map").click(function(){
			console.log('heat_map =>');
			$.ajax({
      	type: "post",
      	url: "/graph_update",
      	data: {
        	page: 'heat_map'
      	},
    	});
		});
	},
}