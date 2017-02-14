;(function() {

  'use strict';

  /**
   * footer, just a HTML template
   * @ngdoc  Directive
   *
   * @example
   * <footer><footer/>
   *
   */
  angular
    .module('HereMapsAngular')
    .directive('footer', ['$location', '$anchorScroll', tinFooter]);

  function tinFooter($location, $anchorScroll) {

    // Definition of directive
    var directiveDefinitionObject = {
      restrict: 'E',
      templateUrl: 'components/directives/footer.html',

      link: function(scope, elem, attrs) {
        elem.bind('click', function() {
          $location.hash('list-0');
          // call $anchorScroll()
          $anchorScroll();
         });
      }
    };
    return directiveDefinitionObject;
  }

})();