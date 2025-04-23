class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # Validações
  validates :email, presence: true, 
                   format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true,
                      length: { minimum: 8 },
                      format: { with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+\z/,
                               message: "deve conter pelo menos uma letra maiúscula, uma minúscula e um número" }
  validates :name, length: { maximum: 100 }, allow_blank: true

  # Callbacks
  before_save :downcase_email

  def generate_jwt
    Warden::JWTAuth::UserEncoder.new.call(self, :user, nil).first
  end

  def invalidate_all_sessions!
    update_column(:jti, SecureRandom.uuid)
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end

  def password_required?
    new_record? || password.present?
  end
end
