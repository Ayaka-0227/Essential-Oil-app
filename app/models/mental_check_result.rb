class MentalCheckResult < ApplicationRecord
  belongs_to :user
  belongs_to :recommended_oil, class_name: "AromaOil", optional: true

  validates :feedback, inclusion: { in: %w[good normal bad] }, allow_nil: true
end
