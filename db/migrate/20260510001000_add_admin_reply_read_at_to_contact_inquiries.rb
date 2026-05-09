class AddAdminReplyReadAtToContactInquiries < ActiveRecord::Migration[8.0]
  def change
    add_column :contact_inquiries, :admin_reply_read_at, :datetime
    add_index :contact_inquiries, :admin_reply_read_at
  end
end
