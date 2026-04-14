class Api::AccountsController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: user_payload(current_user)
  end

  def update
    attrs = account_params.to_h

    if attrs["password"].blank?
      attrs.delete("password")
      attrs.delete("password_confirmation")
    end

    if current_user.update(attrs)
      render json: {
        message: "アカウント情報を更新しました。",
        user: user_payload(current_user)
      }
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def account_params
    params.require(:user).permit(
      :name,
      :email,
      :gender,
      :birth_date,
      :password,
      :password_confirmation
    )
  end

  def user_payload(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      birth_date: user.birth_date,
      admin: user.admin
    }
  end
end