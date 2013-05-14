require 'test_helper'

class WirelessesControllerTest < ActionController::TestCase
  setup do
    @wireless = wirelesses(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wirelesses)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create wireless" do
    assert_difference('Wireless.count') do
      post :create, wireless: { description: @wireless.description, title: @wireless.title }
    end

    assert_redirected_to wireless_path(assigns(:wireless))
  end

  test "should show wireless" do
    get :show, id: @wireless
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @wireless
    assert_response :success
  end

  test "should update wireless" do
    patch :update, id: @wireless, wireless: { description: @wireless.description, title: @wireless.title }
    assert_redirected_to wireless_path(assigns(:wireless))
  end

  test "should destroy wireless" do
    assert_difference('Wireless.count', -1) do
      delete :destroy, id: @wireless
    end

    assert_redirected_to wirelesses_path
  end
end
