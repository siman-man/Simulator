WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 6 )
		t.add_data( eid: 0, name: 'start', speed: 0 )

	end
	create(:end) do |t| 
		t.pos( x: 36, y: 28 )
		t.add_data( eid: 1, name: 'end', speed: 0 )

	end
	create(:user) do |t| 
		t.pos( x: 31, y: 11 )
		t.add_data( eid: 2, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 11, x: 31, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 21, y: 11 )
		t.add_data( eid: 3, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 11, x: 21, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 12, y: 23 )
		t.add_data( eid: 4, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 23, x: 12, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 4, y: 27 )
		t.add_data( eid: 5, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 27, x: 4, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 17, y: 29 )
		t.add_data( eid: 6, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 29, x: 17, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 30, y: 22 )
		t.add_data( eid: 7, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 22, x: 30, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 15, y: 14 )
		t.add_data( eid: 8, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 14, x: 15, wait: 0 })
		end
	end
end
