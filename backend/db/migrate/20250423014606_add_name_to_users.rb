class AddNameToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :name, :string, limit: 100
  end
end