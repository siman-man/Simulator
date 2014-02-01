

  WBSD::Simulator.define do
    field_width 15              # フィールドの横幅
    field_height 15             # フィールドの縦幅
    grid_size 25                # セルのサイズ
    transmit_range 5            # 通信範囲
    routing_protocol 'epidemic' # ルーティングプロトコル
    time_limit -1               # 制限時間(-1で無制限) 
  
    # createでエージェントの作成を行う
    # :startで送信元オブジェクト
    create(:start) do |source| 

      # エージェントの初期位置の設定
      source.position( x: 3, y: 3 )

      # 追加データの記述
      source.add_data( 
        id: 0,                              # IDの設定
        name: 'start',                      # エージェントの名前
        speed: 10,                          # 移動速度 
        move_model: 'StationaryMovement',   # 移動モデル
      )
    end
    create(:end) do |dest| 
      dest.position( x: 11, y: 11 )
      dest.add_data( 
        id: 1, 
        name: 'end', 
        speed: 10, 
        move_model: 'StationaryMovement',
      )
    end

    create(:user) do |user|
      user.position( x: 7, y: 7 )
      user.add_data(
        id: 2,
        name: 'Sample',
        speed: 5,
        move_model: 'RandomWayPoint'
      )
    end

end


