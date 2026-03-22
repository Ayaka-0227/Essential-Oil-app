require "test_helper"

class Api::MentalCheckResultsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "api-user@example.com",
      name: "API User",
      gender: "female",
      birth_date: Date.new(1995, 1, 1),
      password: "password123",
      password_confirmation: "password123"
    )
    @other_user = User.create!(
      email: "other-user@example.com",
      name: "Other User",
      gender: "male",
      birth_date: Date.new(1990, 6, 15),
      password: "password123",
      password_confirmation: "password123"
    )

    @newer = @user.mental_check_results.create!(stress: 2, mood: 3)
    @older = @user.mental_check_results.create!(stress: 1, mood: 2)
    @other = @other_user.mental_check_results.create!(stress: 9, mood: 9)
  end

  test "index returns current user's results in descending created_at order" do
    get api_mental_check_results_url, headers: auth_headers_for(@user), as: :json

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [ @older.id, @newer.id ].sort.reverse, body.map { |row| row["id"] }
    assert_not_includes body.map { |row| row["id"] }, @other.id
  end

  test "index requires authentication" do
    get api_mental_check_results_url, as: :json

    assert_response :unauthorized
  end

  private

  def auth_headers_for(user)
    post user_session_url,
         params: { user: { email: user.email, password: "password123" } },
         as: :json

    token = response.headers["Authorization"]
    assert token.present?, "Expected Authorization header from sign in"

    { "Authorization" => token }
  end
end
