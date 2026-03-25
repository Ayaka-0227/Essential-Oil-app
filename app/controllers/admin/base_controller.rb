class Admin::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!

  private

  def require_admin!
    current_user&.ensure_admin_role!
    render json: { error: "管理者権限が必要です" }, status: :forbidden unless current_user&.admin?
  end
end
