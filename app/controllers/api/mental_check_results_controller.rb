class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!

  def index
    results = MentalCheckResult.order(created_at: :desc)
    render json: results, include: :recommended_oil
  end

  def create
    result = current_user.mental_check_results.create!(mental_check_params)
    render json: result, include: :recommended_oil, status: :created
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
