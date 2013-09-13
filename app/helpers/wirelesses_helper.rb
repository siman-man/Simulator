require 'td-logger'

module WirelessesHelper
  def create_log(data)
    TD.event.post('simulator', data)
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
