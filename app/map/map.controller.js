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
    .controller('MapMainController', MapMainController);

  	MapMainController.$inject = [ '$routeParams', 
  							'$scope', 
  							'$log', 
  							'$location',
  							'ReadConfig',
  							'$window',
  							'$filter'];


  	function MapMainController($routeParams, $scope, $log, $location, ReadConfig, $window, $filter) {
  		var self = this;
        //This get total dollar amount and count for give status
        $scope.map = {
            zoom : 8,
            appId: 'DemoAppId01082013GAL',
            appCode: 'AJKnXv84fjrb0KIHawS0Tg',
            divHeight: ($window.innerHeight-280) + "px",
            listing_summary: {
                locations: []
            },
            markerObj: {}
        }

 		ReadConfig.getResponse().then(function(resp) {
            if(resp.values) {
               $scope.map.listing_summary = self.createMapObj(resp.values);
               if(resp.values.length > 0) {
               		angular.element(".pop_up").css("display","none");
               }
            }                                                                  
        }).catch(function(fail) {
            $location.path("/error").search({"err": fail});
        });


        self.createMapObj = function(obj) {           
            var tempCo = {};
            tempCo["locations"] = [];
            angular.forEach(obj, function(val, key) {                              
                tempCo["locations"][key] = self.getLocation(val, key);
            })
            return tempCo;
        }

        self.getLocation = function(val,key) {
            var obj = {};
            obj["coordinates"] = {};
            obj["coordinates"]["status"] = val[0].data;
            obj["coordinates"]["lat"] = val[4].data;
            obj["coordinates"]["lng"] = val[5].data;
            obj["coordinates"]["Listingkey"] = val[2].data;
            val[3].data = $filter('currency')((val[3].text), '$', 2);
            obj["coordinates"]["ListPrice"] = val[3].data;
            obj["icon"] = {};
            obj["icon"] = self.getIcon(val, key);
            return obj;
        }

        self.getIcon = function(val, key) {
            var obj = {};
            var status = (val[0].data.indexOf('/') > -1)?(val[0].data.split('/')[0].toLowerCase()+((val[0].data.split('/')[1]).toString().toLowerCase().split(' ').join('_'))) : ((val[0].data).toString().toLowerCase().split(' ').join('_'))
            obj["template"] = "<div class='map-marker " + status + ' ' + val[2].data + "'>"+ val[3].data +"</div>";
            obj["clusterTemplate"] = function(count) { return "<div class='cluster-marker'>"+count+"</div>"};
            obj["window"] = {};
            obj["window"]["templateUrl"] = "'views/templates/template.html'";
            return obj;
        }

        
        $scope.markerClickCallback = function(data) { 
            // MDSPropertyListingsFactory.getPropertyListings(data.coordinates, false)
            //     .then(function(resp) {  
            //         $scope.map.markerObj = self.createMarkerObj(data,resp);
            //         if(window.innerWidth < 768) {
            //             angular.element('.map-marker').removeClass("selected");
            //             angular.element('.map-marker.'+data.coordinates.Listingkey).addClass('selected');
            //         }
            //         $scope.map.detailLoading = false;
            //     }).catch(function(fail) {
            //         $location.path("/error").search({"err": fail});
            //     });
        }

        self.createMarkerObj = function (data,resp) {
            data.icon.window["markerVal"] = resp[0]; 
            return {
                coordinates: data.coordinates,
                icon: data.icon
            }                              
        }
  	
  	}


})();