var app = angular.module('app');

app.controller('UserCtrl', ['AccountService', 'UserService', 'HelperService','$scope', '$state', '$http', 
    function (AccountService, UserService, HelperService,$scope, $state, $http) {

        $scope.err_msg = '';
        $scope.states = HelperService.states;
        $scope.USER_TYPES = HelperService.user_types;

        $scope.getUserAccount = function() {
            AccountService.get()
                .$promise.then(
                    function(response) {
                        $scope.accountInfo = response;
                        $scope.accountInfo.account_type = $scope.USER_TYPES[
                            $scope.accountInfo.account_type
                        ];
                        $scope.err_msg = null;
                    },
                    function(err) {
                        $scope.err_msg = 'You must be logged in to perform this action.';
                    }
                );
        };

        $scope.createNewUser = function () {
            if(Object.keys($scope.new_account) < 8) {
                $scope.err_msg = 'Some fields are missing';
                return;
            }

            if($scope.new_account.password != $scope.new_account.confirm_password) {
                $scope.err_msg = 'Passwords don\'t match!';
            } else {
                console.log($scope.new_account)
                var new_account = new UserService.userResource($scope.new_account);
                var create_response = new_account.$save(
                    function(user, responseHeaders) {
                        $scope.err_msg = null;
                        $state.go('users');
                    },
                    function(err) {
                        $scope.err_msg = err.data.detail;
                    }
                );
            }
        };

        $scope.resetForm = function() {
            $scope.new_account = {};
        };
        
        $scope.editProfile = function() {
            user = $scope.accountInfo;
            user.created_at = undefined;
            user.modified_at = undefined;
            user.account_type = HelperService.user_types_rev[
                user.account_type
            ];

            if(!user.password.length || !user.confirm_password.length) {
                $scope.err_msg = 'Enter both password fields';
            } else if (user.password != user.confirm_password) {
                $scope.err_msg = 'Passwords don\'t match';
            } else {
                    AccountService.update(user)
                    .$promise.then(function(response) {
                        if(response.id) {
                            $scope.err_msg = null;
                            alert('Details of ' + user.first_name + ' have been updated successfully!');
                        } else {
                            $scope.err_msg = 'All fields are required!';
                        }
                    }, function(err) {
                        $scope.err_msg = 'Something wen\'t wrong, Please Try again.';
                    }
                );
            }
        };

        $scope.getUsers = function (pageNumber) {
            pageNumber = typeof pageNumber !== 'undefined' ? pageNumber : 1;

            $scope.showingUser = false;

            UserService.
                userResource.query({page: pageNumber})
                .$promise.then(function(response) {
                    console.log(response);
                    $scope.users = angular.copy(response.results);
                    $scope.previousPage = HelperService.getPageNumber(response.previous);
                    $scope.nextPage = HelperService.getPageNumber(response.next);
                    for(var idx = 0; idx < $scope.users.length; idx++) {
                        var user = $scope.users[idx];
                        console.log($scope.USER_TYPES);
                        user.account_type = $scope.USER_TYPES[user.account_type];
                        $scope.users[idx] = user;
                    }
                    $scope.err_msg = null;
                }, function(err) {
                    $scope.err_msg = 'You must be logged in to perform this action.';
                });
        };

        $scope.getUserDetail = function (user) {
            $scope.showingUser = true;
            $scope.detail_user = user;
        };

        $scope.getOptions = function (key){
            if (key==6)
            {
                $scope.clients = $http.get('http://localhost:9000/api/v1/api/v1/clients/');
                    $scope.clients.success(function(data, status){
                        $scope.clients = data.a
                })
            }
            else{
                $scope.clients=[]
            }        
                
        }

        $scope.searchUser = function (keyword) {
            UserService
                .searchUserResource.query({key: keyword}, function(response) {
                    $scope.users = response;
                    for(var idx = 0; idx < $scope.users.length; ++idx) {
                        var user = $scope.users[idx];
                        user.account_type = $scope.USER_TYPES[user.account_type];
                        $scope.users[idx] = user; 
                        $scope.err_msg = null;
                    }
                }, function(error) {
                    $scope.err_msg = 'Something went wrong. Please try again.';
                });
        };
    }
]);