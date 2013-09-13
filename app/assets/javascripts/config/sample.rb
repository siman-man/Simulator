WebSimulator.define do
  create :server do |t|
    t.pos(x: 3, y: 4)
  end

  10.times do |index|
    create :user do |t|
      t.pos(x: 10+index, y: 10)
    end
  end

  create :tree do |t|
    t.pos(x: 7, y: 7)
  end
end 
