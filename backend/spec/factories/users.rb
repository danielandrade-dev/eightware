FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Usuário Teste" }
    password { 'Password123' }
    password_confirmation { 'Password123' }
  end
end 