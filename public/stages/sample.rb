WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 78, y: 49 )
		t.add_data( eid: 1, name: 'end', speed: 10, move_model: 'StationaryMovement' )

	end
	create(:user) do |t| 
		t.pos( x: 32, y: 66 )
		t.add_data( eid: 2, name: 'node1', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 66, x: 32, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 75, y: 64 )
		t.add_data( eid: 3, name: 'node2', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 64, x: 75, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 52, y: 48 )
		t.add_data( eid: 4, name: 'node3', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 48, x: 52, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 15, y: 55 )
		t.add_data( eid: 5, name: 'node4', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 55, x: 15, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 18, y: 26 )
		t.add_data( eid: 6, name: 'node5', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 26, x: 18, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 30, y: 38 )
		t.add_data( eid: 7, name: 'node6', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 38, x: 30, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 46, y: 14 )
		t.add_data( eid: 8, name: 'node7', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 14, x: 46, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 31, y: 10 )
		t.add_data( eid: 9, name: 'node8', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 10, x: 31, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 63, y: 33 )
		t.add_data( eid: 10, name: 'node9', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 33, x: 63, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 84, y: 14 )
		t.add_data( eid: 11, name: 'node10', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 14, x: 84, wait: 0 })
		end
	end
end
