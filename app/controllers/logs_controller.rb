class LogsController < ApplicationController
	def index
	end

	def record
		TD.event.post('table_name', { time: params[:time], message: params[:message]})
	end
end
