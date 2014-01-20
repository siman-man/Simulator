WebSimulator.define do
	create(:start) do |t| 
		t.pos( x: 6, y: 6 )
		t.add_data( eid: 0, name: 'start', speed: 0 )

	end
	create(:end) do |t| 
		t.pos( x: 25, y: 6 )
		t.add_data( eid: 1, name: 'end', speed: 0 )

	end
	create(:user) do |t| 
		t.pos( x: 23, y: 13 )
		t.add_data( eid: 2, name: 'none', speed: 5 )
		t.create_path do |route|
			route.add({ y: 13, x: 23, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 7, y: 16 )
		t.add_data( eid: 3, name: 'none', speed: 10 )
		t.create_path do |route|
			route.add({ y: 16, x: 7, wait: 0 })
		end
	end
end
