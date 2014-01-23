WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 0 )

	end
	create(:end) do |t| 
		t.pos( x: 36, y: 40 )
		t.add_data( eid: 1, name: 'end', speed: 0 )

	end
	create(:user) do |t| 
		t.pos( x: 44, y: 44 )
		t.add_data( eid: 2, name: 'node1', speed: 10 )
		t.create_path do |route|
			route.add({ y: 44, x: 44, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 24, y: 45 )
		t.add_data( eid: 3, name: 'node2', speed: 10 )
		t.create_path do |route|
			route.add({ y: 45, x: 24, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 6, y: 41 )
		t.add_data( eid: 4, name: 'node3', speed: 10 )
		t.create_path do |route|
			route.add({ y: 41, x: 6, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 18, y: 32 )
		t.add_data( eid: 5, name: 'node4', speed: 10 )
		t.create_path do |route|
			route.add({ y: 32, x: 18, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 10, y: 15 )
		t.add_data( eid: 6, name: 'node5', speed: 10 )
		t.create_path do |route|
			route.add({ y: 15, x: 10, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 25, y: 3 )
		t.add_data( eid: 7, name: 'node6', speed: 10 )
		t.create_path do |route|
			route.add({ y: 3, x: 25, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 33, y: 13 )
		t.add_data( eid: 8, name: 'node7', speed: 10 )
		t.create_path do |route|
			route.add({ y: 13, x: 33, wait: 0 })
		end
	end
end
