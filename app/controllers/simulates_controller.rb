class SimulatesController < ApplicationController
  include WirelessesHelper
	
  def index
    @control_panel = true
    @stage_type = 1
    p params
    if params[:time].presence
      params.delete(:controller)
      params.delete(:action)
      create_log(params)
    end

    if params[:edit_mode].presence
      @control_panel = false
      p params
      p "edit info"
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

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:stage_type].presence
      @stage_type = params[:stage_type].to_i
      puts "create stage type #{@stage_type}"
      str = ""
      File.open("#{Rails.root}/public/stages/stage#{@stage_type}.rb") do |file|
        file.readlines.each do |line|
          str += line
        end
      end

      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:field_data] 
      create_field_data(params[:field_data])
    end

    respond_to do |format|
      format.html { render action: 'index' }
      format.js { render 'index' }
    end
  end
end
