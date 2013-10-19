module LogsHelper
  require 'find'

  def init
    @total_emit = 0
    @transmit_num = Hash.new(0)
  end

  def collect_data( key )
    init

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
        p data
        check(data)
        result << data
      end
    end

    { total_emit: @total_emit, transmit: @transmit_num }
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

  def check(data)
    p data
    case data[:operation]
    when 'transmit'
      @total_emit += 1
      @transmit_num[data[:from]] += 1
    else
    end
  end
end
