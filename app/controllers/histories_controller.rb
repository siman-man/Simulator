class HistoriesController < ApplicationController
	include HistoriesHelper

	def index
		@histories= History.where(nil)
	end

	def show
		history = History.find(params[:id])
		send_file = history[:dir_name] + "/send_" + history[:file_name]
		receive_file = history[:dir_name] + "/receive_" + history[:file_name]
		@send_data = tsf2json(send_file)
		@receive_data = tsf2json(receive_file)
		p @send_data
		p @receive_data
	end
end
