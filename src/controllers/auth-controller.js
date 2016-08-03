var app = angular.module('app');

app.controller('LoginCtrl', [
    'AuthService', '$scope', '$localStorage', '$state', '$rootScope',
    function (AuthService, $scope, $localStorage, $state, $rootScope) {
        // The reason this is in $rootScope is because the navbar
        // doesn't reload whenever it is redirected to home
        // Keeping this in $rootScope updates the navbar view also.
        // TODO: I think this should go into a service.
        $rootScope.isLoggedIn = $localStorage.token ? true : false;
        
        $scope.login = function () {
            var userCreds = {
                username: $scope.username,
                password: $scope.password
            };

            AuthService.login(userCreds)
                .success(function (response) {
                    // Save the token to $localStorage
                    $localStorage.token = response.token;
                    $state.go('home');
                })
                .error(function(response, status) {
                    if(status == 400) {
                        $scope.error_message = 'Invalid Phone Number/Password';
                    }
                });
        };
    }
]);

app.controller('LogoutCtrl', ['AuthService', '$scope', '$state', function (AuthService, $scope, $state) {
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
}]);