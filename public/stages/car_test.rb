WebSimulator.define do
	create(:road){|t| t.pos( x: 12, y: 11 )}
	create(:road){|t| t.pos( x: 13, y: 11 )}
	create(:road){|t| t.pos( x: 14, y: 11 )}
	create(:road){|t| t.pos( x: 15, y: 11 )}
	create(:road){|t| t.pos( x: 16, y: 11 )}
	create(:road){|t| t.pos( x: 17, y: 11 )}
	create(:road){|t| t.pos( x: 18, y: 11 )}
	create(:road){|t| t.pos( x: 19, y: 11 )}
	create(:road){|t| t.pos( x: 20, y: 11 )}
	create(:road){|t| t.pos( x: 21, y: 11 )}
	create(:road){|t| t.pos( x: 22, y: 11 )}
	create(:road){|t| t.pos( x: 23, y: 11 )}
	create(:road){|t| t.pos( x: 24, y: 11 )}
	create(:road){|t| t.pos( x: 25, y: 11 )}
	create(:road){|t| t.pos( x: 26, y: 11 )}
	create(:road){|t| t.pos( x: 27, y: 11 )}
	create(:road){|t| t.pos( x: 28, y: 11 )}
	create(:road){|t| t.pos( x: 29, y: 11 )}
	create(:road){|t| t.pos( x: 30, y: 11 )}
	create(:road){|t| t.pos( x: 31, y: 11 )}
	create(:road){|t| t.pos( x: 32, y: 11 )}
	create(:road){|t| t.pos( x: 12, y: 12 )}
	create(:road){|t| t.pos( x: 32, y: 12 )}
	create(:road){|t| t.pos( x: 12, y: 13 )}
	create(:road){|t| t.pos( x: 32, y: 13 )}
	create(:road){|t| t.pos( x: 12, y: 14 )}
	create(:road){|t| t.pos( x: 32, y: 14 )}
	create(:road){|t| t.pos( x: 12, y: 15 )}
	create(:road){|t| t.pos( x: 32, y: 15 )}
	create(:road){|t| t.pos( x: 12, y: 16 )}
	create(:road){|t| t.pos( x: 32, y: 16 )}
	create(:road){|t| t.pos( x: 12, y: 17 )}
	create(:road){|t| t.pos( x: 32, y: 17 )}
	create(:road){|t| t.pos( x: 12, y: 18 )}
	create(:road){|t| t.pos( x: 32, y: 18 )}
	create(:road){|t| t.pos( x: 12, y: 19 )}
	create(:road){|t| t.pos( x: 32, y: 19 )}
	create(:road){|t| t.pos( x: 12, y: 20 )}
	create(:road){|t| t.pos( x: 13, y: 20 )}
	create(:road){|t| t.pos( x: 14, y: 20 )}
	create(:road){|t| t.pos( x: 15, y: 20 )}
	create(:road){|t| t.pos( x: 16, y: 20 )}
	create(:road){|t| t.pos( x: 17, y: 20 )}
	create(:road){|t| t.pos( x: 18, y: 20 )}
	create(:road){|t| t.pos( x: 19, y: 20 )}
	create(:road){|t| t.pos( x: 20, y: 20 )}
	create(:road){|t| t.pos( x: 21, y: 20 )}
	create(:road){|t| t.pos( x: 22, y: 20 )}
	create(:road){|t| t.pos( x: 23, y: 20 )}
	create(:road){|t| t.pos( x: 24, y: 20 )}
	create(:road){|t| t.pos( x: 25, y: 20 )}
	create(:road){|t| t.pos( x: 26, y: 20 )}
	create(:road){|t| t.pos( x: 27, y: 20 )}
	create(:road){|t| t.pos( x: 28, y: 20 )}
	create(:road){|t| t.pos( x: 29, y: 20 )}
	create(:road){|t| t.pos( x: 30, y: 20 )}
	create(:road){|t| t.pos( x: 31, y: 20 )}
	create(:road){|t| t.pos( x: 32, y: 20 )}
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start' )

	end
	create(:end) do |t| 
		t.pos( x: 34, y: 20 )
		t.add_data( eid: 1, name: 'end' )

	end
	create(:car){|t| t.pos( x: 19, y: 11 )}
end
