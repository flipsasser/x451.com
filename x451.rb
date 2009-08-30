require 'rubygems'
require 'sinatra'
require 'erb'

get '/' do
  erb :index, :locals => {:section => 'about'}
end

get '/contact' do
  erb :index, :locals => {:section => 'contact'}
end

get '/code' do
  erb :index, :locals => {:section => 'code'}
end