
(function(angular) {
 
angular.module('GameEnviroment',[])
.factory('serGoogleMapLoaderPromise',['$q','$rootScope','$window',function($q,$rootScope,$window){
    var deferred = $q.defer();

    // init the map
    function initialize() {
        deferred.resolve();
    }    

    google.maps.event.addDomListener($window, "load", initialize);
    return deferred.promise;

}]);
})(window.angular);




