class Api::ContactInquiriesController < ApplicationController
  before_action :authenticate_user!

  def create
    inquiry = current_user.contact_inquiries.new(contact_inquiry_params)

    if inquiry.save
      render json: { message: "お問い合わせを送信しました。" }, status: :created
    else
      render json: { errors: inquiry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def contact_inquiry_params
    params.require(:contact_inquiry).permit(:subject, :message)
  end
end
