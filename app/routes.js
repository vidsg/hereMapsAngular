;(function() {

	angular
    .module('HereMapsAngular')
    .config(config);

    // safe dependency injection
    // this prevents minification issues
    config.$inject = ['$routeProvider','$locationProvider', '$httpProvider', '$compileProvider'];

    /**
     * App routing
     *
     * You can leave it here in the config section or take it out
     * into separate file
     * 
     */
    function config($routeProvider, $locationProvider, $httpProvider, $compileProvider) {

      $locationProvider.html5Mode(false);
      $httpProvider.interceptors.push('authInterceptor');
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common["X-Requested-With"];
      
      //debugger;
      
      // routes
      $routeProvider
        
        .when('/404', {
            templateUrl: 'views/error/404.html',
            controller: 'CustomErrorController',
            controllerAs: 'error'
        })
        .when('/400', {
            templateUrl: 'views/error/400.html',
            controller: 'CustomErrorController',
            controllerAs: 'error'
        })
        .when('/error', {
            templateUrl: 'views/error/customError.html',
            controller: 'CustomErrorController',
            controllerAs: 'error'
        })
        .when('/map', {
            templateUrl: 'views/map.html',
            controller: 'MapController',
            controllerAs: 'mapCntrl'
        })
        .otherwise({
            redirectTo: '/map'
        });

      
    }
})();