# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_x451_session',
  :secret      => '6696265b23c175b17482aed7864a51d671fcc1def0a674418f8ecccf9bf9f02090900e8b10df517ba5b7b30b7038106e6c19d79887bdbce028434d1dfa9a1f3e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
