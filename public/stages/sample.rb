WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 0 )

	end
	create(:end) do |t| 
		t.pos( x: 20, y: 10 )
		t.add_data( eid: 1, name: 'end', speed: 0 )

	end
	create(:user) do |t| 
		t.pos( x: 23, y: 6 )
		t.add_data( eid: 2, name: 'node1', speed: 10 )
		t.create_path do |route|
			route.add({ y: 6, x: 23, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 15, y: 3 )
		t.add_data( eid: 3, name: 'node2', speed: 10 )
		t.create_path do |route|
			route.add({ y: 3, x: 15, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 11, y: 18 )
		t.add_data( eid: 4, name: 'node3', speed: 10 )
		t.create_path do |route|
			route.add({ y: 18, x: 11, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 5, y: 15 )
		t.add_data( eid: 5, name: 'node4', speed: 10 )
		t.create_path do |route|
			route.add({ y: 15, x: 5, wait: 0 })
		end
	end
end
