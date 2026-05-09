class AddAdminReplyToContactInquiries < ActiveRecord::Migration[8.0]
  def change
    add_column :contact_inquiries, :admin_reply, :text
    add_column :contact_inquiries, :replied_at, :datetime
    add_index :contact_inquiries, :replied_at
  end
end
