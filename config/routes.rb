Simulator::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  match '/simulates' => "simulates#index", :as => :simulator, :via => [:get, :post]
  match '/stage_init' => "simulates#stage_init", :as => :stage_init, :via => [:post]

  match '/wds' => 'wds#index', :via => [:get]
  root to: 'wds#index'

  match "/logs" => "logs#record", :as => :log_init, :via => [:post]
  match "/logs" => "logs#index", :as => :log, :via => [:get]
  
  match '/view_graph' => 'graph_lists#view_graph', :via => [:get]
  match '/graph_update' => 'graph_lists#view_update', :via => [:post]

  match "/history" => "histories#index", :via => [:get]
  match "/view_update" => "histories#view_update", :via => [:post]
  post 'histories/:id' => 'histories#show', :as => :detail
 
  match "/protocol_list" => "protocols#index", :via => [:get]
  match '/stage_list' => 'stages#index', :via => [:get]
  match '/stage_create' => 'stages#create', :via => [:post]
  delete 'stages/:id' => 'stages#destroy', :as => :stage_delete

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
