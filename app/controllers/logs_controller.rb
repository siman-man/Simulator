class LogsController < ApplicationController
	include LogsHelper

	def index
	end

	def record		
		if params[:type] == 'init'
			@@file_name = Time.now.to_i
		end

		TD.event.post( @@file_name, time: params[:time], operation: params[:operation],
			from: params[:from], dest: params[:dest], message: params[:message])
	end

	def result
	 	if defined?(@@file_name)
			@result = collect_data(@@file_name)
		else
			@sample = [{ label: 0, value: 5 }, { label: 1, value: 10}, { label: 2, value: 15 }]
			@result = { test: [ 1,2,3,4,5], test2: { a: 1 }}
			redirect_to root_path
		end
	end
end
