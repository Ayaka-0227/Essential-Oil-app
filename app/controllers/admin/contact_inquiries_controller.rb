class Admin::ContactInquiriesController < Admin::BaseController
  def index
    inquiries = ContactInquiry
      .includes(:user)
      .order(created_at: :desc)
      .map { |inquiry| serialize_inquiry(inquiry) }

    render json: inquiries
  end

  def reply
    inquiry = ContactInquiry.includes(:user).find(params[:id])

    if inquiry.update(reply_params.merge(status: "done", replied_at: Time.current, admin_reply_read_at: nil))
      render json: serialize_inquiry(inquiry)
    else
      render json: { errors: inquiry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def reply_params
    params.require(:contact_inquiry).permit(:admin_reply)
  end

  def serialize_inquiry(inquiry)
    {
      id: inquiry.id,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      admin_reply: inquiry.admin_reply,
      replied_at: inquiry.replied_at,
      admin_reply_read_at: inquiry.admin_reply_read_at,
      created_at: inquiry.created_at,
      user: {
        id: inquiry.user.id,
        name: inquiry.user.name,
        email: inquiry.user.email
      }
    }
  end
end
