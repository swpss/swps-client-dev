/* global describe, beforeEach, it, module, inject, expect */

'use strict';

describe('Controller: Machine Controller', function() {
    // This suite contains all the tests for `machine-controller.js`

    var MachineCtrl, scope;

    beforeEach(module('app'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        MachineCtrl = $controller('MachineCtrl', {$scope: scope});
    }));


    it('should check if states are present from the helper service', function() {
        expect(scope.states.length).toBe(36);
    });
});