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

	def edge2json( file_name )
		data = []
		File.open( file_name, 'r' ) do |file|
			file.readlines.each do |line|
				source, target, value = line.chomp.split(' ')
				data << { source: source.to_i, target: target.to_i, value: value.to_i }
			end
		end
		data
	end
end
