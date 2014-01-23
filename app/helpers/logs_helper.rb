module LogsHelper
  require 'find'

  def init
    @finish_time = 0
    @total_emit = 0
    @transmit_num = Hash.new(0)
    @receive_num = Hash.new(0)
    @send_count = Hash.new(0)
    @each_transmit_num = Hash.new{|h,k| h[k] = Hash.new(0) }
    @each_receive_num = Hash.new{|h,k| h[k] = Hash.new(0) }
  end

  def collect_data( key, user_list )
    init
    p user_list
    @user_list = user_list

    result = []
    file_name = search_file(key)

    File.open( file_name, 'r' ) do |file|
      file.readlines.each do |line|
        str = line.chomp.split(' ')[2..-1].join(' ')
        data = Hash[str.delete('{}"').split(',').map{|str| 
          d = str.split(':') 
          d[0] = d[0].to_sym
          d
        }]
        check(data)
        result << data
      end
    end

    data_order
    p @each_transmit_num

    collect_result
  end

  def data_order
    @transmit_num = Hash[@transmit_num.sort_by{|k,v| k}]
    @receive_num = Hash[@receive_num.sort_by{|k,v| k}]
  end

  def collect_result
    result = Hash.new

    result[:total_emit] = @total_emit
    puts "transmit data => #{@transmit_num}"
    result[:transmit] = @transmit_num.map{|key, value| { label: @user_list[key]["name"], value: value }}
    result[:receive] = @receive_num.map{|key, value| { label: @user_list[key]["name"], value: value }}
    result[:finish_time] = @finish_time
    result[:send_count] = @send_count

    each_send = []
    @each_transmit_num.each do |from, data|
      data.each do |dest, num|
        each_send << { source: from, target: dest, value: num }
      end
    end

    result[:each_transmit] = each_send

    result
  end

  def search_file( key )
    path = ""
    Find.find("#{Rails.root}/log") do |f|
      if f =~ /#{key}/
        path = f
        break
      end
    end
    path
  end

  def hash2ltsv(hash)
    hash.to_a.map{|e| e.join(':')}.join(' ')
  end

  def user2json( filename )
    data = {}
    File.open( filename, 'r' ) do |file|
      file.readlines.each do |line|
        d = line.split(' ').map{|e| e.split(':')}.to_h
        eid = d.delete("eid")
        data[eid] = d
      end
    end
    p data
  end

  def check(data)
    case data[:operation]
    when 'init'
    when 'transmit'
      @send_count[data[:time]] += 1
      @total_emit += 1
      @transmit_num[data[:from]] += 1
      @receive_num[data[:dest]] += 1
      @each_transmit_num[data[:from]][data[:dest]] += 1
      @each_receive_num[data[:dest]][data[:from]] += 1
      @finish_time = data[:time]
    when 'finish'
      @finish_time = data[:time]
    else
    end
  end
end
