/**
 * The control panel.
 */

var Panel = {

  radioClear: function(){
    console.log('clear radio')
    $("input:radio").attr("checked",false); 
  },
};