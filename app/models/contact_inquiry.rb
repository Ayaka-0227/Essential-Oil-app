class ContactInquiry < ApplicationRecord
  belongs_to :user

  validates :subject, presence: true, length: { maximum: 120 }
  validates :message, presence: true, length: { maximum: 5000 }
  validates :admin_reply, length: { maximum: 5000 }, allow_blank: true
  validates :status, inclusion: { in: %w[new done] }
  validate :admin_reply_required_if_done

  private

  def admin_reply_required_if_done
    return unless status == "done" && admin_reply.blank?

    errors.add(:admin_reply, "を入力してください")
  end
end
