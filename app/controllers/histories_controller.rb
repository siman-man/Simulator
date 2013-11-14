class HistoriesController < ApplicationController

	def index
		@histories= History.where(nil)
	end
end
