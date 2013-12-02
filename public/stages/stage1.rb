WebSimulator.define do
	create(:start){|t| t.pos( x: 8, y: 7 )}
	create(:end){|t| t.pos( x: 32, y: 24 )}
	create(:user){|t| t.pos( x: 12, y: 10 )}
	create(:user){|t| t.pos( x: 29, y: 8 )}
	create(:user){|t| t.pos( x: 39, y: 17 )}
	create(:user){|t| t.pos( x: 24, y: 20 )}
	create(:user){|t| t.pos( x: 12, y: 26 )}
end
