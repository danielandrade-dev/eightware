# frozen_string_literal: true

Rails.application.config.middleware.use Warden::Manager do |manager|
  manager.default_strategies :jwt
  manager.failure_app = ->(env) { [401, {}, ['Unauthorized']] }
end

Warden::Manager.serialize_into_session do |user|
  user.id
end

Warden::Manager.serialize_from_session do |id|
  User.find_by(id: id)
end 