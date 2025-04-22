class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :created_at, :updated_at

  def name
    object.name || object.email.split('@').first
  end
end 