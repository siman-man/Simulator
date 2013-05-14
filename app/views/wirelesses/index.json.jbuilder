json.array!(@wirelesses) do |wireless|
  json.extract! wireless, :title, :description
  json.url wireless_url(wireless, format: :json)
end