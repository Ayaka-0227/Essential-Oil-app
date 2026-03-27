class AddRecommendedOilNameToMentalCheckResults < ActiveRecord::Migration[8.0]
  def up
    add_column :mental_check_results, :recommended_oil_name, :string

    execute <<~SQL.squish
      UPDATE mental_check_results AS mcr
      SET recommended_oil_name = ao.name
      FROM aroma_oils AS ao
      WHERE mcr.recommended_oil_id = ao.id
        AND mcr.recommended_oil_name IS NULL
    SQL
  end

  def down
    remove_column :mental_check_results, :recommended_oil_name
  end
end
