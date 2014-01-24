WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 23, y: 11 )
		t.add_data( eid: 1, name: 'end', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:user) do |t| 
		t.pos( x: 26, y: 5 )
		t.add_data( eid: 2, name: 'node1', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 5, x: 26, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 13, y: 18 )
		t.add_data( eid: 3, name: 'node2', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 18, x: 13, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 23, y: 21 )
		t.add_data( eid: 4, name: 'node3', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 21, x: 23, wait: 0 })
		end
	end
end
