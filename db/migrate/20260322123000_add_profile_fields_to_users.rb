class AddProfileFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :name, :string
    add_column :users, :gender, :string
    add_column :users, :birth_date, :date
  end
end
