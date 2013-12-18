WebSimulator.define do
	create(:start){|t| t.pos( x: 10, y: 10, eid: 0, name: 'start' )}
	create(:end){|t| t.pos( x: 20, y: 10, eid: 1, name: 'end' )}
	create(:user){|t| t.pos( x: 40, y: 14, eid: 2, name: 'none' )}
	create(:user){|t| t.pos( x: 15, y: 19, eid: 3, name: 'none' )}
end
