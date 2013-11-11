class CreateConfigurations < ActiveRecord::Migration
  def change
    create_table :configurations do |t|
      t.integer :seed
      t.string :stage_type
      t.string :file_path

      t.timestamps
    end
  end
end
