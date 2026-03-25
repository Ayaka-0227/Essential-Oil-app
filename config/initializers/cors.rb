Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allowed_origins = [
    "http://localhost:3001",
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
