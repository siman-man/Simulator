WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start' )

	end
	create(:end) do |t| 
		t.pos( x: 20, y: 10 )
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
end
