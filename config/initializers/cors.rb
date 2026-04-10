Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allowed_origins = [
    /\Ahttp:\/\/(localhost|127\.0\.0\.1)(:\d+)?\z/,
    ENV["FRONTEND_APP_URL"].presence
  ].compact

  allow do
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ],
      credentials: true
  end
end
