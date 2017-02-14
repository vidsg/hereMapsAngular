/**
 * Custom Error Controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('HereMapsAngular')
    .controller('MapController', MapController);

  	MapController.$inject = [ '$routeParams', '$scope', '$log', '$location'];


  	function MapController($routeParams, $scope, $log, $location) {
  	
  	}


})();