class Api::MentalCheckResultsController < ApplicationController
  def create
    result = MentalCheckResult.create!(mental_check_params)
    render json: result
  end

  private

  def mental_check_params
    params.require(:mental_check_result).permit(
      :user_id,
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
