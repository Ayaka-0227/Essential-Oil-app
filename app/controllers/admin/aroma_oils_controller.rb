class Admin::AromaOilsController < Admin::BaseController
  def index
    render json: AromaOil.order(:id)
  end

  def create
    oil = AromaOil.new(aroma_oil_params)
    if oil.save
      render json: oil, status: :created
    else
      render json: { errors: oil.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    oil = AromaOil.find(params[:id])
    if oil.update(aroma_oil_params)
      render json: oil
    else
      render json: { errors: oil.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    AromaOil.find(params[:id]).destroy
    head :no_content
  end

  private

  def aroma_oil_params
    params.require(:aroma_oil).permit(:name, :description, :category, :scent_category)
  end
end
