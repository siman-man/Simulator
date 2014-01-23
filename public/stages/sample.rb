WebSimulator.define do
	create(:road){|t| t.pos( x: 12, y: 7 )}
	create(:road){|t| t.pos( x: 13, y: 7 )}
	create(:road){|t| t.pos( x: 14, y: 7 )}
	create(:road){|t| t.pos( x: 15, y: 7 )}
	create(:road){|t| t.pos( x: 16, y: 7 )}
	create(:road){|t| t.pos( x: 17, y: 7 )}
	create(:road){|t| t.pos( x: 18, y: 7 )}
	create(:road){|t| t.pos( x: 19, y: 7 )}
	create(:road){|t| t.pos( x: 20, y: 7 )}
	create(:road){|t| t.pos( x: 21, y: 7 )}
	create(:road){|t| t.pos( x: 22, y: 7 )}
	create(:road){|t| t.pos( x: 23, y: 7 )}
	create(:road){|t| t.pos( x: 24, y: 7 )}
	create(:road){|t| t.pos( x: 25, y: 7 )}
	create(:road){|t| t.pos( x: 26, y: 7 )}
	create(:start) do |t| 
		t.pos( x: 10, y: 10 )
		t.add_data( eid: 0, name: 'start', speed: 0, move_model: 'StationaryMovement' )

	end
	create(:end) do |t| 
		t.pos( x: 20, y: 10 )
		t.add_data( eid: 1, name: 'end', speed: 0, move_model: 'StationaryMovement' )

	end
	create(:car) do |t| 
		t.pos( x: 13, y: 7 )
		t.add_data( eid: 2, name: 'node1', speed: 0, move_model: 'CarMovement' )

	end
end
