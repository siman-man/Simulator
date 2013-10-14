class SimulationLog
  include Mongoid::Document
  field :time, type: Integer
  field :message, type: String
end
