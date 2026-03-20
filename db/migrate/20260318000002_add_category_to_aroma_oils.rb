class AddCategoryToAromaOils < ActiveRecord::Migration[8.0]
  def change
    add_column :aroma_oils, :category, :string
  end
end
