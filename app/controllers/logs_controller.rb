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
			@@config[:file_path] = ""
		end

		TD.event.post( @@file_name, time: params[:time], operation: params[:operation],
			from: params[:from], dest: params[:dest], message: params[:message])
	end

	def result
		#@result = { seed: @@seed, :total_emit=>33, :transmit=>[{:label=>"0", :value=>23}, {:label=>"2", :value=>1}, {:label=>"4", :value=>3}, {:label=>"6", :value=>6}], :receive=>[{:label=>"1", :value=>10}, {:label=>"2", :value=>10}, {:label=>"4", :value=>3}, {:label=>"6", :value=>10}], :finish_time=>"1282"}


	 	if defined?(@@file_name)
			@result = collect_data(@@file_name)
			@result = @result.merge(@@config)
		else
			@sample = [{ label: 0, value: 5 }, { label: 1, value: 10}, { label: 2, value: 15 }]
			redirect_to root_path
		end
	end
end
