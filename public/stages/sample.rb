WebSimulator.define do
	create(:start){|t| t.pos( x: 10, y: 10 )}
	create(:end){|t| t.pos( x: 20, y: 10 )}
	create(:stage_data){|t| t.pos( x: 0, y: 0 )}
end
