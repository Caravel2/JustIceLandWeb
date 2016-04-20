
(function(angular) {
 
angular.module('GameEnviroment')
.controller('ctrlGame',['$log','$scope','$timeout',function($log,$scope,$timeout){

    var self = this;

    var countDownAltitude;

    var private_zoomInfo = 0;

    var private_ProtagonistDiffOrientation;

    // self.ZoomInfo = 'DEFAULT';
    self.zoomInfo = private_zoomInfo;
    self.altitude = '9999999999';

    self.ProtagonistDiffOrientation = private_ProtagonistDiffOrientation;


    self.triggerKinematicsFrame = function(who,keyCode){
        // $log.log('ctrlGame rotateCharacter',who);
        // $log.log('ctrlGame rotateCharacter',angleDiff);
        if(who == "protagonist"){
            // private_ProtagonistOrientation
            // $log.log('ctrlGame rotateCharacter broadcast');
            $scope.$broadcast('moving-protagonist',{keyCode:keyCode});

        }
    };

    self.changeZoomInfo = function(zoomInfo){
        private_zoomInfo = zoomInfo;
        self.zoomInfo = private_zoomInfo;
        self.countDown();
        // console.log("ZoomInfo",self.ZoomInfo);
        // if(zoomInfo >= 14){
        //     // console.log("countDownStop");
        //     self.countDownStop();
        // }
    };

    self.showAltitude = function(altitude){
        self.altitude = altitude;
        // console.log("altitude",self.altitude);
    };

    self.countDown = function(){
        countDownAltitude = $timeout(function(){
            self.altitude = self.altitude - 9;
            if(private_zoomInfo < 14){
                // console.log("countDownStop",private_zoomInfo);
                self.countDown();
            }
            
        },1);
    };

    self.countDownStop = function(){
        // console.log("countDownStop",countDownAltitude);
        $timeout.cancel(countDownAltitude);
    };

    self.movingMapCenter = function(direction){
        $scope.$broadcast('moving-map-center',{direction:direction});
    };

    self.countDown();

}]);
})(window.angular);




