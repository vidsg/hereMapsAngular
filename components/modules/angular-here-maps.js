(function(window, angular, _, undefined) {

'use strict';
/**
 * @ngdoc service
 * @name angular-here-maps.MapConfig
 * @description
 * # MapConfig
 * Provider in the angular-here-maps.
 */

angular.module('angular-here-maps',[]).
  
    provider('MapConfig', [function () {

    this.mapOptions = {};

    this.$get = function() {
      var mapOptions = this.mapOptions;

      return {
        appId: function(appId) {
          return mapOptions.appId || appId;
        },
        appCode: function(appCode) {
          return mapOptions.appCode || appCode;
        },
        minZoom: function(minZoom) {
          return mapOptions.minZoom || minZoom;
        },
        maxZoom: function(maxZoom) {
          return mapOptions.maxZoom || maxZoom;
        },
        pixelRatio: function(ratio) {
          return mapOptions.pixelRatio || ratio;
        },
        pixelPerInch: function(pixel) {
          return mapOptions.pixelPerInch || pixel;
        },
        libraries: function(libraries) {
          return mapOptions.libraries || libraries;
        },
        useHTTPS: function(https) {
          return mapOptions.useHTTPS || https;
        }
      };
    };

    this.setOptions = function(options) {
      this.mapOptions = options;
    };  
  }]);

'use strict';

/**
 * @ngdoc helpers
 * @name angular-here-maps.run
 * @description
 * Helper functions for angular-here-maps.
 */
angular.module('angular-here-maps')
  .run(run);

  run.$inject = ['$rootScope'];

  function run($rootScope) {
    $rootScope.helpers = {
      useDotNotation: function(object, path) {
        path = String(path).split('.');

        for (var i = 0; i < path.length; i++) {
          object = object[path[i]];
        }
        return object;
      }
    };
  };

  'use strict';

/**
 * @ngdoc directive
 * @name angularHereMapsApp.directive:map
 * @description
 * # map
 */
angular.module('angular-here-maps')
  .directive('map', ['MapConfig', '$document', '$compile', mapDirective]);

  function mapDirective(MapConfig, $document, $compile) {
    return {
      template: '<div class="here-map"><div ng-transclude></div><div class="pop_up"><div class="no_property_selected">Property not selected on Map</div></div></div>',
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'MapController'     
    };
  };
;'use strict';

angular
  .module('angular-here-maps')
  .controller('MapController', MapController);

  MapController.$inject = [
      'MapConfig',
      '$scope', 
      '$element', 
      '$document',
      '$compile',
      '$attrs',
      '$window'
  ];

  function MapController(MapConfig, $scope, $element, $document, $compile, $attrs, $window) {

      var defaultLayers,
        modules,
        behavior,
        marker,
        markerWindow,
        group;

      var self = this;
      $scope.zoom = $scope.helpers.useDotNotation($scope, $attrs.zoom);
      $scope.center = $scope.helpers.useDotNotation($scope, $attrs.center);
      $scope.bounds = $scope.helpers.useDotNotation($scope, $attrs.bounds);
      $scope.wheelzoom = $scope.helpers.useDotNotation($scope, $attrs.wheelzoom);
      $scope.draggable = $scope.helpers.useDotNotation($scope, $attrs.draggable);
      $scope.appId = $scope.helpers.useDotNotation($scope, $attrs.appid);
      $scope.appCode = $scope.helpers.useDotNotation($scope, $attrs.appcode);
      $scope.clusterClick = $scope.helpers.useDotNotation($scope, $attrs.clusterclick);
      $scope.markerClick = $scope.helpers.useDotNotation($scope, $attrs.markerclick);
      $scope.maxPinsOnMap = $scope.helpers.useDotNotation($scope, $attrs.maxpinsonmap);
      
      
      if (MapConfig.libraries()) {
        modules = MapConfig.libraries().split(',');
      }

      $scope.refreshMarkers = function() {
        var allIcons = [];
        var templateMarkers = $document.find('template-marker');
        var mapIcons = $document.find('marker-icon');
        var zoom = $scope.mapObject.getZoom();


        allIcons.push(templateMarkers, mapIcons);

        _.each(allIcons, function(mapIcon) {            
          $compile(mapIcon)($scope);           
        });
        $scope.$apply();
      };

      var platform = new H.service.Platform({
        'app_id': MapConfig.appId() || $scope.appId,
        'app_code': MapConfig.appCode() || $scope.appCode,
        useHTTPS: MapConfig.useHTTPS()
      });

      defaultLayers = platform.createDefaultLayers(512, MapConfig.pixelPerInch());

      $scope.mapObject = new H.Map(
        $element[0],
        defaultLayers.normal.map,
        {
            pixelRatio: MapConfig.pixelRatio(),
            zoom: 18
        } 
      );

      self.group = new H.map.Group();
      self.totalNbrGroups = 0;
      self.orgClusterZoom = 18;
      if ($scope.zoom) {
        $scope.mapObject.setZoom($scope.zoom);
      }

      if ($scope.center) {
        $scope.mapObject.setCenter($scope.center);
      }

      var setViewBounds = function(bounds, clusterZoom) {
        if(bounds && bounds[0]) {
          var bbox = new H.geo.Rect(bounds[0]+10, bounds[1]+10, bounds[2]+10, bounds[3]+10);
          $scope.mapObject.setViewBounds(bbox);
        } else {
          $scope.mapObject.setViewBounds(bounds);
          if($scope.windowWidth < 768 && ($scope.windowWidth < $scope.windowHeight)) {
            if(clusterZoom < self.orgClusterZoom) {
              $scope.mapObject.setZoom(clusterZoom>5?(clusterZoom-1): 7);
              self.orgClusterZoom = clusterZoom;
            } else {
              $scope.mapObject.setZoom(self.orgClusterZoom>5?(self.orgClusterZoom-1): 7);
            }
            
          }

        }
      };

      if ($scope.bounds) {
        setViewBounds($scope.bounds);
      }

      $scope.$watch($scope.bounds, function() {
        if ($scope.bounds) {
          //$scope.bounds = $scope.helpers.useDotNotation($scope, $attrs.bounds);
          setViewBounds($scope.bounds);
        }
      });
      
      window.addEventListener('resize', function () {
        $scope.mapObject.getViewPort().resize();
      }.bind(self));

      _.each(modules, function(module) {
        if (module === 'ui') {
          self.ui = H.ui.UI.createDefault($scope.mapObject, defaultLayers);
          $scope.mapObject.ui = self.ui;
        }
        if (module === 'pano') {
          platform.configure(H.map.render.panorama.RenderEngine);
        }
        if (module === 'mapevents') {
          behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents($scope.mapObject));

          var toggleBehavior = function(behaviorState, mapBehavior) {
            if (behaviorState === false) {
              behavior.disable(H.mapevents.Behavior[mapBehavior]);
            } else {
              behavior.enable(H.mapevents.Behavior[mapBehavior]);
            }
          };

          if ($attrs.wheelzoom) {
            $scope.$watch($attrs.wheelzoom, function(wheelZoom) {
              toggleBehavior(wheelZoom, 'WHEELZOOM');
            });
          }

          if ($attrs.draggable) {
            $scope.$watch($attrs.draggable, function(draggable) {
              toggleBehavior(draggable, 'DRAGGING');
            });
          }
        }
      }.bind(self));

      self.createMapMarker = function(coordinates, icon, id, noisePoint) {
        var markerTemplate,
          events,
          idAttr = '';

        if (id) {
          idAttr = 'id=' + id;
        }

        if (icon && icon.events) {
          events = icon.events;
        }

        if (icon) {
          if (icon.template || icon.templateUrl) {
            if (icon.templateUrl) {
              markerTemplate = '<template-marker ng-cloak ' + idAttr + ' templateurl="' + icon.templateUrl + '"></template-marker>';
            } else {
              markerTemplate = '<marker-icon ' + idAttr + '>' + icon.template + '</marker-icon>';
            }
            var markerIcon = new H.map.DomIcon(markerTemplate);
            marker = new H.map.DomMarker(coordinates, {
              icon: markerIcon,
              min: (noisePoint? noisePoint.getMinZoom(): 2)
            });
          } else {
            marker = new H.map.Marker(coordinates);
          }

          self.group.addEventListener('tap', function(_coordinates_, event) {
            if (events) {
              events.tap(coordinates, event);
            }
          }.bind(self, coordinates), false);

        }

        return {
          markerTemplate: markerTemplate
        };
      };

      var createMarkerEvents = function(evt){//windowTemplate, coordinates) {
          var target = evt.target;
          var data = target.getData();
          if(data.type) {
              var maxZoom = evt.target.getProvider().max;

              // calculate best camera data to fit object's bounds
              var cameraData = $scope.mapObject.getCameraDataForBounds(data.cluster.getBounds());

              // we set new zoom level taking into acount 'maxZoom' value
              $scope.mapObject.setZoom(Math.min(cameraData.zoom, ($scope.mapObject.getZoom() + 1)), true);
              $scope.mapObject.setCenter(cameraData.position, true);

              if(data.cluster.getWeight() > 1 && $scope.mapObject.getZoom()+1 === cameraData.zoom) {
                    self.clusterDataPoints = []
                    data.cluster.forEachDataPoint(self.clusterDataPoints.push.bind(self.clusterDataPoints));
                    self.openBubble(self.clusterDataPoints);
              }
              //$scope.$apply($scope.clusterClick("test"));

          } else {
              //var data = target.getData();
              var coordinates = data.coordinates;
              self.clusterCount = null;
              $scope.$apply($scope.markerClick(data)); 

              $scope.mapObject.setCenter({lat: coordinates.lat, lng: coordinates.lng});
              
          }
        
      }.bind(self);

      self.openBubble = function (data) {
          if(data instanceof Array) {
              self.clusterPoint = true;
              self.clusterCount = 0
              $scope.$apply($scope.markerClick(data[self.clusterCount].getData()));           
              //self.bubble(data[0].getData(), true);
          } else {
              self.bubble(data, self.clusterPoint);
              self.clusterPoint = false;
          }          
      }

      self.onClusterPrevClick = function() {
        if(self.clusterCount > 0) {
          self.clusterCount--;
          self.navigateCluster();
        } 
      }

      self.onClusterNextClick = function() {
        if(self.clusterCount < self.clusterDataPoints.length) {
          self.clusterCount++;
          self.navigateCluster(); 
        } 
      }

      self.navigateCluster = function() {
        self.clusterPoint = true;
        $scope.$apply($scope.markerClick(self.clusterDataPoints[self.clusterCount].getData())); 
      }


      self.bubble = function(data, enableNextPrev) {
          var coordinates = data.coordinates;
          var windowTemplate = self.createMarkerWindows(coordinates, data.icon, enableNextPrev);
          //var windowTemplate = evt.target.getData()
          $scope.removeBubble = function() {
            markerWindow.close();
          };

          if (markerWindow) {
            self.ui.removeBubble(markerWindow);
          }
          var newTemplate = windowTemplate;
          newTemplate = $compile(newTemplate)($scope);
          
          if (windowTemplate) {
            markerWindow = new H.ui.InfoBubble(coordinates, {
              content: newTemplate[0]
            });
            if($scope.windowWidth < 768 && ($scope.windowWidth < $scope.windowHeight)) {//Only for portrait mode
                angular.element(".pop_up").html(markerWindow.$i);
            } else {
              if(data.icon.window.markerVal.listClick) {
                $scope.mapObject.setCenter({lat: data.coordinates.lat, lng: data.coordinates.lng});
                $scope.mapObject.setZoom(8);
              }
              self.ui.addBubble(markerWindow);
            }
          }
      }

      self.createMarkerWindows = function(coordinates, icon, enableNextPrev) {
        var windowTemplate, enableNext = true, enablePrev = false;
        if(self.clusterCount) {
          if(self.clusterCount == 0) {
            enableNext = true;
            enablePrev = false;
            enableNextPrev = true;
          }
          if(self.clusterCount == (self.clusterDataPoints.length-1)) {
            enableNext = false;
            enablePrev = true;
            enableNextPrev = true;
          } 
          if(self.clusterCount > 0 && self.clusterCount < (self.clusterDataPoints.length-1)) {
            enableNext = true;
            enablePrev = true
            enableNextPrev = true;
          }
        } else {
          if(icon.window.markerVal.listClick || self.clusterCount === null) {
            enableNextPrev = false;
          }
        }

        if (icon && icon.window) {
          if (icon.window.templateUrl) {
              var obj = icon.window.markerVal;
              var parmStr = "";
              angular.forEach(obj, function(val, key) {
                  var str = key.substring(0,1).toLowerCase() + key.substring(1,key.length);
                  str = str.replace(/([A-Z])/g, '-$1').trim();
                  parmStr = parmStr + " "+ str.toLowerCase() + "=\"" + val + "\"";
              })

              windowTemplate = '<template-window templateurl=' + icon.window.templateUrl + ' obj-key=' + coordinates.Listingkey +  parmStr + ' enable-bottom="false"' + ' number=' + ((self.clusterCount&&self.clusterCount>=0)?(self.clusterCount+1):1) + ' total=' + (self.clusterDataPoints?(self.clusterDataPoints.length):0) + ' enable-prev=' + (enablePrev?enablePrev:"false") + ' enable-next=' + (enableNext?enableNext:"false") + ' enable-next-prev=' + (enableNextPrev?enableNextPrev:"false") +' ></template-window>';
          } else {
              windowTemplate = '<marker-window>' + icon.window.template + '</marker-window>';
          }
          /*if (icon.window.template || icon.window.templateUrl) {
            createMarkerEvents(windowTemplate, coordinates);
          }*/
        }

        return windowTemplate;
      };

      self.getCurrentIcon = function(defaultIcon, currentIcon) {

        var icon = angular.copy(defaultIcon);

        if (currentIcon && currentIcon.template) {
          delete icon.templateUrl;
          icon.template = currentIcon.template;
        }

        if (currentIcon && currentIcon.templateUrl) {
          delete icon.template;
          icon.templateUrl = currentIcon.templateUrl;
        }

        if (currentIcon && currentIcon.events) {
          icon.events = currentIcon.events;
        }

        if (currentIcon && currentIcon.window && currentIcon.window.template) {
          delete icon.window.templateUrl;
          icon.window.template = currentIcon.window.template;
        }

        if (currentIcon && currentIcon.window && currentIcon.window.templateUrl) {
          delete icon.window.template;
          icon.window.templateUrl = currentIcon.window.templateUrl;
        }

        return icon;
      };

      self.getClusterIcon = function() {
        return "images/cluster-icon.png";
      }

      self.createClusterMarker = function(cluster, icon, diameter, radius, count, id) {
        var coordinates = cluster.getPosition();
        var markerTemplate, 
          clusterMarker,
          events,
          idAttr = '';

        if (id) {
          idAttr = 'id=' + id;
        } 
        
        if (icon && icon.events) {
          events = icon.events;
        }

        if (icon) {
          if (icon.clusterTemplate || icon.clusterTemplateUrl) {
            if (icon.clusterTemplateUrl) {
              markerTemplate = '<template-marker ng-cloak ' + idAttr + ' templateurl="' + icon.clusterTemplateUrl + '"></template-marker>';
            } else {
              markerTemplate = '<cluster-icon ' + idAttr + '>' + icon.clusterTemplate(count) + '</cluster-icon>';
            }
            var markerIcon = new H.map.DomIcon(markerTemplate, {
                size: {w: diameter, h: diameter},
                anchor: {x: radius, y: radius}
              }
            );
            clusterMarker = new H.map.DomMarker(coordinates, {
              icon: markerIcon,
              min: cluster.getMinZoom(),
              max: cluster.getMaxZoom()
            });
          } else {
            clusterMarker = new H.map.Marker(coordinates);
          }
          
        }

        return {
          marker: clusterMarker
        };
      };
      self.removeMarker = function(group) {
        $scope.mapObject.removeObject(group);
      };

      self.addMarkerToMap = function(coordinates, zIndex, defaultIcon, currentIcon, id, noisePoint) {         

        var icon = self.getCurrentIcon(defaultIcon, currentIcon);

        self.createMapMarker(coordinates, icon, id, noisePoint);
        //var windowTemplate = self.createMarkerWindows(coordinates, icon);

        $scope.mapObject.addObject(self.group);
        /*if (marker) {
          marker.setZIndex(zIndex);
          marker.setData(coordinates);
          self.group.addObject(marker);
        }*/
        
        if(self.directiveType == "markers")
          return {
              marker: marker
          }
        else {
          if(marker) {
            marker.setZIndex(self.zIndex);
            if(self.singleMarker) {
              var data = [{coordinates: coordinates, icon: currentIcon}];
              marker.setData(data[0]);
            } else {
              marker.setData(coordinates);
            }
          }
          self.setMarkerInGroup(marker, coordinates)
          return self.group;
        }
      };

      self.setMarkerInGroup = function(marker,coordinates) {
          if (marker) {             
            self.group.addObject(marker);
            if(self.singleMarker) {
                $scope.mapObject.setCenter({lat: coordinates.lat, lng: coordinates.lng});
                marker.addEventListener('tap', createMarkerEvents);
            } else {
                $scope.bounds = self.group.getBounds();
            }
          }
          
      }

      self.startClustering = function(data, zIndex, defaultIcon, directiveType, singleMarker) {//directiveType = 'markers' for clustering 
        var dataPoints =  data.map(function (item) {
                            return new H.clustering.DataPoint(item.coordinates.lat, item.coordinates.lng, null, item);
                          });
        self.zIndex = zIndex,
        self.defaultIcon = defaultIcon,
        self.dataLocation = data,
        self.directiveType = directiveType;
        self.singleMarker = singleMarker;

        if(singleMarker) {
            self.directiveType = "marker";
            self.addMarkerToMap(data[0].coordinates, zIndex, defaultIcon, data[0].icon);
        } else {
            var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
              min: 2,
              max: 18,
              clusteringOptions: {
                // Maximum radius of the neighbourhood
                eps: 16,
                //minimum weight of points required to form a cluster
                minWeight: 2
              },
              theme: CUSTOM_THEME
            });

            // Create a layer tha will consume objects from our clustering provider
            var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);


            // To make objects from clustering provder visible,
            // we need to add our layer to the map
            $scope.mapObject.addLayer(clusteringLayer);

            clusteredDataProvider.addEventListener('tap', createMarkerEvents);
        }
      }

      var CUSTOM_THEME = {
        getClusterPresentation: function(cluster) {
          var weight = cluster.getWeight(),
              // Calculate circle size
              radius = weight * 12,
              diameter = radius * 2;
          // Get random DataPoint from our cluster
          var randomDataPoint = getRandomDataPoint(cluster),
            // Get a reference to data object that DataPoint holds
            data = randomDataPoint.getData();

          var clusterMarker = self.createClusterMarker(cluster, data.icon, diameter, radius, cluster.getWeight()).marker;
          

          // Link data from the random point from the cluster to the marker,
          // to make it accessible inside onMarkerClick
          clusterMarker.setData( {data: data, type:'cluster', cluster: cluster});

          return clusterMarker;
        },
        getNoisePresentation: function (noisePoint) {
          
          var data = noisePoint.getData();
          var noise = self.addMarkerToMap(data.coordinates, self.zIndex, self.defaultIcon, data.icon, '', noisePoint);
          var noiseMarker = noise.marker;

          //var windowTemplate = noise.windowTemplate;
          // Bind noise point data to the marker:
          noiseMarker.setData(data);

          return noiseMarker;
        }
      };

      // Helper function for getting a random point from a cluster object
      var getRandomDataPoint = function(cluster) {
        var dataPoints = [];

        // Iterate through all points which fall into the cluster and store references to them
        cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));

        var bounds = cluster.getBounds();

        if(bounds) {
          setViewBounds(bounds, cluster.getMaxZoom());

        }

        // Randomly pick an index from [0, dataPoints.length) range
        // Note how we use bitwise OR ("|") operator for that instead of Math.floor
        return dataPoints[Math.random() * dataPoints.length | 0];
      }

      $scope.mapObject.addEventListener('mapviewchangeend', function() {
        $scope.refreshMarkers();
      });
  };

  'use strict';
  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:markerIcon
   * @description
   * # markerIcon
   */
  angular
    .module('angular-here-maps')
    .directive('markerIcon', [markerIcon]);

    function markerIcon() {

      // Definition of directive
      var markerIconObject = {
        scope: true,
        link: link
      };
      
      function link(scope, elem, attrs) {
          elem.addClass('marker');
          scope.id = attrs.id;    
      };

      return markerIconObject;
    };

  'use strict';
  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:clusterIcon
   * @description
   * # clusterIcon
   */
  angular
    .module('angular-here-maps')
    .directive('clusterIcon', [clusterIcon]);

    function clusterIcon() {

      // Definition of directive
      var clusterIconObject = {
        scope: true,
        link: link
      };
      
      function link(scope, elem, attrs, mapController) {
        elem.addClass('cluster-marker');
        scope.id = attrs.id;

      };

      return clusterIconObject;
    };
  
  'use strict';

  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:marker
   * @description
   * # marker
   */
  angular
    .module('angular-here-maps')
    .directive('marker', [marker]);

    function marker() {

      // Definition of directive
      var markerObject = {
        require: '^map',
        scope: {
          coordinates: '=',
          icon: '=',
          zIndex: '='
        },
        restrict: 'E',
        link: link
      };
      
      function link(scope, element, attrs, mapController) {
          var icon = scope.icon || '';
          var coordinates;
          var group;

          scope.addMarker = function() {
            if (scope.coordinates) {
              coordinates = scope.coordinates;
              group = mapController.addMarkerToMap(scope.coordinates, scope.zIndex, icon);

            }
          };

          scope.$watch('coordinates', function() {
            if (coordinates) {
              mapController.removeMarker(group);
            }
            scope.addMarker();
          });    
      };

      return markerObject;
    };

  'use strict';

  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:markers
   * @description
   * # markers
   */
   angular
    .module('angular-here-maps')
    .directive('markers', [markers]);

    function markers() {

      // Definition of directive
      var markersObject = {
        restrict: 'E',
        require: '^map',
        scope: {
          locations: '=',
          icon: '=',
          zIndex: '=',
          clusterIcon: '=',
          markerObj: '='
        },
        link: link
      };
      
      function link(scope, element, attrs, mapController) {
          scope.addMarkers = function() {
            if (scope.locations) {
                if(scope.locations.length === 1) {
                    mapController.startClustering(scope.locations, scope.zIndex, scope.icon, 'markers', true);//singleMarker flg
                } else {
                    mapController.startClustering(scope.locations, scope.zIndex, scope.icon, 'markers');
                }
            }
          };

          scope.$watch('locations', function() {
            scope.addMarkers();
          });   

          scope.$watch('markerObj', function() {
            if(!_.isEmpty(scope.markerObj)) {
              mapController.openBubble(scope.markerObj);
            }
            
          });    
      };

      return markersObject;
    };

  'use strict';
  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:templateMarker
   * @description
   * # templateMarker
   */
  angular
    .module('angular-here-maps')
    .directive('templateMarker', [templateMarker]);

    function templateMarker() {

      // Definition of directive
      var templateMarkerObject = {
        scope: true,
        link: link,
        templateUrl: templateUrl
      };
      
      function link(scope, elem, attrs) {
        scope.id = attrs.id;
      };

      function templateUrl(tElement, tAttrs) {
        tElement.addClass('marker');
        return tAttrs.templateurl;
      };

      return templateMarkerObject;
    };

  'use strict';
  /**
   * @ngdoc directive
   * @name angular-here-maps.directive:templateWindow
   * @description
   * # templateWindow
   */
  angular
    .module('angular-here-maps')
    .directive('templateWindow', ['$timeout',templateWindow]);

    function templateWindow($timeout) {

      // Definition of directive
      var templateWindowObject = {
        scope: true,
        require: '^map',
        link: link,
        templateUrl: templateUrl
      };
      
      function link(scope, elem, attrs, mapController) {
        elem.on("click touch",".next", function (event) {//next    
          $timeout(function() {
              mapController.onClusterNextClick();   
          }, 100);    
                                    
        });
        elem.on("click touch",".prev", function (event) {//prev
          $timeout(function() {
              mapController.onClusterPrevClick();  
          }, 100); 
        });
        scope.objVal = {};
        for (var prop in attrs.$attr) {
            if(!(attrs[prop] instanceof Object)) {
                if(prop == "objKey") {
                    scope[prop] = attrs[prop];
                } else if(prop == "enableBottom") {
                    scope[prop] = Boolean(attrs[prop]);
                } else if(prop == "enableNextPrev" ||
                          prop == "enableNext" || 
                          prop == "enablePrev" ||
                          prop == "number" ||
                          prop == "total") {
                    scope[prop] = attrs[prop];
                } else {
                    scope.objVal[prop.substring(0,1).toUpperCase() + prop.substring(1,prop.length)] = attrs[prop];
                }
            }            
        }

      };

      function templateUrl(tElement, tAttrs) {
          return tAttrs.templateurl;
      };

      return templateWindowObject;
    };

})(window, window.angular, window._);
