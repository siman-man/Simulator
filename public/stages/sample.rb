WBSD::Simulator.define do
  field_width 30
  field_height 30
  grid_size 30 
  transmit_range 5
  routing_protocol 'epidemic'
  time_limit -1  
  create(:start) do |t| 
    t.position( x: 10, y: 10 )
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
    t.position( x: 20, y: 10 )
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
    t.position( x: 13, y: 6 )
    t.add_data( 
      id: 2, 
      name: 'node1', 
      speed: 10, 
      move_model: 'RandomWayPoint',
      life_time: '-1',
      apper_time: '0'  
    )

		t.create_path do |route|
			route.add({ y: 6, x: 13, wait: 0 })
		end
  end
end
