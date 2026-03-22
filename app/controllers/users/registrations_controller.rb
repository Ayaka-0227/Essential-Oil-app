class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  rescue_from ActiveRecord::RecordNotUnique, with: :render_duplicate_email_error
  before_action :configure_sign_up_params, only: [ :create ]

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: "登録が完了しました。",
        user: { id: resource.id, email: resource.email, name: resource.name }
      }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name, :gender, :birth_date ])
  end

  def render_duplicate_email_error
    render json: { errors: [ "メールアドレスはすでに使用されています" ] }, status: :unprocessable_entity
  end
end
