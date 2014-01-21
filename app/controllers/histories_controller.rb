class HistoriesController < ApplicationController
	include HistoriesHelper

	def index
		@histories= History.where(nil).order("created_at DESC")
	end

	def show
		history = History.find(params[:id])
		send_file = history[:dir_name] + "/send_" + history[:filename]
		receive_file = history[:dir_name] + "/receive_" + history[:filename]
		each_send_file = history[:dir_name] + "/each_send_" + history[:filename]
		@node_list = create_node_list( history[:node_num] )
		@send_data = tsf2json(send_file)
		@receive_data = tsf2json(receive_file)
		@each_send_data = edge2json(each_send_file)
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
