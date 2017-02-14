/**
 * 
 * Here Maps Angular
 * @description           Demostrate here maps with Angular js
 * @author                Vids G
 * @version               1.0.0
 * @date                  September 2015
 * 
 */
;
(function() {


    /**
     * Definition of the main app module and its dependencies
     */
    angular
        .module('HereMapsAngular', [
            
            'ngRoute',
            'ngCookies',
            'lodash'
        ]);
        

    /**
     * You can intercept any request or response inside authInterceptor
     * or handle what should happend on 40x, 50x errors
     * 
     */
    angular
        .module('HereMapsAngular')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', '$location', '$log'];

    function authInterceptor($rootScope, $q, $location, $log) {

        return {

            // intercept every request

            // Catch 404 errors
            responseError: function(response) {
                if (response.status === 404) {
                    $location.path('/');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    }


    /**
     * Run block
     */
    angular
        .module('HereMapsAngular')
        .run(run);

    run.$inject = ['$log'];

    function run($log) {
        // Add code here to be executed when the application loads
    }


})();
