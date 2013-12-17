class StagesController < ApplicationController
	include WirelessesHelper
	
	def index
		@stages = Stage.where(nil).order("created_at DESC")
	end

	def new
	end

	def create
		puts "Create Field Data"
		stage_data = create_field_data(params[:field_data].split(','), params[:filename] )
		puts "stage_data = #{stage_data}"

    stage_record = Stage.find_by filename: stage_data[:filename]
		if stage_record.nil?
	  	stage = Stage.new( filename: stage_data[:filename], node_num: stage_data[:node_num] )
    	stage.save!
  	else
  		stage = Stage.find(stage_record.id)
  		stage.update_attributes( filename: stage_data[:filename], node_num: stage_data[:node_num] )
  	end
		respond_to do |format|
      format.html { redirect_to stage_list_path }
    end 
	end

	def destroy
		@stage = Stage.find(params[:id])
		File.delete("#{Rails.root}/public/stages/#{@stage.filename}.rb")
	  @stage.destroy

    respond_to do |format|
      format.html { redirect_to stage_list_path }
    end
	end
end
