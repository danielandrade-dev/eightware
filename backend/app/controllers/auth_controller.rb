class AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me, :logout]
  skip_before_action :authenticate_user!, only: [:signup, :login]

  def signup
    Rails.logger.info("Signup: #{user_params.inspect}")
    user = User.new(user_params)
    if user.save
      begin
        token = user.generate_jwt
        render json: { user: user.as_json(except: [:password_digest]), token: token }, status: :created
      rescue => e
        Rails.logger.error("Erro ao gerar token JWT: #{e.message}")
        render json: { error: 'Erro ao gerar token' }, status: :internal_server_error
      end
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    if params[:email].blank? || params[:password].blank?
      return render json: { error: 'Email e senha são obrigatórios' }, status: :bad_request
    end

    user = User.find_by(email: params[:email].downcase)
    if user&.valid_password?(params[:password])
      token = user.generate_jwt
      render json: { user: user.as_json(except: [:password_digest]), token: token }, status: :ok
    else
      render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
    end
  end

  def logout
    current_user.invalidate_all_sessions!
    render json: { message: 'Sessão encerrada com sucesso' }, status: :ok
  end

  def me
    render json: { user: current_user.as_json(except: [:password_digest]) }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end 