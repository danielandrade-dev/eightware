# frozen_string_literal: true

# Configuração do Devise JWT
Devise.setup do |config|
  config.jwt do |jwt|
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
    jwt.dispatch_requests = [
      ['POST', %r{^/login$}],
      ['POST', %r{^/signup$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/logout$}]
    ]
    jwt.expiration_time = Rails.env.test? ? 1.hour.to_i : 1.day.to_i
  end
end 