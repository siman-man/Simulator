WebSimulator.define do
  create :start do |t|
    t.pos( x: 3, y: 4 )
  end

  create :end do |t|
    t.pos( x: 10, y: 10 )
  end

  5.times do |index|
    create :user do |t|
      t.pos(x: 10+index*2, y: 7)
    end
  end

  create :tree do |t|
    t.pos(x: 7, y: 7)
  end
end 

