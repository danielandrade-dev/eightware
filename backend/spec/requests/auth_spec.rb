require 'rails_helper'

RSpec.describe 'Authentication', type: :request do
  let(:user) { create(:user) }
  let(:valid_attributes) { 
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
      password_confirmation: 'Password123'
    } 
  }
  let(:invalid_attributes) { 
    { 
      name: 'Test User',
      email: '',
      password: 'password123',
      password_confirmation: 'password123'
    } 
  }

  describe 'POST /signup' do
    context 'com parâmetros válidos' do
      it 'cria um novo usuário' do
        expect {
          post '/signup', params: { user: valid_attributes }
        }.to change(User, :count).by(1)
      end

      it 'retorna status 201' do
        post '/signup', params: { user: valid_attributes }
        expect(response).to have_http_status(:created)
      end

      it 'retorna o token JWT e dados do usuário' do
        post '/signup', params: { user: valid_attributes }
        expect(JSON.parse(response.body)).to include('user', 'token')
      end
    end

    context 'com parâmetros inválidos' do
      it 'não cria um novo usuário' do
        expect {
          post '/signup', params: { user: invalid_attributes }
        }.not_to change(User, :count)
      end

      it 'retorna status 422 e mensagens de erro' do
        post '/signup', params: { user: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('errors')
      end
    end
  end

  describe 'POST /login' do
    let!(:existing_user) { create(:user) }

    context 'com credenciais válidas' do
      it 'retorna status 200' do
        post '/login', params: { email: existing_user.email, password: 'Password123' }
        expect(response).to have_http_status(:ok)
      end

      it 'retorna o token JWT e dados do usuário' do
        post '/login', params: { email: existing_user.email, password: 'Password123' }
        expect(JSON.parse(response.body)).to include('user', 'token')
      end
    end

    context 'com credenciais inválidas' do
      it 'retorna status 401 e mensagem de erro' do
        post '/login', params: { email: existing_user.email, password: 'wrong_password' }
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include('error')
      end
    end

    context 'sem email ou senha' do
      it 'retorna status 400 e mensagem de erro' do
        post '/login', params: { email: existing_user.email }
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)).to include('error')
      end
    end
  end

  describe 'GET /me' do
    let!(:existing_user) { create(:user) }

    context 'com token válido' do
      it 'retorna status 200' do
        get '/me', headers: auth_headers(existing_user)
        expect(response).to have_http_status(:ok)
      end

      it 'retorna os dados do usuário' do
        get '/me', headers: auth_headers(existing_user)
        expect(JSON.parse(response.body)['user']['email']).to eq(existing_user.email)
      end
    end

    context 'sem token' do
      it 'retorna status 401' do
        get '/me'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'com token inválido' do
      it 'retorna status 401' do
        get '/me', headers: { 'Authorization' => 'Bearer invalid_token' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /logout' do
    let!(:existing_user) { create(:user) }

    context 'com token válido' do
      it 'retorna status 200' do
        delete '/logout', headers: auth_headers(existing_user)
        expect(response).to have_http_status(:ok)
      end

      it 'retorna mensagem de sucesso' do
        delete '/logout', headers: auth_headers(existing_user)
        expect(JSON.parse(response.body)).to include('message' => 'Sessão encerrada com sucesso')
      end

      it 'invalida o token JWT' do
        headers = auth_headers(existing_user)
        delete '/logout', headers: headers
        get '/me', headers: headers
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'sem token' do
      it 'retorna status 401' do
        delete '/logout'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'com token inválido' do
      it 'retorna status 401' do
        delete '/logout', headers: { 'Authorization' => 'Bearer invalid_token' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end 