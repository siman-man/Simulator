class WirelessesController < ApplicationController
  include WirelessesHelper

  before_action :set_wireless, only: [:show, :edit, :update, :destroy]

  # GET /wirelesses
  # GET /wirelesses.json
  def index
    if params[:time].presence
      params.delete(:controller)
      params.delete(:action)
      create_log(params)
    end
  end

  # GET /wirelesses/1
  # GET /wirelesses/1.json
  def show
  end

  # GET /wirelesses/new
  def new
    @wireless = Wireless.new
  end

  # GET /wirelesses/1/edit
  def edit
  end

  # POST /wirelesses
  # POST /wirelesses.json
  def create
  end

  # PATCH/PUT /wirelesses/1
  # PATCH/PUT /wirelesses/1.json
  def update
    respond_to do |format|
      if @wireless.update(wireless_params)
        format.html { redirect_to @wireless, notice: 'Wireless was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @wireless.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wirelesses/1
  # DELETE /wirelesses/1.json
  def destroy
    @wireless.destroy
    respond_to do |format|
      format.html { redirect_to wirelesses_url }
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_wireless
      @wireless = Wireless.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def wireless_params
      params.require(:wireless).permit(:title, :description)
    end
end
