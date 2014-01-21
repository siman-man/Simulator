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
		t.pos( x: 32, y: 11 )
		t.add_data( eid: 2, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 11, x: 32, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 23, y: 7 )
		t.add_data( eid: 3, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 7, x: 23, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 13, y: 6 )
		t.add_data( eid: 4, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 6, x: 13, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 15, y: 15 )
		t.add_data( eid: 5, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 15, x: 15, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 6, y: 15 )
		t.add_data( eid: 6, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 15, x: 6, wait: 0 })
		end
	end
end
