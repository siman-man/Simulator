WBSD::Simulator.define do
  field_width 30
  field_height 30
  grid_size 16
     
  create(:start) do |t| 
    t.position( x: 6, y: 24 )
    t.add_data( 
      id: 0, 
      name: 'start', 
      speed: 10, 
      move_model: 'StationaryMovement',
      life_time: '-1',
      apper_time: '0'  
    )

  end
  create(:end) do |t| 
    t.position( x: 23, y: 6 )
    t.add_data( 
      id: 1, 
      name: 'end', 
      speed: 10, 
      move_model: 'StationaryMovement',
      life_time: '-1',
      apper_time: '0'  
    )

  end
  create(:user) do |t| 
    t.position( x: 12, y: 5 )
    t.add_data( 
      id: 2, 
      name: 'node1', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 5, x: 12, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 4, y: 8 )
    t.add_data( 
      id: 3, 
      name: 'node2', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 8, x: 4, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 18, y: 18 )
    t.add_data( 
      id: 4, 
      name: 'node3', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 18, x: 18, wait: 0 })
		end
  end
end
