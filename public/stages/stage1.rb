WebSimulator.define do
  create :start do |t|
    t.pos( x: 5, y: 5 )
  end

  create :end do |t|
    t.pos( x: 30, y: 15 )
  end

  5.times do |index|
    create :user do |t|
      t.pos(x: 10+index*2, y: 7)
    end
  end

  10.times do |index|
    create :tree do |t|
      t.pos(x: 7+index, y: 7)
    end
  end
end 

