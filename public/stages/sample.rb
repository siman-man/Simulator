WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 31, y: 17 )
		t.add_data( eid: 1, name: 'end', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:user) do |t| 
		t.pos( x: 30, y: 6 )
		t.add_data( eid: 2, name: 'node1', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 6, x: 30, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 20, y: 5 )
		t.add_data( eid: 3, name: 'node2', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 5, x: 20, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 4, y: 23 )
		t.add_data( eid: 4, name: 'node3', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 23, x: 4, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 28, y: 26 )
		t.add_data( eid: 5, name: 'node4', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 26, x: 28, wait: 0 })
		end
	end
end
