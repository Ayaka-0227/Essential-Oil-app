class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    result = current_user.mental_check_results.create!(mental_check_params)
    render json: result
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
