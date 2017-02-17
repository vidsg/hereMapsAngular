/**
 * ReadConfig
 *
 * This file is used to read config.json file from config folder used in 
 * configuration setting
 * 
 */
;(function() {

  'use strict';

  
  angular
    .module('HereMapsAngular')
    .factory('ReadConfig', ['$http', '$q', ReadConfig]);

    function ReadConfig($http, $q) {

        var factory = {
          getConfig: getConfig,
          getResponse: getResponse
        };
        return factory;

        function getConfig() {
            var deferred = $q.defer();

            $http.get("/config/config.json")
                .success( function(response, status, headers, config) {
                     deferred.resolve(response);
                })
                .error(function(errResp) {
                     deferred.reject({ error: {message: "Error while reading configuration file. Please check your configuration settings." }});
                });
            return deferred.promise;
        }

        function getResponse() {
            var deferred = $q.defer();

            $http.get("/config/response.json")
                .success( function(response, status, headers, config) {
                     deferred.resolve(response);
                })
                .error(function(errResp) {
                     deferred.reject({ error: {message: "Error while reading configuration file. Please check your configuration settings." }});
                });
            return deferred.promise;
        }
        
    }

})();
