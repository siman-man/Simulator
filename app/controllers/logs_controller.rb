require 'digest/sha2'

class LogsController < ApplicationController
	include LogsHelper

	def index
	end

	def record		
		params[:data_list].each do |key,data| 
			if data[:type] == 'init'
				set_file_name
			end

			TD.event.post( @@file_name, time: data[:time], operation: data[:operation],
				from: data[:from], dest: data[:dest], message: data[:message])

			if data[:type] == 'finish'
				save_record(data[:config])
			end
		end
	end

	def result
	 	if defined?(@@file_name)
			@result = collect_data(@@file_name)
			@result = @result.merge(@@config)
			dir_name = @@config[:dir_name]
			file_name = @@config[:file_name]
			save_data( @result, dir_name, file_name )
		else
			redirect_to root_path
		end
	end

	private
		def set_file_name
			@@file_name = Time.now.to_i
		end

		def save_record(config)
			p config
			@@config = Hash.new
			@@config[:seed] = config["seed"].to_i
			@@config[:stage_type] = config["stage_type"].to_i
			@@config[:finish_time] = config["finish_time"].to_i
			@@config[:message_num] = config["message_num"].to_i
			@@config[:total_send_message_num] = config["total_send_message_num"].to_i
			@@config[:protocol] = config["protocol"]
			@@config[:node_num] = config["node_num"]
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
