require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  it 'é válido com atributos válidos' do
    expect(user).to be_valid
  end

  describe 'validações' do
    it 'requer email' do
      user.email = nil
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("não pode ficar em branco")
    end

    it 'requer email único' do
      existing_user = create(:user)
      user.email = existing_user.email
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("já está em uso")
    end

    it 'requer formato de email válido' do
      user.email = 'email_invalido'
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("não é válido")
    end

    it 'requer senha com mínimo de 8 caracteres' do
      user.password = '1234567'
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("é muito curto (mínimo: 8 caracteres)")
    end

    it 'requer senha com letra maiúscula, minúscula e número' do
      user.password = 'senhainvalida'
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("deve conter pelo menos uma letra maiúscula, uma minúscula e um número")
    end

    it 'limita nome a 100 caracteres' do
      user.name = 'a' * 101
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("é muito longo (máximo: 100 caracteres)")
    end
  end

  describe 'callbacks' do
    it 'converte email para minúsculas antes de salvar' do
      user.email = 'EMAIL@EXEMPLO.COM'
      user.save
      expect(user.email).to eq('email@exemplo.com')
    end
  end

  describe 'métodos de autenticação' do
    it 'gera JWT válido' do
      token = user.generate_jwt
      expect(token).to be_a(String)
      expect(token.split('.').length).to eq(3)
    end
  end
end
