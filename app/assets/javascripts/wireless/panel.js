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

		this.lifeTimeChanged();
		this.apperTimeChanged();
		this.moveModelChanged();
		this.fieldWidthChanged();
		this.fieldHeightChanged();
		this.gridSizeChanged();

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

		this.userNameChanged();
		
		this.stageTypeChanged();

		$("#stage_write").click(function(){
			console.log('hello');
			$("#node_num").val(Object.keys(Node.node_list).length);
			$("#field_data").val(Config.output())
			//Config.output();
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

	userSpeedController: function(){
		this.select = $( "#minbeds" );
   	this.slider = $( "<div id='slider'></div>" ).insertAfter( this.select ).slider({
      min: 1,
      max: 15,
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
  	var eid = $("#user_eid").val() || -1;
  	if( eid !== obj.eid ){ 
  		Simulator.route_user = Node.node_list[obj.eid];
  		$("#create_route").attr("checked",false);
  		$("#user_eid").val(obj.eid);
  		$("#user_name").val(obj.name);
  		$("#move_model").val(Panel.model2value(obj.move_model_type));
  		$("#life_time").val(obj.life_time || 'undefined');
  		$("#apper_time").val(obj.apper_time || 0 );
  		Panel.select[0].selectedIndex = Simulator.route_user.speed-1;
  		Panel.slider.slider( "value", Simulator.route_user.speed );
		}
  },

  moveModelChanged: function(){
		$("#move_model").change(function(){
			Panel.updateNodeMoveModel( $("#user_eid").val()|0, $("#move_model").val()|0);
		});
  },

  stageTypeChanged: function(){
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
  },

  updateNodeMoveModel: function( eid, type ){
  	if( eid <= 1 ) return;
  	var user = Node.node_list[eid];
  	Node.directMoveModel( user, type );
  },

  userNameChanged: function(){
		$("#user_name").change(function(){
			var eid = $("#user_eid").val(),
					name = $("#user_name").val();
			console.log(Node.node_list[eid]);
			if( name.length > 0 ){
				Node.node_list[eid].name = name;
			}
		}); 
  },

  lifeTimeChanged: function(){
		$("#life_time").change(function(){
			var eid = $("#user_eid").val(),
					life_time = +$("#life_time").val();
			if( eid.length > 0 ){
				Node.node_list[eid].life_time = life_time;
			}
		}); 
  },

  apperTimeChanged: function(){
		$("#apper_time").change(function(){
			var eid = $("#user_eid").val(),
					life_time = +$("#apper_time").val();
			if( eid.length > 0 ){
				Node.node_list[eid].apper_time = apper_time;
			}
		}); 
  },

  fieldWidthChanged: function(){
  	$("#field_width").change(function(){
  		$("#canvas_field").empty();
  		var width = +$("#field_width").val() * View.gridSize,
  				height = +$("#field_height").val() * View.gridSize;
  		console.log('width =>', width);
  		var str = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
  		$("#canvas_field").append(str);
  		var obj_list = Config.field2obj_list();
  		console.log('obj_list =>', obj_list);
  		Simulator.clear(true);
  		Simulator.getCanvasInfo();
  		View.init();
  		View.drawGrid()
  		Propagation.init();
  		Simulator.init();
  		Init.addMouseEvent();
  		$.each( obj_list, function( index, obj ) {
  			switch(obj.type){
  				case 'wall':
  					break;
  				default:
  					Node.create( obj.x, obj.y, obj.opt );
  					break;
  			}
  		});
  	});
  },

  fieldHeightChanged: function(){
  	$("#grid_size").change(function(){
  		$("#canvas_field").empty();
  		var obj_list = Config.field2obj_list();
  		gridSize = +$("#grid_size").val();
  		View.gridSize = gridSize;
  		var width = +$("#field_width").val() * View.gridSize,
  				height = +$("#field_height").val() * View.gridSize;
  		console.log('width =>', width, 'height =>', height);
  		var str = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
  		$("#canvas_field").append(str);
  		console.log('obj_list =>', obj_list);
  		Simulator.clear(true);
  		Simulator.getCanvasInfo();
  		View.init();
  		View.drawGrid()
  		Propagation.init();
  		Simulator.init();
  		Init.addMouseEvent();
  		$.each( obj_list, function( index, obj ) {
  			switch(obj.type){
  				case 'wall':
  					break;
  				default:
  					Node.create( obj.x, obj.y, obj.opt );
  					break;
  			}
  		});
  	});
  },

  gridSizeChanged: function(){
  	$("#field_height").change(function(){
  		$("#canvas_field").empty();
  		var width = +$("#field_width").val() * View.gridSize,
  				height = +$("#field_height").val() * View.gridSize;
  		console.log('width =>', width, 'height =>', height);
  		var str = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
  		$("#canvas_field").append(str);
  		var obj_list = Config.field2obj_list();
  		console.log('obj_list =>', obj_list);
  		Simulator.clear(true);
  		Simulator.getCanvasInfo();
  		View.init();
  		View.drawGrid()
  		Propagation.init();
  		Simulator.init();
  		Init.addMouseEvent();
  		$.each( obj_list, function( index, obj ) {
  			switch(obj.type){
  				case 'wall':
  					break;
  				default:
  					Node.create( obj.x, obj.y, obj.opt );
  					break;
  			}
  		});
  	});
  },

  model2value: function( move_model ){
  	console.log("move model => ", move_model);
  	switch(move_model){
  		case 'RandomWayPoint':
  			return 0;
  			break;
  		case 'MapRouteMovement':
  			return 1;
  			break;
  		case 'RandomWalk':
  			return 2;
  			break;
  		case 'StationaryMovement':
  			return 3;
  			break;
  		case 'CarMovement':
  			return 4;
  			break;
  	}
  },
};