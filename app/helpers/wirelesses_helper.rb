require 'td-logger'

class Array
  alias :add :push
end

module WirelessesHelper
  def create_log(data)
    TD.event.post('simulator', data)
  end

  def create_field_data(data_list, filename = "sample")
    if File.exist?("#{Rails.root}/public/stages/#{filename}.rb")
      #filename = filename + Time.now.strftime("%Y%m%d%H%M%S")   
    end
    stage_data = Hash.new
    stage_data[:filename] = filename
    File.open("#{Rails.root}/public/stages/#{filename}.rb", "w") do |file|

      file.write("WebSimulator.define do\n")
      
      data_list.each do |data|
        p data
        p data.split(' ')
        info = Hash[data.split(' ').map{|e| e.split(':')}]
        p info["path"]
        if info["type"] == "stage_data"
          info["x"] = 0
          info["y"] = 0
        elsif ["user", "start", "end"].include?(info["type"])
          path = ( info["type"] == "user")? create_path(info["path"]) : ""
          file.write("\tcreate(:#{info["type"]}) do |t| 
\t\tt.pos( x: #{info["x"]}, y: #{info["y"]} )
\t\tt.add_data( eid: #{info["eid"]}, name: '#{info["name"]}' )
#{path}
\tend\n")
        else
          file.write("\tcreate(:#{info["type"]}){|t| t.pos( x: #{info["x"]}, y: #{info["y"]} )}\n")
        end
        if info["type"] == "stage_data"
          if info["node_num"] 
            p info
            node_num = info["node_num"].to_i
            stage_data[:node_num] = node_num
          end
        end
      end
      
      file.write("end\n")
    end
    p stage_data
  end

  def create_path(path)
    path = eval(path.gsub(/\*/,','))
    str = "\t\tt.create_path do |route|\n"
    path.each_slice(3) do |data|
      str += "\t\t\troute.add({ y: #{data[0]}, x: #{data[1]}, wait: #{data[2]} })\n"
    end
    str += "\t\tend"
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

    def add_data( data )
      @obj.merge!(data)
    end

    def create_path( &block )
      route = []
      block.call route
      @obj[:path] = route
    end
  end
end
