class ApplicationController < ActionController::API
  before_action :authenticate_user!
  
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found
    render json: { error: 'Recurso não encontrado' }, status: :not_found
  end

  def bad_request
    render json: { error: 'Parâmetros inválidos' }, status: :bad_request
  end
end
