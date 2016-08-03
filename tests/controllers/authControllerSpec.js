/* global describe, beforeEach, it, module, inject, expect */

/*'use strict';

describe('Controller file: AuthController', function() {
    var AuthController, scope, MockAuthService;

    // MockAuthService = {
    //     login: function (creds) {
    //         var success = function() {
    //             return creds.username == 'anvesh@gmail.com' && creds.password == 'test';
    //         };

    //         var error = function() {
    //             return false;
    //         }
    //     },
    //     logout: function () { 
    //         return true; 
    //     }
    // };

    beforeEach(module('app'));

    // beforeEach(function() {
    //     module(function($provide) {
    //         $provide.value('AuthService', MockAuthService);
    //     });
    // });

    describe('LoginCtrl', function() {

        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            AuthController = $controller('LoginCtrl', {$scope: scope});
        }));

        it('should login with correct credentials', function() {
            scope.username = 'anvesh@gmail.com';
            scope.password = 'test';
            scope.login();

            expect(scope.error_message).toBe(undefined);
        });

        it('should give an error message with incorrect credentials', function() {
            scope.username = 'anvesh@gmail.com';
            scope.password = 'test2';
            scope.login();

            expect(scope.error_message).toEqual("Invalid email/password");
        });
    });

    describe('LogoutCtrl', function() {
        // Test the functionality of LogoutCtrl, but how?
    });
});*/