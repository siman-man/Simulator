namespace :clear_all_data do
  desc "ログやらデータやら全て削除"

  task :exec => :environment do
    system("rm #{Rails.root}/log/simulation*")
    system("rm #{Rails.root}/public/stages/*")
    system("rm #{Rails.root}/public/users/*")
    system("rm -rf #{Rails.root}/data")
  end
end
