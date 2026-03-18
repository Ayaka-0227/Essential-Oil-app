class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!

  def index
    results = current_user.mental_check_results.order(created_at: :desc)
    render json: results, include: :recommended_oil
  end

  def create
    result = current_user.mental_check_results.create!(mental_check_params)
    render json: result, include: :recommended_oil, status: :created
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
      :recommended_oil_id
    )
  end
end
