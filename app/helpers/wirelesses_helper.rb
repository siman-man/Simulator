require 'td-logger'

class Array  
  alias :add :push
  alias :set :push
end

module WirelessesHelper
  def create_log(data)
    TD.event.post('simulator', data)
  end

  def hash2ltsv(hash)
    hash.to_a.map{|e| e.join(':')}.join("\t")
  end

  def create_node_data(user_data, filename)
    puts "create node data"
    File.open("#{Rails.root}/public/users/#{filename}.dat", "w") do |file|
      user_data.each do |data|
        file.write(hash2ltsv(data)+"\n")
      end
    end
  end

  def create_field_data(data_list, filename = "sample")
    if File.exist?("#{Rails.root}/public/stages/#{filename}.rb")
      #filename = filename + Time.now.strftime("%Y%m%d%H%M%S")   
    end
    stage_data = Hash.new
    user_data = []
    stage_data[:filename] = filename
    stage_data[:node_num] = 0
    keep_out = []
    File.open("#{Rails.root}/public/stages/#{filename}.rb", "w") do |file|

      file.write("WBSD::Simulator.define do\n")
      
      data_list.each do |data|
        info = Hash[data.split(' ').map{|e| e.split(':')}]
        p info["path"]
        
        if info["type"] == "stage_data"
          info.delete("type")
          file.write(<<-EOS
  field_width #{info['field_width']}
  field_height #{info['field_height']}
  grid_size #{info['grid_size']} 
  transmit_range #{info['transmit_range']}
  routing_protocol '#{info['routing_protocol']}'
  time_limit #{info['time_limit']}  
            EOS
          )
        elsif info["type"] == "ko"
          keep_out.push({ x: info["x"].to_i, y: info["y"].to_i, eid: info["eid"].to_i })
        elsif ["user", "car", "server","start","end"].include?(info["type"])
          stage_data[:node_num] += 1
          user_data << { eid: info["eid"], name: info["name"], speed: info["speed"] }
          path = ( info["type"] == "user")? create_path(info["path"]) : ""
          file.write(<<-EOS
  create(:#{info["type"]}) do |t| 
    t.position( x: #{info["x"]}, y: #{info["y"]} )
    t.add_data( 
      id: #{info["eid"]}, 
      name: '#{info["name"]}', 
      speed: #{info["speed"]}, 
      move_model: '#{info["move_model"]}',
      life_time: '#{info["life_time"]}',
      apper_time: '#{info["apper_time"]}'  
    )
#{path}
  end
          EOS
          )
        else
          file.puts("\tcreate(:#{info["type"]}){|t| t.position( x: #{info["x"]}, y: #{info["y"]} )}")
        end
      end

      unless keep_out.size.zero?
        file.puts("\tkeep_out do |k|")
        keep_out.each do |data|
          file.puts("\t\tk.set( x: #{data[:x]}, y: #{data[:y]}, eid: #{data[:eid]} )")
        end
        file.puts("\tend")
      end
      
      file.puts("end")
    end
    create_node_data(user_data, filename)
    p stage_data
  end

  def create_path(path)
    path = eval(path.gsub(/\*/,','))
    str = "\n\t\tt.create_path do |route|\n"
    path.each_slice(3) do |data|
      str += "\t\t\troute.add({ y: #{data[0]}, x: #{data[1]}, wait: #{data[2]} })\n"
    end
    str += "\t\tend"
  end

  module WBSD
    class Simulator
      attr_reader :list

      class << self
        def define(&block)
          wbsd = Simulator.new
          wbsd.instance_eval &block
          wbsd.instance_eval{ { obj_list: @list, config: @config } }
        end
      end

      def initialize
        @list = []
        @config = {}
        config_list = [:simulation_time, :transmit_range, :messege_num,
          :messege_size, :field_width, :field_height, :grid_size, :routing_protocol,
          :time_limit]

        config_list.each do |name|
          Simulator.class_eval do
            define_method name do |data|
              @config[name] = data
              { obj_list: @list, config: @config }
            end
          end
        end
      end 

      def keep_out(&block)
        @config[:keep_out] ||= []
        block.call(@config[:keep_out])
      end

      def create(type, &block)
        puts "create user =>"
        @obj = {}
        @obj[:type] = type
        block.call(self)
        @list << @obj
      end 

      def position(pos)
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
end
