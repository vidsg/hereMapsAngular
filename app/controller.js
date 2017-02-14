/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('HereMapsAngular')
    .controller('MainController', MainController);

  MainController.$inject = ['CONSTANTS', '$routeParams', '$scope', '$rootScope', '$log', '$location'];


  function MainController(CONSTANTS, $routeParams, $scope, $rootScope, $log, $location) {
  	$scope.err = $routeParams.err;
    $rootScope.CONSTANTS = CONSTANTS;
  }


})();