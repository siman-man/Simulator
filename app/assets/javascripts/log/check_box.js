var CheckBox = {
	filter: [],

	create_list: function( user_list ){
		$.each( user_list, function( index, node ) {
  		$("#checkbox_field").append("<label class='checkbox-inline'>\n"
  			+ "<input type='checkbox' name='node' value='"+node.name+"' checked>" + node.name + 
  		 "</label>\n");
		});
	},

	setEvent: function(){
		$("#checkbox_field").change(function(){
			CheckBox.filterUpdate();
			$("#line_chart").empty();
			LineChart.multi();
		});
	},

	filterUpdate: function(){
		var filter = [];
		console.log('filter update=>');
		$('[name="node"]:checked').each(function(){
  		filter.push($(this).val());
		});
		console.log(filter);
		CheckBox.filter = filter;
	},
}