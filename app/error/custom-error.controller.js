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
    .controller('CustomErrorController', CustomErrorController);

  CustomErrorController.$inject = [ '$routeParams', '$scope', '$log', '$location'];


  function CustomErrorController($routeParams, $scope, $log, $location) {
  	$scope.err = $routeParams.err;
    angular.element('footer').css("display","none");
  }


})();