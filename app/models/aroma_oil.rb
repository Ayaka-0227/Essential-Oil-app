class AromaOil < ApplicationRecord
  has_many :mental_check_results, foreign_key: :recommended_oil_id
end
