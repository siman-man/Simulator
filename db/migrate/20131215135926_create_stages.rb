class CreateStages < ActiveRecord::Migration
  def change
    create_table :stages do |t|
      t.string :filename
      t.integer :node_num

      t.timestamps
    end
  end
end
