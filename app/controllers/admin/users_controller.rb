class Admin::UsersController < Admin::BaseController
  def index
    users = User.order(created_at: :desc).map do |u|
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
