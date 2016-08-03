var app = angular.module('app');

app.factory('AuthService', ['$http', 'baseUrl', '$localStorage', function ($http, baseUrl, $localStorage) {
    
    return {
        login: function(creds) {
            return $http.post(baseUrl + 'auth/', creds);
        },
        logout: function() {
            delete $localStorage.token;
        },
    }
}]);