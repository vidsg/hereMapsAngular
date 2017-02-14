/*
 * Test MainController
 */
;(function () {
	"use strict";

	describe('MainController', function () {
		var scope, ctrl;

		// Load app module definition before each test.
		beforeEach(module('HereMapsAngular'));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller('MainController', {
				$scope: scope
			});
		}));

		it('should have access to title in CONSTANTS that says Here Maps Angular', function () {
			expect(scope.CONSTANTS.title).toEqual('Here Maps Angular');
		});
	});
	
})();