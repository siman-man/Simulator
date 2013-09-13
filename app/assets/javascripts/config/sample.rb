WebSimulator.define do
  create :server do |t|
    t.pos(x: 3, y: 4)
  end

  create :user do |t|
    t.pos(x: 10, y: 10)
  end

  create :tree do |t|
    t.pos(x: 7, y: 7)
  end
end 
