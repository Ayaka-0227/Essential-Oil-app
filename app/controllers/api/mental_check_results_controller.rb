class Api::MentalCheckResultsController < ApplicationController
  before_action :authenticate_user!

  def index
    results = current_user.mental_check_results.order(created_at: :desc)
    render json: results, include: :recommended_oil
  end

  def create
    attrs = mental_check_params.to_h
    normalized_name = normalized_recommended_oil_name
    if normalized_name.present?
      attrs["recommended_oil_name"] = normalized_name
    end

    if attrs["recommended_oil_id"].blank? && normalized_name.present?
      attrs["recommended_oil_id"] = resolve_recommended_oil_id(normalized_name)
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
      :recommended_oil_name,
      :feedback
    )
  end

  def recommended_oil_name
    params.dig(:mental_check_result, :recommended_oil_name)
  end

  def normalized_recommended_oil_name
    recommended_oil_name.to_s.squish
  end

  def resolve_recommended_oil_id(name)
    normalized = name.to_s.squish
    exact_match = AromaOil.find_by(name: normalized)&.id
    return exact_match if exact_match.present?

    # スペース揺れ（半角/全角）で一致しない場合のフォールバック
    compact = normalized.gsub(/[[:space:]]+/, "")
    AromaOil
      .where("REPLACE(REPLACE(name, ' ', ''), '　', '') = ?", compact)
      .pick(:id)
  end
end
