module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_user!, only: [:signup, :login]

      def signup
        user = User.new(user_params)
        
        if user.save
          render json: {
            user: user.as_json(except: [:jti]),
            token: generate_token(user)
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])
        
        if user&.valid_password?(params[:password])
          render json: {
            user: user.as_json(except: [:jti]),
            token: generate_token(user)
          }, status: :ok
        else
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      end

      def me
        render json: current_user.as_json(except: [:jti])
      end

      private

      def user_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end

      def generate_token(user)
        Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
      end
    end
  end
end 