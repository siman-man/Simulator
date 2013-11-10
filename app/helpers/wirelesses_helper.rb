require 'td-logger'

module WirelessesHelper
  def create_log(data)
    TD.event.post('simulator', data)
  end

  def create_field_data(data_list)
    file_name = Time.now.strftime("%Y%m%d%H%M%S")
    File.open("#{Rails.root}/public/stages/stage_data#{file_name}.rb", "w") do |file|

      file.write("WebSimulator.define do\n")
      
      data_list.each do |data|
        p data
        p data.split(' ')
        info = Hash[data.split(' ').map{|e| e.split(':')}]
        file.write("\tcreate(:#{info["type"]}){|t| t.pos( x: #{info["x"]}, y: #{info["y"]} )}\n")
      end
      
      file.write("end\n")
    end
  end

  module WebSimulator
    class << self
      def define(&block)
        block.call
      end
    end
  end

  class Simulator
    attr_reader :list

    def initialize
      @list = []
    end 

    def create(type, &block)
      @obj = {}
      @obj[:type] = type
      block.call(self)
      @list << @obj
    end 

    def pos(pos)
      @obj[:x] = pos[:x]
      @obj[:y] = pos[:y]
    end 
  end
end
