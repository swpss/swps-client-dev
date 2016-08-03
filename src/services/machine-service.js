var app = angular.module('app');



app.factory('MachineService', ['baseUrl', '$resource', function (baseUrl, $resource) {
	var machineResource = $resource(
		baseUrl + 'machines/:id/',
		{},
		{
			'update': {
				method: 'PUT'
			},
			'query': {
				method: 'GET',
				isArray: false,
				params: {
					page: '@page'
				}
			}
		}
	);

	var machineDetailResource = $resource(
		baseUrl + 'models/:id/',
		{},
		{
			'update': {
				method: 'PUT'
			},
			'query': {
				method: 'GET',
				isArray: true
			}
		}
	);

	var machineDataResource = $resource(baseUrl + 'data/:mid/', null,
		{
			'query': {
				method: 'GET',
				isArray: false,
				params: {
					mid: '@mid'
				}
			}
		});
	

	var recentDataResource = $resource(baseUrl + 'recent/:mid/', null, null);
	var lpdDataResource = $resource(baseUrl + 'lpd/:mid/', null, null);
	var powDataResource = $resource(baseUrl + 'pow/:mid/', null, null);
    var multipleLpdResource = $resource(baseUrl+'analysis/', null, null);
    var multipleLpdResource1 = $resource(baseUrl+'analysis1/', null, null);
	var rangeDataResource = $resource(baseUrl + 'range/:mid/', null, null);

	return {
		machine: machineResource,
		machineDetail: machineDetailResource,
		machineData: machineDataResource,
		recentData: recentDataResource,
		rangeData: rangeDataResource,
		lpdData: lpdDataResource,
		powData: powDataResource,
		multipleData: multipleLpdResource,
		multipleData1: multipleLpdResource1,
	};
}]);

app.factory('LocalMachineDataService', [function(){
	var machineData = {};

	var setMachine = function(data) {
		machineData = data;
	};

	var getMachine = function(data) {
		return machineData;
	};

	return {
		set: setMachine,
		get: getMachine
	};
}]);