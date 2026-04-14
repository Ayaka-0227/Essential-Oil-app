class Admin::UsersController < Admin::BaseController
  def index
    users_scope = User.order(created_at: :desc)

    if params[:name].present?
      name_keyword = ActiveRecord::Base.sanitize_sql_like(params[:name].to_s.strip)
      users_scope = users_scope.where("name ILIKE ?", "%#{name_keyword}%")
    end

    if params[:email].present?
      email_keyword = ActiveRecord::Base.sanitize_sql_like(params[:email].to_s.strip)
      users_scope = users_scope.where("email ILIKE ?", "%#{email_keyword}%")
    end

    users = users_scope.map do |u|
      {
        id: u.id,
        name: u.name,
        email: u.email,
        gender: u.gender,
        birth_date: u.birth_date,
        admin: u.admin,
        created_at: u.created_at
      }
    end
    render json: users
  end

  def show
    user = User.includes(mental_check_results: :recommended_oil).find(params[:id])

    history = user.mental_check_results.order(created_at: :desc).map do |result|
      {
        id: result.id,
        created_at: result.created_at,
        stress: result.stress,
        anxiety: result.anxiety,
        fatigue: result.fatigue,
        sleep: result.sleep,
        emotion: result.emotion,
        vitality: result.vitality,
        mood: result.mood,
        concentration: result.concentration,
        feedback: result.feedback,
        recommended_oil: result.recommended_oil&.slice(:id, :name, :description)
      }
    end

    render json: {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      birth_date: user.birth_date,
      admin: user.admin,
      created_at: user.created_at,
      mental_check_results: history
    }
  end
end
