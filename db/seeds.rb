# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# --- Aroma Oils ---
aroma_oils_data = [
  { id: 1,  name: "ラベンダー",           description: "落ち着きと安定感をもたらす" },
  { id: 2,  name: "オレンジ",             description: "明るさと温かさを与える" },
  { id: 3,  name: "グレープフルーツ",     description: "爽やかで活気づける" },
  { id: 4,  name: "タンジェリン",         description: "前向きな気持ちを支援" },
  { id: 5,  name: "レモン",               description: "クリアで清潔な香り" },
  { id: 6,  name: "ベルガモット",         description: "バランスの取れた香り" },
  { id: 7,  name: "プチグレイン",         description: "爽やかで振興的" },
  { id: 8,  name: "カモミールローマン",   description: "穏やかで優しい香り" },
  { id: 9,  name: "ジャーマンカモミール", description: "しっかりした香り" },
  { id: 10, name: "ジャスミン",           description: "濃厚で官能的" },
  { id: 11, name: "ゼラニウム",           description: "バランスの取れた香り" },
  { id: 12, name: "バニラ",               description: "温かく甘い香り" },
  { id: 13, name: "フランキンセンス",     description: "瞑想的な香り" },
  { id: 14, name: "サンダルウッド",       description: "グラウンディング効果" },
  { id: 15, name: "シスタス",             description: "バランスの取れた香り" },
  { id: 16, name: "クローブ",             description: "スパイシーな香り" },
  { id: 17, name: "ジンジャー",           description: "温かみのある香り" },
  { id: 18, name: "ブラックペッパー",     description: "シャープな香り" },
  { id: 19, name: "バジル",               description: "フレッシュな香り" },
  { id: 20, name: "ローズマリー",         description: "すっきりした香り" },
  { id: 21, name: "ペパーミント",         description: "すっきりとした香り" },
  { id: 22, name: "スペアミント",         description: "マイルドなミント香" },
  { id: 23, name: "ヒノキ",               description: "グラウンディングな香り" }
]

aroma_oils_data.each do |attrs|
  oil = AromaOil.find_or_initialize_by(id: attrs[:id])
  oil.name        = attrs[:name]
  oil.description = attrs[:description]
  oil.save!
end

# PostgreSQL のシーケンスをデータに合わせてリセット（重複防止）
ActiveRecord::Base.connection.execute(
  "SELECT setval('aroma_oils_id_seq', (SELECT MAX(id) FROM aroma_oils))"
)

puts "AromaOils seeded: #{AromaOil.count}"

# --- Admin User ---
admin_email = ENV["ADMIN_USER_EMAIL"].to_s.strip

if admin_email.present?
  user = User.find_by(email: admin_email)

  if user
    user.update!(admin: true) unless user.admin?
    puts "Admin ensured: #{user.email}"
  else
    puts "Admin user not found yet: #{admin_email}"
  end
else
  puts "ADMIN_USER_EMAIL is blank. Skip admin seed."
end
