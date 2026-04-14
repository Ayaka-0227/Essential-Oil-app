class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
      :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null
  has_many :mental_check_results
  has_many :contact_inquiries, dependent: :destroy

  validates :name, presence: true
  validates :gender, inclusion: { in: %w[male female other] }
  validates :birth_date, presence: true

  def configured_admin_email?
    admin_email = ENV["ADMIN_USER_EMAIL"].to_s.strip.downcase
    return false if admin_email.blank?

    email.to_s.strip.downcase == admin_email
  end

  def ensure_admin_role!
    return unless configured_admin_email?
    return if admin?

    update!(admin: true)
  end
end
