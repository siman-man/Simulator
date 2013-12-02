class CreateHistories < ActiveRecord::Migration
  def change
    create_table :histories do |t|
    	t.integer :seed
    	t.integer :stage_type
    	t.integer :clear_time
    	t.integer :message_num
      t.integer :node_num
    	t.integer :total_send_message_num
    	t.string :protocol
    	t.string :dir_name
    	t.string :file_name

      t.timestamps
    end
  end
end
