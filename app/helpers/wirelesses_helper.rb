require 'td-logger'

module WirelessesHelper
	def create_log(data)
		TD.event.post('simulator', data)
	end
end
