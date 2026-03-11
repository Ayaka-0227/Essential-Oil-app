class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern, unless: :api_or_json_request?

  # API clients using JWT do not send CSRF tokens, so skip CSRF checks for JSON requests.
  skip_forgery_protection if: :api_or_json_request?

  private

  def api_or_json_request?
    request.format.json? ||
      request.media_type == "application/json" ||
      request.path.start_with?("/api/") ||
      request.path == "/users/sign_in" ||
      request.path == "/users/sign_out"
  end
end
