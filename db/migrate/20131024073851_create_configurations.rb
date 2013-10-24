class CreateConfigurations < ActiveRecord::Migration
  def change
    create_table :configurations do |t|
      t.integer :seed
      t.string :stage_type
      t.integer :node_num

      t.timestamps
    end
  end
end
