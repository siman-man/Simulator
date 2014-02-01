var Log = {
  queue: [],
  limit_size: 200,

  init: function( data ){
    this.queue.push(this.save(data));
    $.ajax({
      type: "post",
      url: "/logs",
      data: {
        key: Simulator.user_id,
        data_list: this.queue
      },
    });
    this.queue = [];
  },

  send: function( data ){
    if( data.operation === 'transmit' ){
      Simulator.total_send_message_num++;
    }
    this.queue.push(this.save(data));
    if( this.queue.length >= Log.limit_size){
      $.ajax({
        type: "post",
        url: "/logs",
        data: {
          key: Simulator.user_id,
          data_list: this.queue
        },
      });
      this.queue = [];
    }
  },

  save: function(data){
    return {
      time: data.time,
      type: data.type,
      operation: data.operation,
      from: data.from,
      dest: data.dest,
      created_at: data.created_at,
      message_id: data.message_id,
      hop_count: data.hop_count,
      name: data.name,
      xpos: data.xpos,
      ypos: data.ypos,
      message: data.msg 
    }
  },

  finish_save: function(data){
    return {
      time: data.time,
      type: data.type,
      operation: data.operation,
      name: data.name,
      message: data.msg,
      seed: data.seed,
      stage_type: data.stage_type,
      finish_time: data.finish_time, 
      message_num: data.message_num,
      total_send_message_num: data.total_send_message_num,
      protocol: data.protocol,
      node_num: data.node_num,
      width: View.width,
      height: View.height
    }
  },

  finish: function( data ){
    this.queue.push(this.finish_save(data));
    $.ajax({
      type: "post",
      url: "/logs",
      data: {
        key: Simulator.user_id,
        data_list: this.queue
      },
      success: function(obj){
        alert('Simulation Finish!');
        window.location = '/history';
      }
    });
  },

  agent_message: function(agent){
    var coord = View.point2coord( agent.x, agent.y );
    return message = {
      time: Simulator.time,
      type: 'normal',
      operation: 'gps',
      name: agent.name,
      xpos: coord.x,
      ypos: coord.y,
    };
  },

  transmit_message: function( from, dest, data ){
    var coord = View.point2coord( from.x, from.y );
    return message = {
      time: Simulator.time,
      type: 'normal',
      operation: 'transmit',
      message_id: data.id,
      hop_count: data.hop_count,
      xpos: coord.x,
      ypos: coord.y,
      created_at: data.created_at,
      from: from.eid,
      dest: dest.eid
    };
  },

  receive_message: function( from, dest, data ){
    var coord = View.point2coord( dest.x, dest.y );
    return message = {
      time: Simulator.time,
      type: 'normal',
      operation: 'receive',
      message_id: data.id,
      hop_count: data.hop_count,
      xpos: coord.x,
      ypos: coord.y,
      created_at: data.created_at,
      from: from.eid,
      dest: dest.eid
    };
  },
}