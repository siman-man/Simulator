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
		t.pos( x: 31, y: 21 )
		t.add_data( eid: 2, name: 'node1', speed: 10 )
		t.create_path do |route|
			route.add({ y: 21, x: 31, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 13, y: 23 )
		t.add_data( eid: 3, name: 'node2', speed: 10 )
		t.create_path do |route|
			route.add({ y: 23, x: 13, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 15, y: 14 )
		t.add_data( eid: 4, name: 'node3', speed: 10 )
		t.create_path do |route|
			route.add({ y: 14, x: 15, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 11, y: 7 )
		t.add_data( eid: 5, name: 'node4', speed: 10 )
		t.create_path do |route|
			route.add({ y: 7, x: 11, wait: 0 })
		end
	end
end
