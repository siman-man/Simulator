/**
 * The control panel.
 */

var Panel = {
	init: function(){
		$('.panel').draggable();
		$('.accordion').accordion({
			collapsible: true,
			heightStyle: "fill",
		});

		$("#node_info").change(function(){
			if( $("#node_info").is(":checked") ){
				$("#node_status").show();
			}else{
				$("#node_status").hide();
			}
		});

		$("#user_name").change(function(){
			var eid = $("#user_eid").val(),
					name = $("#user_name").val();
			console.log(Node.node_list[eid]);
			if( name.length > 0 ){
				Node.node_list[eid].name = name;
			}
		}); 
		
		$("#stage_type").change(function(){		
			console.log($("#stage_type option:selected").text());
			$.ajax({
				type: "post",
  			url: "/stage_init",
 				data: {
    			stage_type: $("#stage_type option:selected").text()
  			},
  		});
		});

		$("#stage_write").click(function(){
			console.log('hello');
			$("#node_num").val(Object.keys(Node.node_list).length);
			$("#field_data").val(Config.output())
			//Config.output();
		});

		$('.option_label').click(function() {
			$(this).prev().click();
		});

		$('#button2').attr('disabled', 'disabled');

		$('#button1').click(function(){
			if(Simulator.state.current === 'init'){
				$('#button1').attr('disabled', 'disabled');
				$("#button2").removeAttr('disabled');
				$('#button3').attr('disabled', 'disabled');
				Simulator.state.start();
			}
		});

		$('#button2').click(function(){
			if(Simulator.state.current === 'run'){
				$("#button3").removeAttr('disabled');
				$('#button2').text('再開');
				Simulator.state.pause();
			}else if(Simulator.state.current === 'stop'){
				$('#button3').attr('disabled', 'disabled');
				$('#button2').text('停止');
				Simulator.state.restart();
			}
		});

		$('#button3').click(function(){
			if(Simulator.state.current !== 'run'){
				$('#button2').attr('disabled', 'disabled');
				$('#button2').text('停止');
				$("#button1").removeAttr('disabled');
				$("span#time").html("0");
				Simulator.clear();
			}
		});

		$('#file-input').change(function() {
      $('#cover').html($(this).val());
  	});
	},

  radioClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },

  updateNodeData: function( obj ){
  	$("#user_eid").val(obj.eid);
  	$("#user_name").val(obj.name);
  },
};