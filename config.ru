require 'rubygems'
require 'bundler/setup'
Bundler.require(:default, ENV['RACK_ENV'].to_sym)
require File.join(File.dirname(__FILE__), 'x451')

run X451
