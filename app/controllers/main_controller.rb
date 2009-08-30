class MainController < ApplicationController
  def index
    @title ||= "Flip Sasser's Homepage"
  end
end