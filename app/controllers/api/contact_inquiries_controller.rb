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

  def replies
    inquiries = replied_inquiries

    render json: {
      unread_count: inquiries.count { |inquiry| inquiry.admin_reply_read_at.nil? },
      inquiries: inquiries.map { |inquiry| serialize_reply(inquiry) }
    }
  end

  def mark_replies_as_read
    replied_inquiries
      .where(admin_reply_read_at: nil)
      .update_all(admin_reply_read_at: Time.current)

    head :no_content
  end

  private

  def contact_inquiry_params
    params.require(:contact_inquiry).permit(:subject, :message)
  end

  def replied_inquiries
    current_user
      .contact_inquiries
      .where.not(admin_reply: [ nil, "" ])
      .order(replied_at: :desc, updated_at: :desc)
  end

  def serialize_reply(inquiry)
    {
      id: inquiry.id,
      subject: inquiry.subject,
      admin_reply: inquiry.admin_reply,
      replied_at: inquiry.replied_at,
      admin_reply_read_at: inquiry.admin_reply_read_at
    }
  end
end
