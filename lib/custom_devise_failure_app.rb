class CustomDeviseFailureApp < Devise::FailureApp
  def respond
    if json_request?
      json_api_error_response
    else
      super
    end
  end

  private

  def json_api_error_response
    self.status = :unauthorized
    self.content_type = "application/json; charset=utf-8"
    self.response_body = {
      error: i18n_message
    }.to_json
  end

  def json_request?
    request.format.json? ||
      request.media_type == "application/json" ||
      request.path == "/users/sign_in" ||
      request.path == "/users/sign_out" ||
      request.path == "/users"
  end
end
