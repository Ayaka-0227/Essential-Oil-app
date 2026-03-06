ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Avoid auto-loading all fixtures because this DB user cannot disable
    # referential integrity during fixture insertion.

    # Add more helper methods to be used by all tests here...
  end
end
