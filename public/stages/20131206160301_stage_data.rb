WebSimulator.define do
	create(:start){|t| t.pos( x: 10, y: 10 )}
	create(:end){|t| t.pos( x: 20, y: 10 )}
	create(:road){|t| t.pos( x: 10, y: 17 )}
	create(:road){|t| t.pos( x: 11, y: 17 )}
	create(:road){|t| t.pos( x: 12, y: 17 )}
	create(:road){|t| t.pos( x: 13, y: 17 )}
	create(:road){|t| t.pos( x: 14, y: 17 )}
end
