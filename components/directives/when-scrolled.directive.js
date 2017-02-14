;(function() {

  'use strict';

  angular
    .module('HereMapsAngular')
    .directive('whenScrolled', ['$window',whenScrolled]);

  function whenScrolled($window) {
    return function(scope, elm, attr) {
      var raw = elm[0];
      elm.bind('scroll', function() {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-100) {
              scope.$apply(attr.whenScrolled);
          }
      });
    };
  }

})();