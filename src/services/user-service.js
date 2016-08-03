var app = angular.module('app');

app.factory('AccountService', ['baseUrl', '$resource', function (baseUrl, $resource) {
	return $resource(baseUrl + 'myaccount/',
        null,
        {
            'update': {
                method: 'PUT'
            }
        });
}]);

app.factory('UserService', ['baseUrl', '$resource', function (baseUrl, $resource) {
	var userResource = $resource(baseUrl + 'users/:id/',
		null,
		{
			'update': {
				method: 'PUT'
			},
            'query': {
                method: 'GET',
                isArray: false,
                params : {
                    page: '@page'
                }
            }
		});

    var searchUserResource = $resource(baseUrl + 'users/search/:key/',
        null,
        {
            'query': {
                method: 'GET',
                isArray: true,
            }
        });
	return {
        userResource: userResource,
        searchUserResource: searchUserResource
    };
}]);