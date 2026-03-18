# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_03_18_000003) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "aroma_oils", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category"
    t.string "scent_category"
  end

  create_table "mental_check_results", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "stress"
    t.integer "anxiety"
    t.integer "fatigue"
    t.integer "sleep"
    t.integer "emotion"
    t.integer "vitality"
    t.integer "mood"
    t.integer "concentration"
    t.bigint "recommended_oil_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recommended_oil_id"], name: "index_mental_check_results_on_recommended_oil_id"
    t.index ["user_id"], name: "index_mental_check_results_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "mental_check_results", "aroma_oils", column: "recommended_oil_id"
  add_foreign_key "mental_check_results", "users"
end
