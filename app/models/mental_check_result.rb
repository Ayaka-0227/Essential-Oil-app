class MentalCheckResult < ApplicationRecord
  belongs_to :user
  belongs_to :recommended_oil, class_name: "AromaOil", optional: true

  validates :feedback, inclusion: { in: %w[good normal bad] }, allow_nil: true

  def recommended_oil_name
    recommended_oil&.name || self[:recommended_oil_name]
  end
end
