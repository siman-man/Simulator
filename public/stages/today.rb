WebSimulator.define do
	create(:road){|t| t.pos( x: 15, y: 4 )}
	create(:road){|t| t.pos( x: 16, y: 4 )}
	create(:road){|t| t.pos( x: 17, y: 4 )}
	create(:road){|t| t.pos( x: 18, y: 4 )}
	create(:road){|t| t.pos( x: 19, y: 4 )}
	create(:road){|t| t.pos( x: 20, y: 4 )}
	create(:road){|t| t.pos( x: 21, y: 4 )}
	create(:road){|t| t.pos( x: 22, y: 4 )}
	create(:road){|t| t.pos( x: 23, y: 4 )}
	create(:road){|t| t.pos( x: 24, y: 4 )}
	create(:road){|t| t.pos( x: 25, y: 4 )}
	create(:road){|t| t.pos( x: 26, y: 4 )}
	create(:road){|t| t.pos( x: 27, y: 4 )}
	create(:road){|t| t.pos( x: 28, y: 4 )}
	create(:road){|t| t.pos( x: 29, y: 4 )}
	create(:road){|t| t.pos( x: 30, y: 4 )}
	create(:road){|t| t.pos( x: 15, y: 5 )}
	create(:road){|t| t.pos( x: 26, y: 5 )}
	create(:road){|t| t.pos( x: 30, y: 5 )}
	create(:road){|t| t.pos( x: 15, y: 6 )}
	create(:road){|t| t.pos( x: 30, y: 6 )}
	create(:road){|t| t.pos( x: 15, y: 7 )}
	create(:road){|t| t.pos( x: 30, y: 7 )}
	create(:road){|t| t.pos( x: 15, y: 8 )}
	create(:road){|t| t.pos( x: 30, y: 8 )}
	create(:road){|t| t.pos( x: 15, y: 9 )}
	create(:road){|t| t.pos( x: 30, y: 9 )}
	create(:road){|t| t.pos( x: 15, y: 10 )}
	create(:road){|t| t.pos( x: 30, y: 10 )}
	create(:road){|t| t.pos( x: 15, y: 11 )}
	create(:road){|t| t.pos( x: 30, y: 11 )}
	create(:road){|t| t.pos( x: 15, y: 12 )}
	create(:road){|t| t.pos( x: 30, y: 12 )}
	create(:road){|t| t.pos( x: 15, y: 13 )}
	create(:road){|t| t.pos( x: 30, y: 13 )}
	create(:road){|t| t.pos( x: 15, y: 14 )}
	create(:road){|t| t.pos( x: 30, y: 14 )}
	create(:road){|t| t.pos( x: 15, y: 15 )}
	create(:road){|t| t.pos( x: 21, y: 15 )}
	create(:road){|t| t.pos( x: 22, y: 15 )}
	create(:road){|t| t.pos( x: 23, y: 15 )}
	create(:road){|t| t.pos( x: 24, y: 15 )}
	create(:road){|t| t.pos( x: 25, y: 15 )}
	create(:road){|t| t.pos( x: 26, y: 15 )}
	create(:road){|t| t.pos( x: 27, y: 15 )}
	create(:road){|t| t.pos( x: 28, y: 15 )}
	create(:road){|t| t.pos( x: 29, y: 15 )}
	create(:road){|t| t.pos( x: 30, y: 15 )}
	create(:road){|t| t.pos( x: 15, y: 16 )}
	create(:road){|t| t.pos( x: 21, y: 16 )}
	create(:road){|t| t.pos( x: 15, y: 17 )}
	create(:road){|t| t.pos( x: 21, y: 17 )}
	create(:road){|t| t.pos( x: 15, y: 18 )}
	create(:road){|t| t.pos( x: 21, y: 18 )}
	create(:road){|t| t.pos( x: 15, y: 19 )}
	create(:road){|t| t.pos( x: 21, y: 19 )}
	create(:road){|t| t.pos( x: 15, y: 20 )}
	create(:road){|t| t.pos( x: 21, y: 20 )}
	create(:road){|t| t.pos( x: 15, y: 21 )}
	create(:road){|t| t.pos( x: 21, y: 21 )}
	create(:road){|t| t.pos( x: 15, y: 22 )}
	create(:road){|t| t.pos( x: 21, y: 22 )}
	create(:road){|t| t.pos( x: 15, y: 23 )}
	create(:road){|t| t.pos( x: 16, y: 23 )}
	create(:road){|t| t.pos( x: 17, y: 23 )}
	create(:road){|t| t.pos( x: 18, y: 23 )}
	create(:road){|t| t.pos( x: 19, y: 23 )}
	create(:road){|t| t.pos( x: 20, y: 23 )}
	create(:road){|t| t.pos( x: 21, y: 23 )}
	create(:start) do |t| 
		t.pos( x: 6, y: 6 )
		t.add_data( eid: 0, name: 'start' )

	end
	create(:end) do |t| 
		t.pos( x: 32, y: 18 )
		t.add_data( eid: 1, name: 'end' )

	end
	create(:user) do |t| 
		t.pos( x: 26, y: 9 )
		t.add_data( eid: 2, name: 'none' )
		t.create_path do |route|
			route.add({ y: 9, x: 26, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 10, y: 15 )
		t.add_data( eid: 3, name: 'none' )
		t.create_path do |route|
			route.add({ y: 15, x: 10, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 10, y: 24 )
		t.add_data( eid: 4, name: 'none' )
		t.create_path do |route|
			route.add({ y: 24, x: 10, wait: 0 })
		end
	end
	create(:user) do |t| 
		t.pos( x: 35, y: 13 )
		t.add_data( eid: 5, name: 'none' )
		t.create_path do |route|
			route.add({ y: 13, x: 35, wait: 0 })
		end
	end
	create(:car){|t| t.pos( x: 16, y: 4 )}
end
