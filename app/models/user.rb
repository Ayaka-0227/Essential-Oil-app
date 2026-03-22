class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
      :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null
  has_many :mental_check_results

  validates :name, presence: true
  validates :gender, inclusion: { in: %w[male female other] }
  validates :birth_date, presence: true
end
