class CreateContactInquiries < ActiveRecord::Migration[8.0]
  def change
    create_table :contact_inquiries do |t|
      t.references :user, null: false, foreign_key: true
      t.string :subject, null: false
      t.text :message, null: false
      t.string :status, null: false, default: "new"

      t.timestamps
    end

    add_index :contact_inquiries, :created_at
  end
end
