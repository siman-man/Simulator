str = ""
File.open(ARGV[0],'r') do |file|
  file.readlines.each do |line|
    str += line.chomp.split(' ').join("\t")+"\n"
  end
end

puts str
