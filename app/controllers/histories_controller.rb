class HistoriesController < ApplicationController
	include HistoriesHelper

	def index
		@histories= History.where(nil).order("created_at DESC")
	end

	def show
		history = History.find(params[:id])
		send_file = history[:dir_name] + "/send_" + history[:filename]
		send_count_file = history[:dir_name] + "/send_count_" + history[:filename]
		send_user_count_file = history[:dir_name] + "/send_user_count_" + history[:filename]
		receive_file = history[:dir_name] + "/receive_" + history[:filename]
		receive_user_count_file = history[:dir_name] + "/receive_user_count_" + history[:filename]
		each_send_file = history[:dir_name] + "/each_send_" + history[:filename]
		latency_file = history[:dir_name] + "/latency_" + history[:filename]
		hop_count_file = history[:dir_name] + "/hop_count_" + history[:filename]
		users_data_file = File.expand_path("#{history[:stage_type]}.dat", Rails.root + 'public/users')
		@node_list = create_node_list( history[:node_num] )
		@send_data = tsf2json(send_file)
		@send_count = ltsv2json(send_count_file)
		@receive_data = tsf2json(receive_file)
		@receive_user_count = ltsv2json(receive_user_count_file)
		@each_send_data = edge2json(each_send_file)
		@users_data = ltsv2json(users_data_file)
		@send_user_count = ltsv2json(send_user_count_file)
		@latency = ltsv2json(latency_file).sort_by{|data| data["message_id"].to_i }
		@hop_count = ltsv2json(hop_count_file).sort_by{|data| data["message_id"].to_i }
		@send_count = @send_count.map{|e| {time: e["time"].to_i, value: e["value"].to_i}}
		@finish_time = history[:finish_time]
		@message_num = history[:message_num]
		@view_id = params[:id]
		@view = 'connection_network'
	end

	def view_update
		@view = params[:page]
		respond_to do |format|
      format.js { render 'update_view' }
    end
	end

	private
		def create_node_list( node_num )
			(0..node_num-1).to_a.map do |id|
				if id == 0 
					name = "S"
				elsif id == 1
					name = "D"
				else
					name = id.to_s
				end
				{ name: name }
			end
		end
end
