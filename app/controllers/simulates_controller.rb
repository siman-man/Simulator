class SimulatesController < ApplicationController
  include WirelessesHelper
	
  def index
    p params
    if params[:time].presence
      params.delete(:controller)
      params.delete(:action)
      create_log(params)
    end

    if params[:data]
      @data = Hash.new
      p params[:data]
      @data[:seed] = params["data"]["seed"]
      @data[:stage_type] = params["data"]["stage_type"]

      file_name = "#{Rails.root}/public/stages/stage#{@data[:stage_type]}.rb"
      p file_name
      str = ""
      File.open(file_name) do |file|
        file.readlines.each do |line|
          str += line
        end
      end
      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:file].presence
      file = params[:file]

      file.tempfile.open
      str = ""
      file.tempfile.each do |line|
        str += line
      end

      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:stage_type] == "1"
      puts "create stage type 1"
      str = ""
      File.open("#{Rails.root}/public/stages/stage1.rb") do |file|
        file.readlines.each do |line|
          str += line
        end
      end

      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:field_data] 
      p params[:field_data]
      create_field_data(params[:field_data])
    end

    respond_to do |format|
      format.html { render action: 'index' }
      format.js { render 'index' }
    end
  end
end
