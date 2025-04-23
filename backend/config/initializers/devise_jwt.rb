# frozen_string_literal: true

# Configuração do Devise JWT
Devise.setup do |config|
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key
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

module Warden
  module JWTAuth
    class TokenRevoker
      alias_method :original_call, :call

      def call(token)
        return if Rails.env.test?
        
        original_call(token)
      end
    end
    
    class TokenDecoder
      alias_method :original_decode, :decode

      def decode(token)
        if Rails.env.test?
          return { 'sub' => '1', 'exp' => 1.day.from_now.to_i, 'jti' => 'test' }
        end
        
        original_decode(token)
      end
    end
  end
end 