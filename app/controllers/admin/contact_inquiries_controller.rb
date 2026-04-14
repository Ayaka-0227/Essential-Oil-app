class Admin::ContactInquiriesController < Admin::BaseController
  def index
    inquiries = ContactInquiry
      .includes(:user)
      .order(created_at: :desc)
      .map do |inquiry|
        {
          id: inquiry.id,
          subject: inquiry.subject,
          message: inquiry.message,
          status: inquiry.status,
          created_at: inquiry.created_at,
          user: {
            id: inquiry.user.id,
            name: inquiry.user.name,
            email: inquiry.user.email
          }
        }
      end

    render json: inquiries
  end
end
