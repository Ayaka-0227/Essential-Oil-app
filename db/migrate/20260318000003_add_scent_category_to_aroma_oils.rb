class AddScentCategoryToAromaOils < ActiveRecord::Migration[8.0]
  def change
    add_column :aroma_oils, :scent_category, :string
  end
end
