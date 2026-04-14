class ContactInquiry < ApplicationRecord
  belongs_to :user

  validates :subject, presence: true, length: { maximum: 120 }
  validates :message, presence: true, length: { maximum: 5000 }
  validates :status, inclusion: { in: %w[new done] }
end
