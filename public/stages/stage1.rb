WebSimulator.define do
  create :start do |t|
    t.pos( x: 10, y: 10 )
  end

  create :end do |t|
    t.pos( x: 20, y: 10 )
  end

  create :user do |t|
    t.pos( x: 12, y: 10 )
  end
end 

