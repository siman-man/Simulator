/**
 * The control panel.
 */

var Panel = {

  drawClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },
};