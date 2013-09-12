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
	},

  radioClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },
};