namespace :clear_all_data do
  desc "ログやらデータやら全て削除"

  task :exec => :environment do
    system("rm #{Rails.root}/log/simulation*")
    system("rm -rf #{Rails.root}/data")
  end
end
