class MentalCheckResult < ApplicationRecord
  belongs_to :user
  belongs_to :recommended_oil, class_name: "AromaOil", optional: true
end
