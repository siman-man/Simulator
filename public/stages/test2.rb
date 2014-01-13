WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start' )

	end
	create(:end) do |t| 
		t.pos( x: 90, y: 90 )
		t.add_data( eid: 1, name: 'end' )

	end
	create(:user) do |t| 
		t.pos( x: 33, y: 16 )
		t.add_data( eid: 2, name: 'none' )
		t.create_path do |route|
			route.add({ y: 16, x: 33, wait: 0 })
			route.add({ y: 15, x: 33, wait: 0 })
			route.add({ y: 14, x: 33, wait: 0 })
			route.add({ y: 13, x: 33, wait: 0 })
			route.add({ y: 12, x: 33, wait: 0 })
			route.add({ y: 11, x: 33, wait: 0 })
			route.add({ y: 11, x: 34, wait: 0 })
			route.add({ y: 11, x: 35, wait: 0 })
			route.add({ y: 11, x: 36, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 39, y: 10 )
		t.add_data( eid: 3, name: 'none' )
		t.create_path do |route|
			route.add({ y: 10, x: 39, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 50, y: 91 )
		t.add_data( eid: 4, name: 'none' )
		t.create_path do |route|
			route.add({ y: 91, x: 50, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 60, y: 74 )
		t.add_data( eid: 5, name: 'none' )
		t.create_path do |route|
			route.add({ y: 74, x: 60, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 14, y: 91 )
		t.add_data( eid: 6, name: 'none' )
		t.create_path do |route|
			route.add({ y: 91, x: 14, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 14, y: 60 )
		t.add_data( eid: 7, name: 'none' )
		t.create_path do |route|
			route.add({ y: 60, x: 14, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 28, y: 48 )
		t.add_data( eid: 8, name: 'none' )
		t.create_path do |route|
			route.add({ y: 48, x: 28, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 69, y: 42 )
		t.add_data( eid: 9, name: 'none' )
		t.create_path do |route|
			route.add({ y: 42, x: 69, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 71, y: 29 )
		t.add_data( eid: 10, name: 'none' )
		t.create_path do |route|
			route.add({ y: 29, x: 71, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 49, y: 31 )
		t.add_data( eid: 11, name: 'none' )
		t.create_path do |route|
			route.add({ y: 31, x: 49, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 86, y: 79 )
		t.add_data( eid: 12, name: 'none' )
		t.create_path do |route|
			route.add({ y: 79, x: 86, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 47, y: 54 )
		t.add_data( eid: 13, name: 'none' )
		t.create_path do |route|
			route.add({ y: 54, x: 47, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 86, y: 55 )
		t.add_data( eid: 14, name: 'none' )
		t.create_path do |route|
			route.add({ y: 55, x: 86, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 62, y: 16 )
		t.add_data( eid: 15, name: 'none' )
		t.create_path do |route|
			route.add({ y: 16, x: 62, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 76, y: 15 )
		t.add_data( eid: 16, name: 'none' )
		t.create_path do |route|
			route.add({ y: 15, x: 76, wait: 0 })
		end
	end
end
