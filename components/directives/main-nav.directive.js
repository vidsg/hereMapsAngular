;(function() {

  'use strict';

  /**
   * Main navigation, just a HTML template
   * @ngdoc  Directive
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('HereMapsAngular')
    .directive('mainNav', tinMainNav);

  function tinMainNav() {

    // Definition of directive
    var directiveDefinitionObject = {
      restrict: 'E',
      templateUrl: 'components/directives/main-nav.html'
    };

    return directiveDefinitionObject;
  }

})();