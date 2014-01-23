WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 13, y: 11 )
		t.add_data( eid: 0, name: 'start', speed: 0, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 84, y: 66 )
		t.add_data( eid: 1, name: 'end', speed: 0, move_model: 'StationaryMovement' )

	end
	create(:user) do |t| 
		t.pos( x: 93, y: 55 )
		t.add_data( eid: 2, name: 'node1', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 55, x: 93, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 76, y: 46 )
		t.add_data( eid: 3, name: 'node2', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 46, x: 76, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 60, y: 71 )
		t.add_data( eid: 4, name: 'node3', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 71, x: 60, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 46, y: 52 )
		t.add_data( eid: 5, name: 'node4', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 52, x: 46, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 30, y: 69 )
		t.add_data( eid: 6, name: 'node5', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 69, x: 30, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 9, y: 61 )
		t.add_data( eid: 7, name: 'node6', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 61, x: 9, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 14, y: 42 )
		t.add_data( eid: 8, name: 'node7', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 42, x: 14, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 6, y: 24 )
		t.add_data( eid: 9, name: 'node8', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 24, x: 6, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 37, y: 13 )
		t.add_data( eid: 10, name: 'node9', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 13, x: 37, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 56, y: 10 )
		t.add_data( eid: 11, name: 'node10', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 10, x: 56, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 60, y: 29 )
		t.add_data( eid: 12, name: 'node11', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 29, x: 60, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 32, y: 30 )
		t.add_data( eid: 13, name: 'node12', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 30, x: 32, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 89, y: 12 )
		t.add_data( eid: 14, name: 'node13', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 12, x: 89, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 74, y: 7 )
		t.add_data( eid: 15, name: 'node14', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 7, x: 74, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 90, y: 31 )
		t.add_data( eid: 16, name: 'node15', speed: 10, move_model: 'RandomWayPoint' )
		t.create_path do |route|
			route.add({ y: 31, x: 90, wait: 0 })
		end
	end
end
