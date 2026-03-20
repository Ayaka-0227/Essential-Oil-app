class AddFeedbackToMentalCheckResults < ActiveRecord::Migration[8.0]
  def change
    add_column :mental_check_results, :feedback, :string
  end
end
