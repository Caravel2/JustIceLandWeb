
(function(angular) {
 
angular.module('GameEnviroment')
.directive('dirGoogleMap',['$timeout','$document','$window','$rootScope','$log','serGoogleMapLoaderPromise','serProtagonist',function($timeout,$document,$window,$rootScope,$log,serGoogleMapLoaderPromise,serProtagonist){



    var link = function(scope, element, attrs) {
        serGoogleMapLoaderPromise.then(function(){
            var map, infoWindow, currentAltitude, 
                marker_francis_underwood,
                marker_peter_russo,
                marker_remy_danton,
                marker_linda_vasquez,
                marker_jim_matthews,
                marker_garrett_walker,
                marker_douglas_stamper,
                marker_christina_poster,
                marker_adam_galloway,
                marker_RadiationWarning;
            var markers = [];
            var originCentralLat = 22.617;
            var originCentralLng = 120.306;
            var maxInitZoom = 16;
            // map config
            var mapOptions = {
                center: new google.maps.LatLng(22.617, 120.306),
                // zoom: 15,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                keyboardShortcuts: false,
            };


            var styles = [
                {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": [
                        {
                            "invert_lightness": true
                        },
                        {
                            "saturation": 10
                        },
                        {
                            "lightness": 30
                        },
                        {
                            "gamma": 0.5
                        },
                        {
                            "hue": "#435158"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#89c0eb"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#405769"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#232f3a"
                        }
                    ]
                },{
                    "featureType": "poi.business",
                    "elementType": "labels",
                    "stylers": [
                      { "visibility": "off" }
                    ]
                }
            ];

            var styledMap = new google.maps.StyledMapType(styles,{name: "iron man Map"});
            
            // init the map
            function initMap() {
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                    map.setOptions({styles: styles});
                    appendZoomChangedListener(map);
                }
            }    


            // the smooth zoom function
            function smoothZoom (map, max, cnt) {

                if (cnt >= max) {
                        return;
                    }
                else {
                    z = google.maps.event.addListener(map, 'zoom_changed', function(event){
                            google.maps.event.removeListener(z);
                            smoothZoom(map, max, cnt + 2);
                            scope.changeZoomInfo({zoomInfo:cnt+2});
                            currentAltitude = calAltitude(originCentralLat,cnt+2)
                            scope.showAltitude({altitude:currentAltitude});
                            // console.log("currentAltitude",currentAltitude);
                    });


                    $timeout(function(){
                        $timeout(function(){
                            map.setZoom(cnt);
                        },1);
                    },800,false);

                }
            } 

            function calAltitude( latitude, zoomlevel )
            {
                /*
                The distance represented by one pixel (S) is given by

                    S = C * cos( latitude )/ 2 ^ zoomlevel

                where 
                latitude: is the latitude of where you're interested in the scale.
                zoomlevel: is the zoom level ( typically a value between 0 & 21 )
                and     
                C is the (equatorial) circumference of the Earth
                EARTH_RADIUS = 6378137 ( earth radius in meters )
                //*/

                var EARTH_RADIUS = 6378137;
                var latitudePI = (latitude/180)*Math.PI;

                var C = Math.PI * 2 * EARTH_RADIUS;
                // console.log("zoomlevel",zoomlevel)
                // console.log("Math.cos( latitude )",Math.cos( latitudePI ))
                return 20*( C * Math.cos( latitudePI ) / Math.pow( 2, zoomlevel ) );

            }

            function addDomListener(){
                google.maps.event.addDomListener($document[0], 'keydown', function(e){ //must use $document[0]
                    // $log.log("center_changed",event);
                    //keypress is useless on arrow key.
                    var keyCode = e.keyCode;
                    // $log.log("code",e);
                    // $log.log("code",keyCode);
                    triggerKinematicsFrame("protagonist",keyCode);

                });
            }

            function triggerKinematicsFrame(who,keyCode){
                scope.triggerKinematicsFrame({who:who,keyCode:keyCode});
            }

            function fromLatLngToPoint(latLng, map) {
                var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
                var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
                var scale = Math.pow(2, map.getZoom());
                var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
                return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
            }
        

            // place a marker
            function setMarker(map, position, title, content,url_head,url_body) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    visible: false,
                    icon: {
                        url:url_head,
                        scaledSize: new google.maps.Size(55,55)
                    }
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                // $log.log("marker",marker);
                
                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });

                map.addListener('center_changed', function() {

                    // $log.log("map.getCenter()",map.getCenter());
                    var centerPoint = fromLatLngToPoint(map.getCenter(),map);
                    // $log.log("Center point",centerPoint);
                    var detection = straightLine(centerPoint,marker);
                    $log.log("map.getCenter()",detection,marker);
                    if(detection){
                    
                        if (infoWindow !== void 0) {
                            infoWindow.close();
                        }
                        // create new window
                        var infoWindowOptions = {
                            content: content,
                            maxWidth:250
                        };
                        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                        infoWindow.open(map, marker);
                    }


                });

                // marker.addListener('mouseover', function() {
                google.maps.event.addListener(marker, 'mouseover', function () {
                    $log.log("mouseup");
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: title,
                        // maxWidth:250
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);


                });

                return marker;
            }

            function setMovingMapCenterEventListener(){
                scope.$on('moving-map-center',function(event,data){
                    // $log.log("event",event);
                    // $log.log("data",data);
                    map.panBy(data.direction.componentDisplacementX,data.direction.componentDisplacementY);
                    // map.panBy(5,-0);
                });
            }

            function appendZoomChangedListener(map){
              // var infowindow = new google.maps.InfoWindow({
              //   content: 'Change the zoom level',
              //   position: new google.maps.LatLng(22.617, 120.306)
              // });
              // infowindow.open(map);
              map.addListener('zoom_changed', function() {
                infowindow.setContent('Zoom: ' + map.getZoom());

                if(map.getZoom()>=13 && map.getZoom()<17){
                    // map.getIcon().scaledSize;
                    // $log.log("M",map.getZoom());
                    marker_francis_underwood.setVisible(true);
                    marker_peter_russo.setVisible(true);
                    marker_remy_danton.setVisible(true);
                    marker_linda_vasquez.setVisible(true);
                    marker_jim_matthews.setVisible(true);
                    marker_garrett_walker.setVisible(true);
                    marker_douglas_stamper.setVisible(true);
                    marker_christina_poster.setVisible(true);
                    marker_adam_galloway.setVisible(true);
                    marker_RadiationWarning.setVisible(true);


                    // $log.log("marker_francis_underwood.getIcon().scaledSize",marker_francis_underwood.getIcon().scaledSize);
                }else if(map.getZoom()>=17){
                    // $log.log("S",map.getZoom());
                    marker_francis_underwood.getIcon().scaledSize.height =60;
                    marker_francis_underwood.getIcon().scaledSize.width =45;
                    marker_francis_underwood.setVisible(true);

                    marker_peter_russo.getIcon().scaledSize.height =60;
                    marker_peter_russo.getIcon().scaledSize.width =45;
                    marker_peter_russo.setVisible(true);

                    marker_remy_danton.getIcon().scaledSize.height =60;
                    marker_remy_danton.getIcon().scaledSize.width =45;
                    marker_remy_danton.setVisible(true);

                    marker_linda_vasquez.getIcon().scaledSize.height =60;
                    marker_linda_vasquez.getIcon().scaledSize.width =45;
                    marker_linda_vasquez.setVisible(true);

                    marker_jim_matthews.getIcon().scaledSize.height =60;
                    marker_jim_matthews.getIcon().scaledSize.width =45;
                    marker_jim_matthews.setVisible(true);

                    marker_garrett_walker.getIcon().scaledSize.height =60;
                    marker_garrett_walker.getIcon().scaledSize.width =45;
                    marker_garrett_walker.setVisible(true);

                    marker_douglas_stamper.getIcon().scaledSize.height =60;
                    marker_douglas_stamper.getIcon().scaledSize.width =45;
                    marker_douglas_stamper.setVisible(true);

                    marker_christina_poster.getIcon().scaledSize.height =60;
                    marker_christina_poster.getIcon().scaledSize.width =45;
                    marker_christina_poster.setVisible(true);

                    marker_adam_galloway.getIcon().scaledSize.height =60;
                    marker_adam_galloway.getIcon().scaledSize.width =45;
                    marker_adam_galloway.setVisible(true);

                    marker_RadiationWarning.getIcon().scaledSize.height =60;
                    marker_RadiationWarning.getIcon().scaledSize.width =45;
                    marker_RadiationWarning.setVisible(true);
                    
                }else{
                    // $log.log("L",map.getZoom());
                    marker_francis_underwood.setVisible(false);
                    marker_peter_russo.setVisible(false);
                    marker_remy_danton.setVisible(false);
                    marker_linda_vasquez.setVisible(false);
                    marker_jim_matthews.setVisible(false);
                    marker_garrett_walker.setVisible(false);
                    marker_douglas_stamper.setVisible(false);
                    marker_christina_poster.setVisible(false);
                    marker_adam_galloway.setVisible(false);
                    marker_RadiationWarning.setVisible(false);
                }
              });
            }

            function straightLine(centerPoint,markerTarget){
                var detectDistance = 150;
                var detectDistancePow2 = Math.pow(detectDistance,2);
                // $log.log("straightLine",straightLine);
                // $log.log("straightLine",markerTarget.getPosition().lat());
                // $log.log("straightLine",markerTarget.getPosition().lng());
                var markerTargetPoint = fromLatLngToPoint(markerTarget.getPosition(),map);
                // $log.log("markerTarget point",markerTargetPoint);

                var distancePow2 = Math.pow(centerPoint.x-markerTargetPoint.x,2) + Math.pow(centerPoint.y-markerTargetPoint.y,2);
                if(distancePow2>detectDistancePow2){
                    // $log.log("detection false",distancePow2);
                    return false;
                }else if(distancePow2<=detectDistancePow2){
                    // $log.log("detection true",distancePow2);
                    return true;
                }
            }

            function genHeatPoint(centerLatLng){
                // $log.log("genHeatPoint");
                var latitude = centerLatLng.lat() + Math.random()*0.01;
                var longitude = centerLatLng.lng() + Math.random()*0.01;
                // $log.log("genHeatPoint",latitude,longitude);
                return new google.maps.LatLng(latitude, longitude);
                // return new google.maps.LatLng(latitude, longitude);
            }

            function genHeatMap(){
                var amount_HeatPoint = 500;
                var heatmapData = [];
                for(var index=0;index<amount_HeatPoint;index++){
                    heatmapData.push(genHeatPoint(new google.maps.LatLng(22.506868, 120.399160)));
                }
                // $log.log("genHeatPoint",heatmapData);
                heatmap = new google.maps.visualization.HeatmapLayer({
                  data: heatmapData,
                  radius: 15,
                  dissipating: true
                });
                heatmap.setMap(map);

                marker_RadiationWarning = initMarker(map, new google.maps.LatLng(22.506868+0.005, 120.399160+0.005), 'Radiation Warning', 'Radiation Warning: GET OUT or BE DEAD!', '/img/640px-Radiation_warning_symbol.png','/img/640px-Radiation_warning_symbol.png');

            }

            function initMarker(map, position, title, says,url_head,url_body){
                var content_url = '<img height="165" src="'+url_body+'" alt="">  ';
                var content = '<div id="InfoWindow"><p>'+says+'</p>'+content_url+'</div>';


                var marker = setMarker(map, position, title, content,url_head);
                // appendMarker(marker,content);

                return marker;
            }
            
            // show the map and place some markers
            initMap();
            smoothZoom(map, maxInitZoom, map.getZoom());
            addDomListener();
            setMovingMapCenterEventListener();

            marker_francis_underwood = initMarker(map, new google.maps.LatLng(22.620788, 120.312090), 'Frank Underwood', 'Bad, For the Greater Good.', '/img/francis-underwood/head-house-of-cards-francis-underwood.png','/img/francis-underwood/man-house-of-cards-francis-underwood.png');
            marker_peter_russo = initMarker(map, new google.maps.LatLng(22.503379, 120.386095), 'Peter Russo', 'Works Hard... Plays Even Harder.', '/img/Peter_Russo/head-Peter_Russo.png','/img/Peter_Russo/Peter_Russo.png');
            marker_remy_danton = initMarker(map, new google.maps.LatLng(22.613558, 120.299624), 'Remy Danton', 'Could the Impossible Be in His Grasp.', '/img/Remy_Danton/head-Remy-Danton.png','/img/Remy_Danton/Remy-Danton.png');
            marker_linda_vasquez = initMarker(map, new google.maps.LatLng(22.645953, 120.313882), 'Linda Vasquez', 'Tougher Than Rawhide and Mean As a Snake.', '/img/Linda_Vasquez/head-Linda_Vasquez.png','/img/Linda_Vasquez/Linda_Vasquez.png');
            marker_jim_matthews = initMarker(map, new google.maps.LatLng(22.640773, 120.287541), 'Jim Matthews', 'Wishes You Would Listen to Just One Thing He Says.', '/img/Jim_Matthews/head-Jim_Matthews.png','/img/Jim_Matthews/Jim_Matthews.png');
            marker_garrett_walker = initMarker(map, new google.maps.LatLng(22.685230, 120.305035), 'Garrett Walker', 'The Most Powerful Man In The Free World...or So The Saying Goes.', '/img/Garrett_Walker/head-Garrett_Walker.png','/img/Garrett_Walker/Garrett_Walker.png');
            marker_douglas_stamper = initMarker(map, new google.maps.LatLng(22.612269, 120.322399), 'Douglas Stamper', 'Absolute LoyaLty is a Dish Best Plated Cold.', '/img/douglas_stamper/head-douglas-stamper.png','/img/douglas_stamper/douglas-stamper.png');
            marker_christina_poster = initMarker(map, new google.maps.LatLng(22.547239, 120.322195), 'Christina Poster', 'Can Loving The Right Man Be All Wrong?', '/img/christina_poster/head-christina-poster.png','/img/christina_poster/christina-poster.png');
            marker_adam_galloway = initMarker(map, new google.maps.LatLng(22.660127, 120.358736), 'Adam Galloway', 'Lust Can Be Costly, It Never Comes Free', '/img/Adam_Galloway/Head-Adam-Galloway.png','/img/Adam_Galloway/Adam_Galloway.png');


            
            genHeatMap();
        });
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope:{
            changeZoomInfo: '&',
            showAltitude: '&',
            triggerKinematicsFrame: '&'
        },
        link: link
    };


}]);
})(window.angular);




