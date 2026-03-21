class HomeController < ApplicationController
  def index
    frontend_app_url = ENV["FRONTEND_APP_URL"].presence || "https://essential-oil-frontend.onrender.com"
    normalized_frontend_app_url = frontend_app_url.sub(%r{/*\z}, "")

    @user_app_url = normalized_frontend_app_url
    @login_url = "#{normalized_frontend_app_url}/login"
    @admin_app_url = "#{normalized_frontend_app_url}/admin"
  end
end
