require 'digest/sha2'

class LogsController < ApplicationController
	include LogsHelper
	USER_TABLE = {}
	FD_TABLE = {}
	FN_TABLE = {}

	def index
	end

	def record		
		p params
		file_key = params["key"].to_i

		if FN_TABLE.has_key?(file_key)
			#FD_TABLE[file_key] = File.open(FN_TABLE[file_key],'a')
		end
		params[:data_list].each do |key,data| 
			if data[:type] == 'init'
				set_file_name(file_key)
				#FN_TABLE[file_key] = "#{Rails.root}/log/#{file_key}.log"
				#FD_TABLE[file_key] = File.open(FN_TABLE[file_key],'w')
			end

			TD.event.post( file_key, time: data[:time], operation: data[:operation],
               			from: data[:from], dest: data[:dest], message: data[:message])

			if data[:type] == 'finish'
				#config = data.delete(:config)
				#FD_TABLE[file_key].write(hash2ltsv(data)+"\n")
				save_record(data[:config], file_key)
			else
				#FD_TABLE[file_key].write(hash2ltsv(data)+"\n")
			end
		end
		#FD_TABLE[file_key].close
	end

	private
		def set_file_name(key)
			puts "set key = #{key}"
			USER_TABLE[key] = key
		end

		def save_record(config, file_key)
			p config
			config_data = Hash.new
			config_data[:seed] = config["seed"].to_i
			config_data[:stage_type] = config["stage_type"]
			config_data[:finish_time] = config["finish_time"].to_i
			config_data[:message_num] = config["message_num"].to_i
			config_data[:total_send_message_num] = config["total_send_message_num"].to_i
			config_data[:protocol] = config["protocol"]
			config_data[:node_num] = config["node_num"]
			config_data[:dir_name] = "#{Rails.root}/data/#{Time.now.strftime("%04Y/%02m/%02d")}"
			config_data[:filename] = "#{Time.now.strftime("%H%M%S")}.tsv"
			config_data[:file_path] = ""

			record = History.new( seed: config_data[:seed], stage_type: config_data[:stage_type], clear_time: config_data[:finish_time],
														message_num: config_data[:message_num], protocol: config_data[:protocol],
														node_num: config_data[:node_num],
														total_send_message_num: config_data[:total_send_message_num], 
														dir_name: config_data[:dir_name], filename: config_data[:filename] )

			users_data_file = File.expand_path("#{config[:stage_type]}.dat", Rails.root + 'public/users')
			users_data = user2json(users_data_file)
			
			result = collect_data(file_key, users_data)
			result = result.merge(config_data)
			@name_list = result[:name_list]
			puts "name_list = #{@name_list}"
			save_data( result, config_data[:dir_name], config_data[:filename] )
			if record.save!
				puts "Create new record!"
			end
		end

		def save_data( result, dir_name, filename )
			FileUtils.mkdir_p dir_name unless FileTest.exist? dir_name
			result[:send_file] = dir_name + "/send_#{filename}"
			result[:receive_file] = dir_name + "/receive_#{filename}"
			result[:receive_user_file] = dir_name + "/receive_user_count_#{filename}"
			result[:each_send_file] = dir_name + "/each_send_#{filename}"
			result[:each_receive_file] = dir_name + "/each_receive_#{filename}"

			save_send_data( result[:transmit], result[:send_file] )
			save_send_count( result[:send_count], result[:finish_time], dir_name + "/send_count_#{filename}" )
			save_send_user_count( result[:send_user_count], result[:finish_time], dir_name + "/send_user_count_#{filename}")
			save_receive_data( result[:receive], result[:receive_file] )
			save_receive_user_count( result[:receive_user_count], result[:finish_time], result[:receive_user_file])
			save_each_send_data( result[:each_transmit], result[:each_send_file] )
		end

		def save_send_count( send_count, finish_time, filename )
			count = 0
			File.open( filename, "w") do |file|
				(0..finish_time).each do |time|
					if send_count[time.to_s] > 0
						count += send_count[time.to_s]
						file.write("time:#{time}\tvalue:#{count}\n")
					end
				end
			end
		end

		def save_send_data( send_data, filename )
			File.open( filename, 'w' ) do |file|
				send_data.each do |data|
					file.write("#{data[:label]}\t#{data[:value]}\n")
				end
			end
		end

		def save_send_user_count( send_user_count, finish_time, filename )
			count_list = Hash.new(0)
			@name_list.each{|k,v| count_list[v] = 0}
			puts "send_user_count = #{send_user_count}"
			File.open( filename, 'w') do |file|
				file.write("time:0\t"+@name_list.values.map{|name| name+":0" }.join("\t")+"\n")
				(0..finish_time).each do |time|
					user_list = send_user_count[time.to_s]
					if user_list.size > 0
						user_list.each do |name|
							count_list[name] += 1
						end
						file.write("time:#{time}\t"+count_list.map{|k,v| "#{k}:#{v}"}.join("\t")+"\n")
					end
				end
			end
		end

		def save_receive_data( receive_data, filename )
			File.open( filename, 'w' ) do |file|
				receive_data.each do |data|
					file.write("#{data[:label]}\t#{data[:value]}\n")
				end
			end
		end

		def save_receive_user_count( receive_user_count, finish_time, filename )
			count_list = Hash.new(0)
			@name_list.each{|k,v| count_list[v] = 0}
			File.open( filename, 'w') do |file|
				file.write("time:0\t"+@name_list.values.map{|name| name+":0" }.join("\t")+"\n")
				(0..finish_time).each do |time|
					user_list = receive_user_count[time.to_s]
					if user_list.size > 0
						user_list.each do |name|
							count_list[name] += 1
						end
						file.write("time:#{time}\t"+count_list.map{|k,v| "#{k}:#{v}"}.join("\t")+"\n")
					end
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
