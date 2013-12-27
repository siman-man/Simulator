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
		t.pos( x: 48, y: 23 )
		t.add_data( eid: 2, name: 'none' )
		t.create_path do |route|
			route.add({ y: 23, x: 47, wait: 0 })
			route.add({ y: 23, x: 46, wait: 0 })
			route.add({ y: 23, x: 45, wait: 0 })
			route.add({ y: 23, x: 44, wait: 0 })
			route.add({ y: 23, x: 43, wait: 0 })
			route.add({ y: 23, x: 42, wait: 0 })
			route.add({ y: 23, x: 41, wait: 0 })
			route.add({ y: 23, x: 40, wait: 10 })
		end
	end
end
