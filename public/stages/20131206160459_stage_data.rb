WebSimulator.define do
	create(:start){|t| t.pos( x: 10, y: 10 )}
	create(:end){|t| t.pos( x: 20, y: 10 )}
	create(:car){|t| t.pos( x: 27, y: 17 )}
end
