
(function(angular) {
 
angular.module('GameEnviroment')
.factory('serProtagonist',['$log','$window',function($log,$window){

    var headOrientation;
    var angleDiff = 0;
    var absVelocity = 20;
    var velocityDirection = 0;
    var velocity = 0;
    var absAcceleration = 1.5;
    var accelerationDirection = 0;
    var acceleration = 0;
    var max_absVelocity = 40;
    var min_absVelocity = 5;


    return {
        getHeadOrientation: function(){
            return headOrientation;
        },
        setHeadOrientation: function(new_headOrientation){
            headOrientation = new_headOrientation;
        },
        getAngleDiff: function(){
            return angleDiff;
        },
        setAngleDiff: function(new_angleDiff){
            angleDiff = new_angleDiff;
        },
        getVelocity: function(){
            return velocity;
        },
        setVelocity: function(new_velocity){
            velocity = new_velocity;
        },
        getAbsVelocity: function(){
            return absVelocity;
        },
        setAbsVelocity: function(new_absVelocity){
            absVelocity = new_absVelocity;
        },
        getAbsAcceleration: function(){
            return absAcceleration;
        },
        setAbsAcceleration: function(new_absAcceleration){
            absAcceleration = new_absAcceleration;
        },
        getAccelerationDirection: function(){
            return accelerationDirection;
        },
        setAccelerationDirection: function(new_accelerationDirection){
            accelerationDirection = new_accelerationDirection;
        },
        increaseVelocity: function(){
            absVelocity = absVelocity + Math.pow(absAcceleration,1.4);
            if(absVelocity>=max_absVelocity){
                absVelocity = max_absVelocity;
            }
        },
        decreaseVelocity: function(){
            absVelocity = absVelocity - Math.pow(absAcceleration,1.4);
            if(absVelocity<min_absVelocity){
                absVelocity = min_absVelocity;
            }
        }

    };

}]);
})(window.angular);




