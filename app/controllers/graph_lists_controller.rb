class GraphListsController < ApplicationController
	include HistoriesHelper

	def index
	end

	def view_graph
		@epidemic_send_count = ltsv2json("#{Rails.root}/graph_data/epidemic_send_count.ltsv")
		@heat_map = ltsv2json("#{Rails.root}/graph_data/heat_map.ltsv")
		@epidemic_arrive_count = ltsv2json("#{Rails.root}/graph_data/epidemic_arrive_count.ltsv")

		puts "view data => #{@data}"
		@@data ||= 'epidemic_send_count'
		@data = @@data
	end

	def view_update
		@data = params[:page]
		@@data = @data

		puts "data => #{@data}"
		respond_to do |format|
      format.js { render 'update_view' }
		end
	end
end
