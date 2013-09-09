require 'td-logger'

module WirelessesHelper
	def create_log(data)
		TD.event.post('table_name', data)
	end
end
