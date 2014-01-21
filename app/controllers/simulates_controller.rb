class SimulatesController < ApplicationController
  include WirelessesHelper
	
  def index
    @stages = Stage.where(nil).order("created_at DESC")
    p @stages
    @stage_type = 1
    p params
    if params[:time].presence
      params.reject!{|key| [:controller,:action].include?(key)}
      #params.delete(:controller)
      #params.delete(:action)
      create_log(params)
    end

    @edit_mode = true if params[:edit_mode].presence

    if params[:stage_select]
      p 'stage select'
      @edit_mode = true

      str = ""
      filename = params["filename"]
      puts "edit filename = #{filename}"
      File.open("#{Rails.root}/public/stages/#{filename}.rb") do |file|
        file.readlines.each do |line|
          str += line
        end
      end

      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:edit_stage]
      p 'edit stage mode'
      @edit_mode = true
      @stage_change = true

      str = ""
      filename = params["filename"]
      puts "filename = #{filename}"
      File.open("#{Rails.root}/public/stages/#{filename}.rb") do |file|
        file.readlines.each do |line|
          str += line
        end
      end

      @file_name = filename
      puts str

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    if params[:data]
      @data = Hash.new
      p params[:data]
      @data[:seed] = params["data"]["seed"]
      @data[:stage_type] = params["data"]["stage_type"]

      file_name = "#{Rails.root}/public/stages/stage#{@data[:stage_type]}.rb"

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

    respond_to do |format|
      format.html { render action: 'index' }
      format.js { render 'index' }
    end
  end

  def edit_stage
    p 'edit stage mode'
    @edit_mode = true
    @stage_change = true

    str = ""
    filename = params["filename"]
    puts "filename = #{filename}"
    File.open("#{Rails.root}/public/stages/#{filename}.rb") do |file|
      file.readlines.each do |line|
        str += line
      end
    end

    @file_name = filename
    puts str

    @obj_list = Simulator.new.instance_eval { eval(str); @list }
  end
  
  def stage_init
    puts "stage_init"
    if params[:stage_type].presence
      @stage_type = params[:stage_type]
      puts "create stage type #{@stage_type}"
      str = ""

      File.open("#{Rails.root}/public/stages/#{@stage_type}.rb") do |file|
        file.readlines.each do |line|
          str += line
        end
      end

      @obj_list = Simulator.new.instance_eval { eval(str); @list }
    end

    respond_to do |format|
      format.js { render 'index' }
    end
  end
end
