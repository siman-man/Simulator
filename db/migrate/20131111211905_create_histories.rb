class CreateHistories < ActiveRecord::Migration
  def change
    create_table :histories do |t|
    	t.integer :seed
    	t.integer :stage_type
    	t.integer :clear_time
    	t.string :file_path

      t.timestamps
    end
  end
end
