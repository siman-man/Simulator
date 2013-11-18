module HistoriesHelper
	def tsf2json( file_name )
		data = []
		File.open( file_name, 'r' ) do |file|
			file.readlines.each do |line|
				label, value = line.chomp.split(' ')
				data << { label: label, value: value.to_i }
			end
		end
		data
	end
end
