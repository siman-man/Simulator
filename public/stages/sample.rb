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
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 2, name: 'A' )
	end

	create(:user) do |t| 
		t.pos( x: 20, y: 20 )
		t.add_data( eid: 3, name: 'B' )
	end

	create(:user) do |t| 
		t.pos( x: 30, y: 30 )
		t.add_data( eid: 4, name: 'C' )
	end

	create(:user) do |t| 
		t.pos( x: 40, y: 40 )
		t.add_data( eid: 5, name: 'D' )
	end

	create(:user) do |t| 
		t.pos( x: 40, y: 40 )
		t.add_data( eid: 6, name: 'E' )
	end

	create(:user) do |t| 
		t.pos( x: 50, y: 50 )
		t.add_data( eid: 7, name: 'F' )
	end

	create(:user) do |t| 
		t.pos( x: 60, y: 60 )
		t.add_data( eid: 8, name: 'A' )
	end

	create(:user) do |t| 
		t.pos( x: 70, y: 70 )
		t.add_data( eid: 9, name: 'A' )
	end

	create(:user) do |t| 
		t.pos( x: 80, y: 80 )
		t.add_data( eid: 10, name: 'A' )
	end
end
