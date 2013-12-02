class LogsController < ApplicationController
	include LogsHelper

	def index
	end

	def record		
		if params[:type] == 'init'
			@@file_name = Time.now.to_i
		elsif params[:type] == 'finish'
			p params[:config]
			@@config = Hash.new
			@@config[:seed] = params[:config]["seed"].to_i
			@@config[:stage_type] = params[:config]["stage_type"].to_i
			@@config[:finish_time] = params[:config]["finish_time"].to_i
			@@config[:message_num] = params[:config]["message_num"].to_i
			@@config[:total_send_message_num] = params[:config]["total_send_message_num"].to_i
			@@config[:protocol] = params[:config]["protocol"]
			@@config[:node_num] = params[:config]["node_num"]
			@@config[:dir_name] = "#{Rails.root}/data/#{Time.now.strftime("%04Y/%02m/%02d")}"
			@@config[:file_name] = "#{Time.now.strftime("%H%M%S")}.tsv"
			@@config[:file_path] = ""

			record = History.new( seed: @@config[:seed], stage_type: @@config[:stage_type], clear_time: @@config[:finish_time],
														message_num: @@config[:message_num], protocol: @@config[:protocol],
														node_num: @@config[:node_num],
														total_send_message_num: @@config[:total_send_message_num], 
														dir_name: @@config[:dir_name], file_name: @@config[:file_name] )
			if record.save!
				puts "Create new record!"
			end
		end

		TD.event.post( @@file_name, time: params[:time], operation: params[:operation],
			from: params[:from], dest: params[:dest], message: params[:message])
	end

	def result
		#@result = { seed: @@seed, :total_emit=>33, :transmit=>[{:label=>"0", :value=>23}, {:label=>"2", :value=>1}, {:label=>"4", :value=>3}, {:label=>"6", :value=>6}], :receive=>[{:label=>"1", :value=>10}, {:label=>"2", :value=>10}, {:label=>"4", :value=>3}, {:label=>"6", :value=>10}], :finish_time=>"1282"}

	 	if defined?(@@file_name)
			@result = collect_data(@@file_name)
			@result = @result.merge(@@config)
			dir_name = @@config[:dir_name]
			file_name = @@config[:file_name]
			save_data( @result, dir_name, file_name )
		else
			@sample = [{ label: 0, value: 5 }, { label: 1, value: 10}, { label: 2, value: 15 }]
			redirect_to root_path
		end
	end

	private
		def save_data( result, dir_name, file_name )
			FileUtils.mkdir_p dir_name unless FileTest.exist? dir_name
			result[:send_file] = dir_name + "/send_#{file_name}"
			result[:receive_file] = dir_name + "/receive_#{file_name}"
			result[:each_send_file] = dir_name + "/each_send_#{file_name}"
			result[:each_receive_file] = dir_name + "/each_receive_#{file_name}"

			save_send_data( result[:transmit], result[:send_file] )
			save_recieve_data( result[:receive], result[:receive_file] )
			save_each_send_data( result[:each_transmit], result[:each_send_file] )
			#save_each_receive_data( result[:each_receive_], result[:each_receive_file] )
		end

		def save_send_data( send_data, file_name )
			File.open( file_name, 'w' ) do |file|
				send_data.each do |data|
					file.write("#{data[:label]}\t#{data[:value]}\n")
				end
			end
		end

		def save_recieve_data( recieve_data, file_name )
			File.open( file_name, 'w' ) do |file|
				recieve_data.each do |data|
					file.write("#{data[:label]}\t#{data[:value]}\n")
				end
			end
		end

		def save_each_send_data( each_send_data, file_name )
			File.open( file_name, 'w' ) do |file|
				each_send_data.each do |data|
					file.write("#{data[:source]}\t#{data[:target]}\t#{data[:value]}\n")
				end
			end
		end
end
