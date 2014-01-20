/**
 * The control panel.
 */

var Panel = {
	speed_select: undefined,
	speed_slider: undefined,

	init: function(){
		$('.panel').draggable();
		$('.accordion').accordion({
			collapsible: true,
			heightStyle: "fill",
		});

		this.userSpeedController();

		$("#node_info").change(function(){
			if( $("#node_info").is(":checked") ){
				$("#node_status").show();
			}else{
				$("#node_status").hide();
			}
		});

		$("#move_model").change(function(){
			Panel.updateNodeMoveModel( $("#user_eid").val()|0, $("#move_model").val()|0);
		});

		$("#wait_time").change(function(){
			if( View.selected_cell !== undefined ){
				console.log("text change =>");
				var id = View.selected_cell.path_id,
						wait_time = $("#wait_time").val()|0;
				View.selected_cell.obj.label.text = wait_time;
				Simulator.route_user.path[id].wait = wait_time;
			}
		});

		$("#draw_object").change(function(){
			$("#create_route").attr("checked",false); 
		});

		$("#create_route").change(function(){
			$("input:radio").attr("checked",false);
			if($("#create_route").is(":checked") && $("#user_eid").val().length !== 0 ){
        Simulator.route_user = Node.node_list[$("#user_eid").val()|0];
        View.route_view( Simulator.route_user.path );
      } 
      if(!$("#create_route").is(":checked")){
      	View.clear_route();
      }
		});

		$("#message_num").change(function(){
			Node.node_list[0].label.text = $("#message_num").val()|0;
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

		$('#redraw').click(function(){
			//gridSize = 20;
			//View.clearGrid();
			//View.drawGrid();
			//$("#canvas").remove();
			//$("#canvas_field").append('<canvas id=\'canvas\' width="1000" height="1000"></canvas>');
		});

		$('#file-input').change(function() {
      $('#cover').html($(this).val());
  	});
	},

	userSpeedController: function(){
		this.select = $( "#minbeds" );
   	this.slider = $( "<div id='slider'></div>" ).insertAfter( this.select ).slider({
      min: 1,
      max: 10,
      range: "min",
      value: this.select[0].selectedIndex + 1,
      slide: function( event, ui ) {
      	var eid = $("#user_eid").val();
      	Node.changeSpeed( eid, ui.value );
        Panel.select[0].selectedIndex = ui.value-1;
      }
    });
    $( "#minbeds" ).change(function(){
    	var eid = $("#user_eid").val();
    	Node.changeSpeed( eid, Panel.selectedIndex+1 );
      Panel.slider.slider( "value", Panel.selectedIndex+1 );
    });
	},

  radioClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },

  updateNodeData: function( obj ){
  	var eid = $("#user_eid").val();
  	if( eid != obj.eid ){ 
  		Simulator.route_user = Node.node_list[obj.eid];
  		$("#create_route").attr("checked",false);
  		$("#user_eid").val(obj.eid);
  		$("#user_name").val(obj.name);
  		Panel.select[0].selectedIndex = Simulator.route_user.speed-1;
  		Panel.slider.slider( "value", Simulator.route_user.speed );
		}
  },

  updateNodeMoveModel: function( eid, type ){
  	if( eid <= 1 ) return;
  	var user = Node.node_list[eid];
  	Node.direct_move_model( user, type );
  },
};