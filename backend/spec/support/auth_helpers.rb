module AuthHelpers
  @@invalidated_tokens = []

  def auth_headers(user = nil)
    user ||= create(:user)
    token = auth_token_for_user(user)
    { 'Authorization' => "Bearer #{token}" }
  end

  def auth_token_for_user(user)
    payload = {
      'sub' => user.id.to_s,
      'jti' => user.jti,
      'exp' => 1.day.from_now.to_i
    }
    JWT.encode(payload, test_jwt_secret, 'HS256')
  end
  
  def test_jwt_secret
    'test_secret_key'
  end
  
  def invalidate_token(token)
    @@invalidated_tokens << token.split(' ').last if token
  end
  
  def token_invalidated?(token)
    token = token.split(' ').last if token.to_s.include?(' ')
    @@invalidated_tokens.include?(token)
  end
  
  def reset_invalidated_tokens
    @@invalidated_tokens = []
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
  
  config.before(:each) do
    AuthHelpers.class_variable_set(:@@invalidated_tokens, [])
  end
end 