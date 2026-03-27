class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!

  def index
    results = current_user.mental_check_results.order(created_at: :desc)
    render json: results, include: :recommended_oil
  end

  def create
    attrs = mental_check_params.to_h
    if attrs["recommended_oil_id"].blank? && recommended_oil_name.present?
      attrs["recommended_oil_id"] = AromaOil.find_by(name: recommended_oil_name)&.id
    end

    result = current_user.mental_check_results.new(attrs)

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

  def recommended_oil_name
    params.dig(:mental_check_result, :recommended_oil_name)
  end
end
