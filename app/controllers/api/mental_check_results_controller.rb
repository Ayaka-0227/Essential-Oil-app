class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!

  def index
    return render json: [] unless current_user

    results = current_user.mental_check_results.order(created_at: :desc)
    render json: results, include: :recommended_oil
  end

  def create
    result = current_user.mental_check_results.new(mental_check_params)

    if result.save
      render json: result, include: :recommended_oil, status: :created
    else
      render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    result = current_user.mental_check_results.find(params[:id])

    if result.update(mental_check_params)
      render json: result, include: :recommended_oil
    else
      render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def mental_check_params
    params.require(:mental_check_result).permit(
      :stress,
      :anxiety,
      :fatigue,
      :sleep,
      :emotion,
      :vitality,
      :mood,
      :concentration,
      :recommended_oil_id,
      :feedback
    )
  end
end
