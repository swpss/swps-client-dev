var app = angular.module('app');

app.controller('MainCtrl', [
    'AuthService', 'HelperService', 'AccountService', '$localStorage', '$scope', '$rootScope', '$mdSidenav', '$mdMedia',
    function (AuthService, HelperService, AccountService, $localStorage, $scope, $rootScope, $mdSidenav, $mdMedia) {
        $rootScope.isLoggedIn = $localStorage.token ? true : false;
        $rootScope.$mdMedia = $mdMedia;

        $scope.toggleSidenav = function() {
            var navID = 'left';

            $mdSidenav(navID)
                .toggle()
                .then(function(){
                });
        };

        $scope.getUserAccount = function() {
            AccountService.get()
                .$promise.then(
                    function(response) {
                        $scope.accountInfo = response;
                        $localStorage.accountInfo = $scope.accountInfo;
                        $rootScope.isTechnician = $scope.accountInfo.account_type == HelperService.user_types_rev.Technician ? true : false;
                        $scope.err_msg = null;
                    },
                    function(err) {
                        $scope.err_msg = 'You must be logged in to perform this action.';
                    }
                );
        };

    }
]);