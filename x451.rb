require 'rubygems'
require 'sinatra'
require 'erb'

get '/' do
  erb :index, :locals => {:section => case request.cookies['active']
    when 'contact'
      'contact'
    when 'code'
      'code'
    else
      'about'
    end
  }
end

get '/contact' do
  erb :index, :locals => {:section => 'contact'}
end

get '/code' do
  erb :index, :locals => {:section => 'code'}
end