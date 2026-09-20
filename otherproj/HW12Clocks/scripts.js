var shouldIRemove=true;
var myClock;
var myStop;

var existingPars = document.querySelectorAll('#clockspot p');

    



var clockSpot = document.getElementById('clockspot');

var clockInsert = document.createElement('h1');


function switchToClock(){
    if(shouldIRemove == true){
        clockSpot.removeChild(existingPars[0]);
        shouldIRemove=false;
    }   

    clearInterval(myStop);

    myClock = setInterval (function() {
        var currTime = new Date();
        var currHour = currTime.getHours();
        var currMin = currTime.getMinutes();
        var currSec = currTime.getSeconds();
        var currTimePretty;
        if (currMin<10){
            currTimePretty = currHour+":0"+currMin;
        } else{
            currTimePretty = currHour+":"+currMin;
        }

        if (currSec<10){
            currTimePretty = currTimePretty+":0"+currSec;
        } else{
            currTimePretty = currTimePretty+":"+currSec;
        }



        clockInsert.innerHTML= currTimePretty;
        clockSpot.appendChild(clockInsert);
        
    }, 1000);
}


var stopHour = 0;
var stopMin = 0;
var stopSec = 0;
var stopPretty = 0;


function startStopwatch(){
    if(shouldIRemove == true){
        clockSpot.removeChild(existingPars[0]);
        shouldIRemove=false;
    }   
    clearInterval(myClock);
    

    myStop = setInterval (function() {

        if (stopMin<10){
            stopPretty = stopHour+":0"+stopMin;
        } else{
            stopPretty = stopHour+":"+stopMin;
        }

        if (stopSec<10){
            stopPretty = stopPretty+":0"+stopSec;
        } else{
            stopPretty = stopPretty+":"+stopSec;
        }

        stopSec++;
        if (stopSec>59){
            stopMin++;
            stopSec=0;
        }

        if (stopMin>59){
            stopHour++;
            stopMin=0;
        }


        clockInsert.innerHTML= stopPretty;
        clockSpot.appendChild(clockInsert);
    }, 1000)


}


function stopStopwatch(){
    if(shouldIRemove == true){
        clockSpot.removeChild(existingPars[0]);
        shouldIRemove=false;
    }

    clearInterval(myClock);
    clearInterval(myStop);

}

function resetStopwatch(){
    if(shouldIRemove == true){
        clockSpot.removeChild(existingPars[0]);
        shouldIRemove=false;
    }
    clearInterval(myClock);
    clearInterval(myStop);
    stopHour = 0;
    stopMin = 0;
    stopSec = 0;
    
    if (stopMin<10){
        stopPretty = stopHour+":0"+stopMin;
    } else{
        stopPretty = stopHour+":"+stopMin;
    }

    if (stopSec<10){
        stopPretty = stopPretty+":0"+stopSec;
    } else{
        stopPretty = stopPretty+":"+stopSec;
    }

    stopSec++;
    if (stopSec>59){
        stopMin++;
        stopSec=0;
    }

    if (stopMin>59){
        stopHour++;
        stopMin=0;
    }


    clockInsert.innerHTML= stopPretty;
    clockSpot.appendChild(clockInsert);

}


