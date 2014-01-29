WBSD::Simulator.define do
	field_width 21

	create(:start) do |t| 
		t.position( x: 10, y: 10 )
		t.add_data( 
			eid: 0, 
			name: 'start', 
			speed: 10, 
			move_model: 'function',
			life_time: '-1',
			apper_time: '0'  
		)

	end
	create(:end) do |t| 
		t.position( x: 20, y: 10 )
		t.add_data( 
			eid: 1, 
			name: 'end', 
			speed: 10, 
			move_model: 'function',
			life_time: '-1',
			apper_time: '0'  
		)

	end
	create(:user) do |t| 
		t.position( x: 19, y: 6 )
		t.add_data( 
			eid: 2, 
			name: 'node1', 
			speed: 10, 
			move_model: 'RandomWalk',
			life_time: '-1',
			apper_time: '0'  
		)
	end
end
