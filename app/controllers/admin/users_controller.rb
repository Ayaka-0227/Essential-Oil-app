class Admin::UsersController < Admin::BaseController
  def index
    users = User.order(:id).map do |u|
      { id: u.id, email: u.email, admin: u.admin, created_at: u.created_at }
    end
    render json: users
  end
end
