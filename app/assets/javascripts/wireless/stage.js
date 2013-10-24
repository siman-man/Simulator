var Stage = {
	initial: function(){
		Node.create( 10, 10, 'start');
    Node.create( 20, 10, 'end');
	},

	stage1: function(){
		Node.create( 10, 10, 'start');
    Node.create( 40, 15, 'end');

    Node.create( 5, 5, 'user', { type: 'normal' });
    Node.create( 20, 5, 'user', { type: 'normal' });
    Node.create( 10, 20, 'user', { type: 'normal' });
    Node.create( 10, 30, 'user', { type: 'normal' });
    Node.create( 40, 5, 'user', { type: 'normal' });
	}
}