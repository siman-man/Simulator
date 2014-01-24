WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 28, y: 22 )
		t.add_data( eid: 1, name: 'end', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:user) do |t| 
		t.pos( x: 35, y: 28 )
		t.add_data( eid: 2, name: 'node1', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 28, x: 35, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 32, y: 8 )
		t.add_data( eid: 3, name: 'node2', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 8, x: 32, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 19, y: 14 )
		t.add_data( eid: 4, name: 'runner', speed: 5, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 14, x: 19, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 10, y: 34 )
		t.add_data( eid: 5, name: 'node4', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 34, x: 10, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 6, y: 20 )
		t.add_data( eid: 6, name: 'node5', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 20, x: 6, wait: 0 })
		end
	end
end
