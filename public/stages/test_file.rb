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
		t.pos( x: 30, y: 20 )
		t.add_data( eid: 2, name: 'none' )
		t.create_path do |route|
			route.add({ y: 20, x: 30, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 8, y: 25 )
		t.add_data( eid: 3, name: 'none' )
		t.create_path do |route|
			route.add({ y: 25, x: 8, wait: 0 })
		end
	end
end
