class SimulatesController < ApplicationController
  include WirelessesHelper
	
  def index
    @stages = Stage.where(nil).order("created_at DESC")
    @stage_type = 1
    if params[:time].presence
      params.reject!{|key| [:controller,:action].include?(key)}
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

      @scenario = eval(str)
      @config = @scenario[:config]
      @obj_list = @scenario[:obj_list]
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

      @scenario = eval(str)
      @config = @scenario[:config]
      @obj_list = @scenario[:obj_list]
    end

    if params[:file].presence
      file = params[:file]

      file.tempfile.open
      str = ""
      file.tempfile.each do |line|
        str += line
      end

      @scenario = eval(str)
      @config = @scenario[:config]
      @obj_list = @scenario[:obj_list]
    end

    @obj_list ||= []

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

    @scenario = eval(str)
    @config = @scenario[:config]
    @obj_list = @scenario[:obj_list]
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

      @scenario = eval(str)
      @config = @scenario[:config]
      @obj_list = @scenario[:obj_list]
      puts "obj_list = #{@obj_list}"
    end

    @obj_list ||= []
    puts "obj_list = #{@obj_list}"
    respond_to do |format|
      format.js { render 'index' }
    end
  end
end
