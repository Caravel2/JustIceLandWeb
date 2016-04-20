
(function(angular) {
 
angular.module('GameEnviroment')
.directive('dirProtagonist',['$log','$window','serProtagonist',function($log,$window,serProtagonist){

    function getRotationDegrees(element) {
      var matrix = $window.getComputedStyle(element).transform;
      // $log.log("matrix",matrix);
      if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
      } else { var angle = 0; }
      return (angle < 0) ? angle +=360 : angle;
    }

    function initialProtagonist(element){
        arr_img_childElement = element.find("img");
        serProtagonist.setHeadOrientation(getRotationDegrees(arr_img_childElement[0]));
    }

    // function nonlinearAcceleration(){

    // }

    // function linearAcceleration(acceleration){
    //     return acceleration;
    // }

    // function uniformAcceleration(old_acceleration){
    //     serProtagonist.setAcceleration(old_acceleration);
    //     return old_acceleration;
    // }

    // function accelerate2Velocity(){
    //     var accelerationDirection;
    //     var time_frame = 1;
    //     var old_velocity = serProtagonist.getVelocity();
    //     var old_acceleration = serProtagonist.getAcceleration();

    //     accelerationDirection = serProtagonist.getAccelerationDirection();
    //     var new_acceleration = uniformAcceleration(Math.abs(old_acceleration))*accelerationDirection;
    //     // $log.log("accelerate2Velocity: accelerationDirection",accelerationDirection);
    //     // $log.log("accelerate2Velocity: new_acceleration",new_acceleration);

        
    //     serProtagonist.setAcceleration(new_acceleration);

    //     var new_velocity = old_velocity + new_acceleration*time_frame;

    //     serProtagonist.setVelocity(new_velocity);
    // }

    // function Kinematics(accelerateDirection){
    //     // $log.log("Kinematics",accelerateDirection);
    //     serProtagonist.setAccelerationDirection(accelerateDirection);
    //     accelerate2Velocity();
    //     var velocity = serProtagonist.getVelocity();
    //     var absAcceleration = serProtagonist.getAcceleration();
    //     var time_frame = 1;

    //     var acceleration = absAcceleration*accelerateDirection;
    //     // $log.log("Kinematics: acceleration",absAcceleration);
    //     $log.log("Kinematics: velocity",velocity);
    //     return velocity*time_frame + (1/2)*acceleration*Math.pow(time_frame,2);
    // }

    function moveUniformVelocity(vector){
        var time_frame = 1;
        var absVelocity = serProtagonist.getAbsVelocity();
        velocity = absVelocity*vector;

        // $log.log("vector",vector);
        // $log.log("velocity",velocity);
        // $log.log("absVelocity",absVelocity);
        return velocity*time_frame;
    }

    function genDisplacement(throttleType){
        var componentDisplacementX,//North
            componentDisplacementY,//East
            displacement;

        if(throttleType == 'forward'){
            // displacement = Kinematics(1);
            displacement = moveUniformVelocity(1);
        }else if(throttleType == 'backward'){
            // displacement = Kinematics(-1);
            displacement = moveUniformVelocity(-1);
        }

        var rotatedDegree = serProtagonist.getHeadOrientation();
        

        componentDisplacementY = -displacement*Math.cos((rotatedDegree/360)*2*Math.PI);
        componentDisplacementX = displacement*Math.sin((rotatedDegree/360)*2*Math.PI);

        // $log.log("Math.cos(rotatedDegree/(2*Math.PI)",Math.cos((rotatedDegree/360)*2*Math.PI));
        // $log.log("rotatedDegree",rotatedDegree);
        // $log.log("displacement",displacement);
        // $log.log("componentDisplacementX",componentDisplacementX);
        // $log.log("componentDisplacementY",componentDisplacementY);    

        return {componentDisplacementX:componentDisplacementX,componentDisplacementY:componentDisplacementY};

    }

    function accelerateCharactr(keyCode){
        if (keyCode == 69){
            // increase speed, "E" key
            // $log.log("motionCharactr: increase");
            serProtagonist.increaseVelocity();
            // $log.log("motionCharactr: increase",serProtagonist.getAbsVelocity());
        }else if(keyCode ==81){
            // reduce speed, "Q" key
            // $log.log("motionCharactr: decrease");
            serProtagonist.decreaseVelocity();
            // $log.log("motionCharactr: increase",serProtagonist.getAbsVelocity());
        } 
    }

    function motionCharactr(keyCode){
        var displacement;
        if (keyCode == 38 || keyCode == 87 ){
            // forward, up arrow or "w" key
            // $log.log("motionCharactr: forward");
            displacement = genDisplacement('forward');
        }else if(keyCode ==40 || keyCode == 83){
            // backward, down arrow or "S" key
            // $log.log("motionCharactr: backward");
            displacement = genDisplacement('backward');
        }
        // $log.log("displacement",displacement);

        return displacement;
    }

    function rotateCharactr(keyCode){
        var angleDiff = 0;
        var characterHeadOrientation;
        characterHeadOrientation = serProtagonist.getHeadOrientation();
        
        // $log.log("serProtagonist getHeadOrientation",serProtagonist.getHeadOrientation());

        if(keyCode == 39 || keyCode == 68){
            //turn right using right arrow key or "D" key
            angleDiff = 10;
        }else if(keyCode ==37 || keyCode == 65){
            //turn left using left arrow key or "A" key
            angleDiff = -10;
        }
        // $log.log("dirGoogleMap rotateCharacter",angleDiff);
        serProtagonist.setAngleDiff(angleDiff);
        return angleDiff;
        
    }

    function keyDistinguish(keyCode){
        // $log.log("keyDistinguish",keyCode);
        var keyEventType;
        if(keyCode == 39 || keyCode == 68 || keyCode ==37 || keyCode == 65){
            //rotate obj
            keyEventType = 'rotation';
        }else if (keyCode == 38 || keyCode == 87 || keyCode ==40 || keyCode == 83){
            //motion obj
            keyEventType = 'motion';
        }else if (keyCode == 69 || keyCode == 81 ){
            //accelerate obj
            keyEventType = 'acceleration';
        }
        return keyEventType;
    }

    var name = 'protagonist';
    var arr_img_childElement,angleDiff;

    var link = function(scope, element, attrs) {

        initialProtagonist(element);

        scope.$on('moving-protagonist',function(event,data){
            arr_img_childElement = element.find("img");
            var keyCode = data.keyCode;
            var keyEventType;

            keyEventType = keyDistinguish(keyCode);

            if(keyEventType == 'rotation'){
            // $log.log("event",event);
            // $log.log("data",data);
            // $log.log("element",element.find("img").css("transform"));
            // $log.log("element",$window.getComputedStyle(element.find("img")[0]).transform);
            // $log.log("element",getRotationDegrees(img_childElement[0]));
            // $log.log("img_childElement",element.find("img"));

            // $log.log("serProtagonist getHeadOrientation",serProtagonist.getHeadOrientation());
                angleDiff = rotateCharactr(keyCode);
                var rotatedDegree = getRotationDegrees(arr_img_childElement[0]) + angleDiff;
                serProtagonist.setHeadOrientation(rotatedDegree);
                arr_img_childElement.css({'transform': 'rotate('+ rotatedDegree +'deg)'});

            }else if(keyEventType == 'motion'){
                var displacement = motionCharactr(keyCode);
                scope.movingMapCenter({displacement:displacement});
            }else if(keyEventType == 'acceleration'){
                accelerateCharactr(keyCode);
            }
            
        });


    };
    
    return {
        restrict: 'A',
        replace: true,
        scope:{
            movingMapCenter:'&'
        },
        link: link
    };


}]);
})(window.angular);




