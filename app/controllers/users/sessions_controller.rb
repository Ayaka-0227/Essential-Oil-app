class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    token = auth_token(resource)
    render json: {
      message: "Logged in successfully.",
      auth_token: token,
      user: {
        id: resource.id,
        email: resource.email,
        admin: resource.admin
      }
    }, status: :ok
  end

  def auth_token(resource)
    Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first
  end

  def respond_to_on_destroy
    if current_user
      render json: { message: "Logged out successfully." }, status: :ok
    else
      render json: { message: "No active session." }, status: :unauthorized
    end
  end
end
