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
	end
end
