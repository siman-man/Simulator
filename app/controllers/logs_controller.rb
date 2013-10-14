class LogsController < ApplicationController

	def index
	end

	def record

		if params[:type] == 'init'
			SimulationLog.destroy_all
		end
		SimulationLog.create(time: params[:time], message: params[:message])
	end
end
