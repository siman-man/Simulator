class CreateWirelesses < ActiveRecord::Migration
  def change
    create_table :wirelesses do |t|
      t.string :title
      t.text :description

      t.timestamps
    end
  end
end
