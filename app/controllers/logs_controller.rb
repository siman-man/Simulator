require 'digest/sha2'

class LogsController < ApplicationController
	include LogsHelper
	USER_TABLE = {}
	FD_TABLE = {}
	FN_TABLE = {}

	def index
	end

	def record		
		file_key = params["key"].to_i

		params[:data_list].each do |key,data| 
			if data[:type] == 'init'
				set_file_name(file_key)
			end

			TD.event.post( file_key, data )

			if data[:type] == 'finish'
				save_record(data2config(data), file_key)
			end
		end
	end

	private
		def set_file_name(key)
			puts "set key = #{key}"
			USER_TABLE[key] = key
		end

		def data2config(data)
			config = Hash.new
			config[:seed] = data["seed"].to_i
			config[:stage_type] = data["stage_type"]
			config[:finish_time] = data["finish_time"].to_i
			config[:message_num] = data["message_num"].to_i
			config[:total_send_message_num] = data["total_send_message_num"].to_i
			config[:protocol] = data["protocol"]
			config[:node_num] = data["node_num"].to_i
			config[:width] = data["width"].to_i
			config[:height] = data["height"].to_i
			config
		end

		def save_record(config, file_key)
			p config
			config_data = Hash.new
			message_num = config[:message_num]
			protocol = config[:protocol]
			stage_type = config[:stage_type]
			seed = config[:seed]
			config_data[:seed] = seed
			config_data[:stage_type] = stage_type
			config_data[:finish_time] = config[:finish_time]
			config_data[:message_num] = message_num
			config_data[:total_send_message_num] = config[:total_send_message_num]
			config_data[:protocol] = config[:protocol]
			config_data[:node_num] = config[:node_num]
			config_data[:dir_name] = "#{Rails.root}/data/#{Time.now.strftime("%04Y/%02m/%02d")}"
			config_data[:filename] = "#{protocol}_#{stage_type}_#{message_num}_#{seed}_#{Time.now.strftime("%H%M%S")}.ltsv"
			config_data[:file_path] = ""

			record = History.new( seed: config_data[:seed], stage_type: config_data[:stage_type], clear_time: config_data[:finish_time],
														message_num: config_data[:message_num], protocol: config_data[:protocol],
														node_num: config_data[:node_num], 
														total_send_message_num: config_data[:total_send_message_num], 
														dir_name: config_data[:dir_name], filename: config_data[:filename],
														width: config[:width], height: config[:height] )

			users_data_file = File.expand_path("#{config[:stage_type]}.dat", Rails.root + 'public/users')
			users_data = user2json(users_data_file)
			
			result = collect_data(file_key, users_data, config)
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
			save_hop_count( result[:hop_count], dir_name + "/hop_count_#{filename}" )
			save_latency( result[:latency], dir_name + "/latency_#{filename}" )
			save_field( result[:field], dir_name + "/heat_map_#{filename}" )
			save_user_field( result[:user_field], dir_name + "/user_heat_map_#{filename}" )
		end
		
		def save_user_field( user_field, filename )
			height = user_field.size
			width = user_field[0].size
			File.open( filename, 'w' ) do |file|
      	height.times do |y| 
        	width.times do |x| 
          	file.puts("ypos:#{y}\txpos:#{x}\tcount:#{user_field[y][x]}")
        	end 
      	end 
			end
		end

		def save_field( field, filename )
			height = field.size
			width = field[0].size
			File.open( filename, 'w' ) do |file|
      	height.times do |y| 
        	width.times do |x| 
          	file.puts("ypos:#{y}\txpos:#{x}\tcount:#{field[y][x]}")
        	end 
      	end 
			end
		end

		def save_hop_count( hop_count, filename )
			File.open( filename, 'w' ) do |file|
				hop_count.each do |id, hop_count|
					file.puts("message_id:#{id}\thop_count:#{hop_count}")
				end
			end
		end

		def save_latency( latency, filename )
			File.open( filename, 'w' ) do |file|
				latency.each do |id, time|
					file.write("message_id:#{id}\ttime:#{time}\n")
				end
			end
		end

		def save_send_count( send_count, finish_time, filename )
			count = 0
			File.open( filename, "w") do |file|
				file.write("time:0\tvalue:0\n")
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
				file.puts("time:0\t"+@name_list.values.map{|name| name+":0" }.join("\t"))
				(0..finish_time).each do |time|
					user_list = send_user_count[time.to_s]
					if user_list.size > 0
						user_list.each do |name|
							count_list[name] += 1
						end
						file.puts("time:#{time}\t"+count_list.map{|k,v| "#{k}:#{v}"}.join("\t"))
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
