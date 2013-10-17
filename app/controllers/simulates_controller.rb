class SimulatesController < ApplicationController
	def index
    if params[:time].presence
      params.delete(:controller)
      params.delete(:action)
      create_log(params)
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

    respond_to do |format|
      format.html { render action: 'index' }
      @hello = ["Ruby", "Python", "JavaScript"]
      format.js
    end
  end
end
