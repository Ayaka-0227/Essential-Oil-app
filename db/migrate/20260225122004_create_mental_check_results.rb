class CreateMentalCheckResults < ActiveRecord::Migration[8.0]
  def change
    create_table :mental_check_results do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :stress
      t.integer :anxiety
      t.integer :fatigue
      t.integer :sleep
      t.integer :emotion
      t.integer :vitality
      t.integer :mood
      t.integer :concentration
      t.references :recommended_oil, null: true, foreign_key: { to_table: :aroma_oils }

      t.timestamps
    end
  end
end
