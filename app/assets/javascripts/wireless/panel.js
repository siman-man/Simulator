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

		$('.option_label').click(function() {
			$(this).prev().click();
		});

		$('#config').change(function() {
			File.read(this.files);
		});
		$('#button2').attr('disabled', 'disabled');
		$('#button3').attr('disabled', 'disabled');

		$('#button1').click(function(){
			if(Simulator.state.current == 'init'){
				$('#button1').attr('disabled', 'disabled');
				$("#button2").removeAttr('disabled');
				$('#button3').attr('disabled', 'disabled');
				Simulator.state.start();
			}
		});

		$('#button2').click(function(){
			if(Simulator.state.current == 'run'){
				$("#button3").removeAttr('disabled');
				$('#button2').text('再開');
				Simulator.state.pause();
			}else if(Simulator.state.current == 'stop'){
				$('#button3').attr('disabled', 'disabled');
				$('#button2').text('停止');
				Simulator.state.restart();
			}
		});

		$('#button3').click(function(){
			if(Simulator.state.current != 'run'){
				$("#button1").removeAttr('disabled');
				$('#button2').attr('disabled', 'disabled');
				Simulator.clear();
			}
		});
	},

  radioClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },
};