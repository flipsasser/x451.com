require 'rubygems'
require 'date'
require 'sinatra'
require 'erb'

class X451 < Sinatra::Application

  get '/' do
    domain = (request.env['SERVER_NAME'] || request.env['HTTP_HOST'] || '').split('.')
    subdomain = domain.shift
    # Not at x451.com or possibly at x451.x451.com? No problem; redirect!
    if subdomain != 'x451' || domain.length != 1
      redirect 'http://x451.com/', 301
    end if production?
    erb :index
  end

  get '/sasserinteractive' do
    erb :sasserinteractive
  end

end
