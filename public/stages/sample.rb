WBSD::Simulator.define do
  field_width 30
  field_height 30
  grid_size 15 
  transmit_range 5
  routing_protocol 'pro_phet'
  time_limit -1  
  create(:start) do |t| 
    t.position( x: 4, y: 5 )
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
    t.position( x: 24, y: 25 )
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
    t.position( x: 16, y: 5 )
    t.add_data( 
      id: 2, 
      name: 'node1', 
      speed: 10, 
      move_model: 'MapRouteMovement',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 5, x: 16, wait: 0 })
			route.add({ y: 5, x: 15, wait: 0 })
			route.add({ y: 5, x: 14, wait: 0 })
			route.add({ y: 5, x: 13, wait: 0 })
			route.add({ y: 5, x: 12, wait: 0 })
			route.add({ y: 5, x: 11, wait: 0 })
			route.add({ y: 5, x: 10, wait: 0 })
			route.add({ y: 5, x: 9, wait: 0 })
			route.add({ y: 5, x: 8, wait: 0 })
			route.add({ y: 5, x: 7, wait: 0 })
			route.add({ y: 5, x: 6, wait: 0 })
			route.add({ y: 6, x: 6, wait: 0 })
			route.add({ y: 7, x: 6, wait: 0 })
			route.add({ y: 8, x: 6, wait: 0 })
			route.add({ y: 9, x: 6, wait: 0 })
			route.add({ y: 10, x: 6, wait: 0 })
			route.add({ y: 11, x: 6, wait: 0 })
			route.add({ y: 12, x: 6, wait: 0 })
			route.add({ y: 13, x: 6, wait: 0 })
			route.add({ y: 14, x: 6, wait: 0 })
			route.add({ y: 15, x: 6, wait: 0 })
			route.add({ y: 16, x: 6, wait: 0 })
			route.add({ y: 17, x: 6, wait: 0 })
			route.add({ y: 18, x: 6, wait: 0 })
			route.add({ y: 19, x: 6, wait: 0 })
			route.add({ y: 20, x: 6, wait: 0 })
			route.add({ y: 21, x: 6, wait: 0 })
			route.add({ y: 22, x: 6, wait: 0 })
			route.add({ y: 23, x: 6, wait: 0 })
			route.add({ y: 24, x: 6, wait: 0 })
			route.add({ y: 24, x: 7, wait: 0 })
			route.add({ y: 24, x: 8, wait: 0 })
			route.add({ y: 24, x: 9, wait: 0 })
			route.add({ y: 24, x: 10, wait: 0 })
			route.add({ y: 24, x: 11, wait: 0 })
			route.add({ y: 24, x: 12, wait: 0 })
			route.add({ y: 24, x: 13, wait: 0 })
			route.add({ y: 24, x: 14, wait: 0 })
			route.add({ y: 24, x: 15, wait: 0 })
			route.add({ y: 24, x: 16, wait: 0 })
			route.add({ y: 24, x: 17, wait: 0 })
			route.add({ y: 24, x: 18, wait: 0 })
			route.add({ y: 24, x: 19, wait: 0 })
			route.add({ y: 24, x: 20, wait: 0 })
			route.add({ y: 24, x: 21, wait: 0 })
			route.add({ y: 24, x: 22, wait: 0 })
			route.add({ y: 24, x: 23, wait: 0 })
			route.add({ y: 23, x: 23, wait: 0 })
			route.add({ y: 22, x: 23, wait: 0 })
			route.add({ y: 21, x: 23, wait: 0 })
			route.add({ y: 20, x: 23, wait: 0 })
			route.add({ y: 19, x: 23, wait: 0 })
			route.add({ y: 18, x: 23, wait: 0 })
			route.add({ y: 17, x: 23, wait: 0 })
			route.add({ y: 16, x: 23, wait: 0 })
			route.add({ y: 15, x: 23, wait: 0 })
			route.add({ y: 14, x: 23, wait: 0 })
			route.add({ y: 13, x: 23, wait: 0 })
			route.add({ y: 12, x: 23, wait: 0 })
			route.add({ y: 11, x: 23, wait: 0 })
			route.add({ y: 10, x: 23, wait: 0 })
			route.add({ y: 9, x: 23, wait: 0 })
			route.add({ y: 8, x: 23, wait: 0 })
			route.add({ y: 7, x: 23, wait: 0 })
			route.add({ y: 6, x: 23, wait: 0 })
			route.add({ y: 5, x: 23, wait: 0 })
			route.add({ y: 5, x: 22, wait: 0 })
			route.add({ y: 5, x: 21, wait: 0 })
			route.add({ y: 5, x: 20, wait: 0 })
			route.add({ y: 5, x: 19, wait: 0 })
			route.add({ y: 5, x: 18, wait: 0 })
			route.add({ y: 5, x: 17, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 22, y: 16 )
    t.add_data( 
      id: 3, 
      name: 'node2', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 16, x: 22, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 8, y: 21 )
    t.add_data( 
      id: 4, 
      name: 'node3', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 21, x: 8, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 16, y: 25 )
    t.add_data( 
      id: 5, 
      name: 'node4', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 25, x: 16, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 15, y: 13 )
    t.add_data( 
      id: 6, 
      name: 'node5', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 13, x: 15, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 3, y: 13 )
    t.add_data( 
      id: 7, 
      name: 'node6', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 13, x: 3, wait: 0 })
		end
  end
  create(:user) do |t| 
    t.position( x: 20, y: 6 )
    t.add_data( 
      id: 8, 
      name: 'node7', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 6, x: 20, wait: 0 })
		end
  end
end
