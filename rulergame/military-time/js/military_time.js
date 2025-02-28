// Vernier Caliper
// 2022.09

var session_prefix ="military_clock_"
var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
var levelcounter;
var score;
var level;
var strikes;
var gameTimer;
var gameover = true;
var randomQuestion;
var previousQuestion;
var secs;
var allowMovement = false;
var stgRulerLength = 10;
var stgRulerPrecision = 10;
var sentScore = false



var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+"stgTimer");
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+"stgSounds");
var stgQuestionType = admin_settings['stgQuestionType']?admin_settings['stgQuestionType']:sessionStorage.getItem(session_prefix+"stgQuestionType");
var stgTimezone = admin_settings['stgTimezone']?admin_settings['stgTimezone']:sessionStorage.getItem(session_prefix+"stgTimezone");

var stgMode = "Trainer";

var stage=new createjs.Stage("myCanvas");

var hour_type=12;
var hour = 6;
var minute = 00;
var timezone_value = 0;

var xOffset = stage.canvas.width / 2;
var yOffset = stage.canvas.height / 2;
var clockRadius = (stage.canvas
.width > stage.canvas.height ? stage.canvas.height : stage.canvas.width) * 1.6 / 4;
var clockBorderWidth = clockRadius / 10;
//var clockBorderColor = "rgb(50, 150, 50)";
var clockBorderColor = "rgb(0, 0, 0)";

var hourScaleLen = clockRadius / 11;
var minuteScaleLen = clockRadius / 13;
//var scaleColor = "rgb(20, 100, 20)";
var scaleColor = "rgb(0, 0, 0)";

var hourHandLen = clockRadius * 2.8 / 5;
var hourHandWidth = 11;
//var hourHandColor = "rgb(0, 0, 255)";
var hourHandColor = "rgb(0, 0, 0)";
var minuteHandLen = clockRadius * 4 / 5;
var minuteHandWidth = 9;
//var minuteHandColor = "rgb(0, 255, 0)";
var minuteHandColor = "rgb(0, 0, 0)";

var windowWidth = $(window).width();;


if (!stgTimer){
    stgTimer = "On";
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
}

if (!stgSounds){
    stgSounds = "On";
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
}

if(!stgMode)
{
    stgMode = "Trainer";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}

if (!stgTimezone) {
    stgTimezone = "Off";
    sessionStorage.setItem(session_prefix+'stgTimezone', stgTimezone);
}
if (!stgQuestionType) {
    stgQuestionType = "Numeric";
    sessionStorage.setItem(session_prefix+'stgQuestionType', stgQuestionType);
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgQuestionType").val(stgQuestionType);
$("#stgTimezone").val(stgTimezone);

document.getElementById("hoursmallControl").readOnly = true;
document.getElementById("minutesmallControl").readOnly = true;

$("#stgTimer").change(function(){
    stgTimer = $("#stgTimer option:selected").val();
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
    
});


$("#stgSounds").change(function(){
    stgSounds = $("#stgSounds option:selected").val();
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
});


$("#stgQuestionType").change(function(){
    stgQuestionType = $("#stgQuestionType option:selected").val();
    sessionStorage.setItem(session_prefix+'stgQuestionType', stgQuestionType);

	hour = 6;
	minute = 00;
	timezone_value = 0;

	check_am_pm(false);
	btnAMPM_Text.text = "AM";

    clock_angles(hour, minute);

});

$("#stgTimezone").change(function(){
    stgTimezone = $("#stgTimezone option:selected").val();
    sessionStorage.setItem(session_prefix+'stgTimezone', stgTimezone);

	hour = 6;
	minute = 00;
	timezone_value = 0;

	check_am_pm(false);
	btnAMPM_Text.text = "AM";
    clock_angles(hour, minute);

    change_timezone_buttons();
});

$("#btnStart").click(function(){
    if(game_id){
        if(!$("#player_name").val()){
            $("#score-error").html("Enter Your Name!")
            $("#score-success").html("")
            return;
        }
        else{
            
            $("#score-error").html("")
            $("#score-success").html("")
        }
    }
    sentScore = false
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess();
})

$(window).resize(function(){
    
    var wwidth = $(window).width();
    if(windowWidth!==wwidth){
        windowWidth = $(window).width();

        endGame();

        strikes = 0;

        $("#txtStrikes").html("<span></span>");
        score = 0;
        $("#txtScore").html("<span></span>");
        level = 0;
        drawLevelCanvas(0);
    }
});

var correctSound = new Sound("./assets/correct-plastic-click.mp3");
var strikeSound = new Sound("./assets/incorrect-plastic-click.mp3");    
var levelupSound = new Sound("./assets/level-up-plastic-click.mp3");
var gameoverSound = new Sound("./assets/game-over-plastic-click.mp3");

$("#txtScore").text("00000");
drawLevelCanvas(1);
drawTimer(0);

function drawLevelCanvas(lvl){
    var c = $("#levelCanvas");
    var ctx = c[0].getContext('2d');
    ctx.canvas.height = 30;
    ctx.canvas.width = 70;
    if(lvl === 0) {
        ctx.clearRect(0,0,30,70);
    } else {
        for(var x=1; x<=10; x++) {
            ctx.fillStyle = "#cccccc";
            if (x<=lvl) {
                ctx.fillStyle = "#000000";
            }
            ctx.fillRect(((x-1)*7)+1, 30-(x*3), 6, x*3);
        }                    
    }
}

function drawTimer(seconds){
    //console.log(seconds);
    var c = $("#timerCanvas");
    var ctx = c[0].getContext('2d');
    ctx.canvas.height = 30;
    ctx.canvas.width = 30;
    ctx.fillStyle = "#339966";
    // if(seconds<6) {ctx.fillStyle = "#ffc107";}
    // if(seconds<3) {ctx.fillStyle = "#f44336";}
    if(seconds<10) {ctx.fillStyle = "#ffc107";}
    if(seconds<6) {ctx.fillStyle = "#f44336";}
    // ctx.fillRect(0, 30-seconds*3, 30, 30);
    ctx.fillRect(0, 30-seconds, 30, 30);
}

function showCheer(){
    var x = Math.floor((Math.random()*(cheers.length)));
    var html = "<div class='cheer animated rubberBand'>" + cheers[x] + "</div>";
    showCheerBoard(html,1000);
}

function showCheerBoard(html,delay){
    allowMovement = false;
    $('#cheerBoard').html(html).show();
    setTimeout(function(){
        $('#cheerBoard').hide();
        allowMovement = true;
        $('#cheerBoard').html("<div></div>");
    },delay);
}

function startTimer() {
    drawTimer(secs);
    if(secs === 0) {
        checkGuess(0);
    }
    else
    {
        secs = secs - 1;
        allowMovement = true;
        timerRunning = true;
        gameTimer = setTimeout(startTimer, 1000);
    }
}      

function Sound(src) {
    // from: https://www.w3schools.com/graphics/game_sound.asp
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}

function checkGuess() {
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);
    if (gameover === true) {
        return false;
    }

    {
        // console.log(hour + " :" + minute + ":" + timezone_value);
        // console.log(randomQuestion.hour + " :" + randomQuestion.minute);
		if (hour == randomQuestion.hour &&
			minute == randomQuestion.minute &&
			btnAMPM_Text.text == randomQuestion.am_pm &&
            (stgTimezone == "Off" || timezone_value == randomQuestion.timezone)) {
			showCheer();
			if (stgSounds === "On"){ correctSound.play() }
			score = score + pointvalue;
			$("#txtScore").text(padScore(score));
			levelcounter = levelcounter + 1;
			checklevel();
			showNewQuestion();
		}
		else {
			doStrike();
		}
    }
}

function doStrike() {
    pause = true;
    //console.log("Doing Strike...");
    if(stgSounds === "On"){strikeSound.play();}
    // strikeSound.play();
    strikes++;
    if (strikes <= 3)
    {
        $("#strikeBoard").append("<img src='images/strike.gif'>");
        $("#txtStrikes").append("<img src='images/strike.gif'>");        
        $("#strikeBoard").show(); 
    }
    
    drawCorrection(randomQuestion);
    //console.log("Delaying...");
    setTimeout(hideStrikeLayer,2500);
    //console.log("After setTimeout");
}    

function drawCorrection(correct){

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();
	
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
    $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + get_time_string(hour, minute, btnAMPM_Text.text, timezone_value) + "</span>").fadeIn();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    if (windowWidth < 500 && stgQuestionType == "Spoken")
        document.getElementsByClassName("questionWrongMeasurement")[0].style.fontSize = "" + (windowWidth / 18) + "px";
    // drawSections = stgRulerLength * stgRulerPrecision;
    // var sectionWidth = (250 * stgRulerLength) / drawSections;
    // var c = $("#playerCanvas");
}


function hideStrikeLayer() {
    pause = false;
    //console.log("Hiding Strike Layer...");
    $("#strikeBoard").hide();
    // clearPlayerCanvas(true);
    if(strikes < 3){
        showNewQuestion();
    } else {
        if(stgSounds === "On"){gameoverSound.play();}
        $("#txtQuestion").hide();
        $("#txtQuestion").html("<span class='gameOver'>Game Over</span><span class='questionMeasurement'>&nbsp;</span>").fadeIn();
        if(game_id && !sentScore){
            // $("#submitScoreBox").slideToggle();
            sendScore(score);
        }
        else{
        }
        setTimeout(endGame,3000);
    }
}

function sendScore(score) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "update_score.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText); // Log the response from PHP
                if(xhr.responseText){
                    var data = JSON.parse(xhr.responseText)
                    if(data.status == "success"){
                        $("#score-success").html(data.msg)
                        $("#score-error").html("")
                    }
                    else{
                        $("#score-error").html(data.msg)
                        $("#score-success").html("")
                    }
                }
                setTimeout(endGame,3000);
            }
        };
        xhr.send("score=" + encodeURIComponent(score) + "&game_id=" + encodeURIComponent(game_id) + "&player_name=" + encodeURIComponent($("#player_name").val()));
        sentScore = 1
}


function endGame() {
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);    
    $("#strikeBoard").hide();
    // clearPlayerCanvas(true);
    drawTimer(0);
    gameover = true;
    $("#buttonBar").fadeIn();
    $("#questionBar").hide();
}   

function checklevel() {
    if ( (levelcounter === 5) && (level < 10) ) {
        if(stgSounds === "On"){levelupSound.play();}
        level = level + 1;
        levelcounter = 0;
        pointvalue = pointvalue + 10;
        drawLevelCanvas(level);
        showCheerBoard("<h1>Level " + level + "</h1>",1000);
    }
}

function clearPlayerCanvas(noFade){
    var c = $("#playerCanvas");
    if(!noFade){ c.hide(); }
    var ctx = c[0].getContext('2d');
    ctx.canvas.height = 100;
    ctx.canvas.width = 100; 
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0, 0, 100, 100);        
    if(!noFade){ c.fadeIn(); }
}

function padScore(num){
    return ("00000" + num).slice(-5);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomTime(maxHour) {
    randHour = randomInt(0, 11);
    randMinute = randomInt(0, 59);
    randAmPm = randomInt(0, 1) == 0 ? "AM" : "PM";
    randTimezone = randomInt(0, 24);

    return {
        hour: randHour,
        minute: randMinute,
        am_pm: randAmPm,
        timezone: randTimezone
    };
}

function showNewQuestion() {
    //console.log("Showing New Question...");
    var html = "";
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    while (randomQuestion == previousQuestion) 
            randomQuestion = randomTime();
	//randomQuestion = randomQuestion / 1000;

    $("#txtQuestion").hide()

	
	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
	html = "<span class='questionInstruction'>Control hands to select</span><br>";
    //////////////////////////////////////////////////////////////////////////////////////////////////

    $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + get_time_string_by_json(randomQuestion) + " </span>").fadeIn();
    if (stgTimer === "On"){
        
        // if( level < 4)
        // {
        //     secs = 40 - 3*(level-1);
        // }
        // else
        // {
        //     secs = 40 - 3*(level-1) - 1;
        // }
        secs = 20 - 2 * (level - 1);
        startTimer()
    }

    if (windowWidth < 500 && stgQuestionType == "Spoken")
        document.getElementsByClassName("questionMeasurement")[0].style.fontSize = "" + (windowWidth / 18) + "px";
	
    $("#hoursmallControl").val(hour % 12 + (randomQuestion.am_pm == "PM" ? 12 : 0));
}


function newGame() {
    $("#preferencesBox").hide();
    $("#buttonBar").fadeOut();
    $("#questionBar").toggle();
    $("#txtScore").text("00000");
    drawTimer(10);        
    drawLevelCanvas(1);
    $("#txtStrikes").html("<span></span>");
    $("#strikeBoard").html("<span></span>");
    pointvalue = 10;
    levelcounter = 0;
    score = 0;
    level = 1;
    strikes = 0;       
    randomQuestion = 0;
    gameover = false;
    allowMovement = true;
    timerRunning = false;
    

    // canvas.addEventListener('touchstart', function(evt) {
    //     if(allowMovement){
    //         touchPos = getTouchPos(canvas, evt);
    //         //console.log(touchPos);
    //         drawPlayer(touchPos);
    //     }
    //   }, false);
    // canvas.addEventListener('touchmove', function(evt) {
    //     if(allowMovement){
    //         touchPos = getTouchPos(canvas, evt);
    //         //console.log(touchPos);
    //         drawPlayer(touchPos);
    //     }
    //   }, false);
    // canvas.addEventListener('touchend', getTouchEnd, false);

    // var defaultPrevent = function(e){ e.preventDefault() };
    // canvas.addEventListener("touchstart", defaultPrevent);
    // canvas.addEventListener("touchmove" , defaultPrevent);
    
    // clearPlayerCanvas(true);
    showNewQuestion();
    
}


$("#btnhourincrement").click(function(){
    //inputType = "Mouse";
    hour_increase();
    check_am_pm(false);
    clock_angles(hour, minute);
    
    $("#hoursmallControl").val(hour % 12 + (randomQuestion.am_pm == "PM" ? 12 : 0));  
	
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnhourdecrement").click(function(){
    //inputType = "Mouse";
    hour_decrease();
    check_am_pm(false);
    clock_angles(hour, minute);
    
	$("#hoursmallControl").val(hour);  

    // DrawThimbleChange()
    
    // newGame();
});

$("#btnminuteincrement").click(function(){
    //inputType = "Mouse";
    minute_increase();
    check_am_pm(false);
    clock_angles(hour, minute);
    
    $("#minutesmallControl").val(minute);  
    
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnminutedecrement").click(function(){
    //inputType = "Mouse";
    minute_decrease();
    check_am_pm(false);
    clock_angles(hour, minute);
    
    $("#minutesmallControl").val(minute);  

    // DrawThimbleChange()
    
    // newGame();
});

function handleTick(event){
    stage.update(event);
    
    var c = $("#myCanvas");
    var ctx = c[0].getContext('2d');
    
    ctx.font = "bold 10px Arial";
    ctx.fillStyle='black';
    outString1(ctx, 250, c[0].height-35, "Timer: " + stgTimer, 0, 0);
    outString1(ctx, 250, c[0].height-25, "Question Type: " + (stgQuestionType=="Spoken"?"Pronounced":stgQuestionType), 0, 0);
    outString1(ctx, 250, c[0].height-15, "Time zone: " + stgTimezone, 0, 0);
}

function init() {
    createjs.Touch.enable(stage,true,false);
    clock1=new clock(xOffset, yOffset, 1);
    createjs.Ticker.timingMode=createjs.Ticker.RAF;
    createjs.Ticker.on("tick",handleTick);
}

function outString1(ctx, x, y, s, x_align, y_align) {
    var fm = ctx.measureText(s);
    var h = 10;//fm.height not supported in browsers

    switch (y_align) {
        case 0:
            y += h;
            break;
        case 1:
            y += h / 2;
            break;
        case 2:
            break;
    }

    switch (x_align) {
        case 0:
            ctx.fillText(s, x + 3, y);
            break;
        case 1:
            ctx.fillText(s, x - fm.width / 2, y);
            break;
        case 2:
            ctx.fillText(s, x - fm.width / 2, y);
            break;
    }
}


var timezone_datas = [
    {name: "Zulu", time:"+00:00"},
    {name: "Alfa", time:"+01:00"},
    {name: "Bravo", time:"+02:00"},
    {name: "Charlie", time:"+03:00"},
    {name: "Delta", time:"+04:00"},
    {name: "Echo", time:"+05:00"},
    {name: "Foxtrot", time:"+06:00"},
    {name: "Golf", time:"+07:00"},
    {name: "Hotel", time:"+08:00"},
    {name: "India", time:"+09:00"},
    {name: "Kilo", time:"+10:00"},
    {name: "Lima", time:"+11:00"},
    {name: "Mike", time:"+12:00"},
    {name: "November", time:"-01:00"},
    {name: "Oscar", time:"-02:00"},
    {name: "Papa", time:"-03:00"},
    {name: "Quebec", time:"-04:00"},
    {name: "Romeo", time:"-05:00"},
    {name: "Sierra", time:"-06:00"},
    {name: "Tango", time:"-07:00"},
    {name: "Uniform", time:"-08:00"},
    {name: "Victor", time:"-09:00"},
    {name: "Whiskey", time:"-10:00"},
    {name: "X-ray", time:"-11:00"},
    {name: "Yankee", time:"-12:00"}
];

var am_pm;
var previous_hour=hour;

/* Widgets */
var minute_hand_container;
var hour_hand_container;
var digital_container;
var digital;
var minute_numbers;
var minute_hand_line;
var minute_hand_circle;
var hour_hand_line;
var hour_hand_circle;
var btnAMPM_Text;
var timezone_button_container;

function change_mode() {
    if(stgMode == "Game"){
        minute_hand_line.visible=false;
        minute_hand_circle.visible=false;
        hour_hand_line.visible=false;
        hour_hand_circle.visible=false;
		digital_container.visible = false;
    }else if (stgMode == "Trainer") {
        minute_hand_line.visible=true;
        minute_hand_circle.visible=true;
        hour_hand_line.visible=true;
        hour_hand_circle.visible=true;
		digital_container.visible = false;
    }
}

function change_timezone_buttons() {
    if (stgTimezone == "On") {
        timezone_button_container.visible = true;
    } else if (stgTimezone == "Off") {
        timezone_button_container.visible = false;
    }
}

function hour_increase(){
    if(hour<hour_type){
        hour++;
    }else{
        hour=1;
    }
    if(hour==hour_type){
        hour=0;
    }
}

function hour_decrease(){
    if(hour>0){
        hour--;
    }else{
        hour=hour_type-1;
    }
}

function minute_increase(){
    minute ++;
    if(minute==60){
        hour_increase();
        minute = 0;
    }
}

function minute_decrease(){
    minute --;
    if(minute < 0){
        hour_decrease();
        minute = 59;
    }
}

function check_am_pm(change_am_pm){
    var change_am_pm=change_am_pm;
    if(!change_am_pm){
        if(previous_hour==11&&hour==0){
            change_am_pm=true;
        }else if(previous_hour==0&&hour==11){
            change_am_pm=true;
        }else if(previous_hour==23&&hour==0){
            change_am_pm=true;
        }else if(previous_hour==0&&hour==23){
            change_am_pm=true;
        }
    }

    if(change_am_pm){
        if(btnAMPM_Text.text=="AM"){
            btnAMPM_Text.text="PM";
			
        }else{
            btnAMPM_Text.text="AM";
        }
		
		
		//am_pm.Text = btnAMPM_Text.text;
    }
	
//	if(am_pm.Text.text=="AM"){
//		am_pm.text="PM";
//		
//	}else{
//		am_pm.text="AM";
//	}
	am_pm.text = btnAMPM_Text.text;
	//console.log(btnAMPM_Text.text + am_pm.text);
}

function set_digital(hour,minute){
    // digital.text = get_time_string(hour, minute);
}

var digit_text_map = {
    0 : "Zero",
    1 : "One",
    2 : "Two",
    3 : "Three",
    4 : "Four",
    5 : "Five",
    6 : "Six",
    7 : "Seven",
    8 : "Eight",
    9 : "Nine",
    10 : "Ten",
    11 : "Eleven",
    12 : "Twelve",
    13 : "Thirteen",
    14 : "Fourteen",
    15 : "Fifteen",
    16 : "Sixteen",
    17 : "Seventeen",
    18 : "Eighteen",
    19 : "Nineteen",
    20 : "Twenty",
    30 : "Thirty",
    40 : "Fourty",
    50 : "Fifty",
    60 : "Sixty",
    70 : "Seventy",
    80 : "Eighty",
    90 : "Ninety"
}

function get_time_string_by_json(show_time) {
    var ret = "";
    if (stgQuestionType == "Numeric") {
        var minute_extra = "";
        if (show_time.minute < 10) {
            minute_extra = "0";
        }
        var hour_extra = "";
        if (show_time.am_pm == "AM" && show_time.hour < 10) {
            hour_extra = "0";
            
            ret = hour_extra+show_time.hour+minute_extra+show_time.minute;
        } else if (show_time.am_pm == "PM") {
            ret = (show_time.hour + 12) + minute_extra + show_time.minute;
        } else {
            ret = show_time.hour + minute_extra + show_time.minute;
        }
        // console.log(show_time);

        if (stgTimezone == "On") {
            ret += timezone_datas[show_time.timezone].name.slice(0, 1);
        }
    } else if (stgQuestionType == "Spoken") {
        // console.log(show_time);
        var nHour = show_time.hour;
        if (show_time.am_pm == "PM")
            nHour += 12;
        if (nHour < 10) {
            ret += "Zero ";
            ret += digit_text_map[nHour] + " ";
        } else if (nHour <= 20) {
            ret += digit_text_map[nHour] + " ";
        } else {
            ret += digit_text_map[nHour - nHour % 10] + " ";
            ret += digit_text_map[nHour % 10] + " ";
        }
        if (show_time.minute == 0) {
            ret += "Hundred";
        } else if (show_time.minute < 10) {
            ret += "Zero ";
            ret += digit_text_map[show_time.minute];
        } else if (show_time.minute <= 20 || show_time.minute % 10 == 0) {
            ret += digit_text_map[show_time.minute];
        } else {
            ret += digit_text_map[show_time.minute - show_time.minute % 10] + " ";
            ret += digit_text_map[show_time.minute % 10];
        }

        ret += " Hours";

        if (stgTimezone == "On") {
            ret += " " + timezone_datas[show_time.timezone].name;
        }
    }

    return ret;
}

function get_time_string(hour, minute, am_pm, timezone_val) {
    return get_time_string_by_json({
        hour,
        minute,
        am_pm,
        timezone: timezone_val
    });
}

function clock_angles(hour,minute){
    var minAngle, hourAngle;
    minAngle = 360 * (minute / 60) - 90;
    hourAngle=360 * (hour / 12) + 30 * (minute / 60) - 90;
    minute_hand_container.rotation = minAngle;
    hour_hand_container.rotation = hourAngle;
    previous_hour = hour;
    set_digital(hour,minute);

    $("#hoursmallControl").val(hour % 12 + (randomQuestion === undefined ? 0 : (randomQuestion.am_pm == "PM" ? 12 : 0)));  
    $("#minutesmallControl").val(minute);
}

function clock(x,y,scale){
    var color_on=true;
    var clock_container;
    var hour_hand;
    var hour_hand_drag=false;
    var hour_hand_offset_x;
    var hour_hand_offset_y;
    var minute_hand;
    var minute_hand_drag=false;
    var minute_hand_offset_x;
    var minute_hand_offset_y;
    var center_x=x;
    var center_y=y;
    var quadrant_hour;
    var quadrant_minute;
    var color_list=["#000000","#000000","#1976D2","#FF5722","#388E3C"];
    var minute_color=color_list[1];
    var clock_color="#000000";

    clock_container=new createjs.Container();
    clock_container.x=0;
    clock_container.y=0;
    stage.addChild(clock_container);

    /* Clock Border */
    var circle_back=new createjs.Shape();
    var circle_back_fill=circle_back.graphics.beginFill(minute_color).command;
    circle_back.graphics.drawCircle(0,0,clockRadius + clockBorderWidth);
    circle_back.x=center_x;
    circle_back.y=center_y;
    clock_container.addChild(circle_back);
    var circle_face=new createjs.Shape();
    circle_face.graphics.beginFill("white").drawCircle(0,0,clockRadius);
    circle_face.x=center_x;
    circle_face.y=center_y;
    clock_container.addChild(circle_face);


    var btnAMPM_Container = new createjs.Container();
    btnAMPM_Container.x = center_x + clockRadius - 40;
    btnAMPM_Container.y = center_y + clockRadius - 40;

    var btnAMPM = new createjs.Shape();
    btnAMPM.graphics.beginFill("#FFFFFF")
        .beginStroke("#000000")
        .setStrokeStyle(4)
        .drawRoundRect(0, 0, 60, 60, 5);
    btnAMPM.on("click", function(event) {
        if (btnAMPM_Text.text == "AM") {
            btnAMPM_Text.text = "PM";
        }
        else if (btnAMPM_Text.text == "PM") {
            btnAMPM_Text.text = "AM";
        }
    });
	btnAMPM.visible = false;

    btnAMPM_Text = new createjs.Text("AM","30px Mukta","#111");
    btnAMPM_Text.x = 30;
    btnAMPM_Text.y = 30;
    btnAMPM_Text.textBaseline="middle";
    btnAMPM_Text.textAlign="center";
    btnAMPM_Container.addChild(btnAMPM, btnAMPM_Text);
    clock_container.addChild(btnAMPM_Container);
	btnAMPM_Container.visible = false;
	


    /* Hour Scales */
    var hour_lines_detail=new Array;
    var hour_lines_fill=new Array;
    var radius = clockRadius - hourScaleLen;
    for(var i=1;i<=12;i++){
        var radians=(-60+((i-1)*30))/180*Math.PI;
        hour_lines_detail[i]=new createjs.Shape();
        hour_lines_fill[i]=hour_lines_detail[i].graphics.beginFill(minute_color).command;
        hour_lines_detail[i].graphics.drawRect(-10, -3, 26, 6);
        hour_lines_detail[i].x=center_x+radius*Math.cos(radians);
        hour_lines_detail[i].y=center_y+radius*Math.sin(radians);
        hour_lines_detail[i].rotation=(-60+((i-1)*30));
        clock_container.addChild(hour_lines_detail[i]);
    }

    /* Minute Scales */
    var minute_lines=new Array;
    var minute_lines_fill=new Array;
    var radius=clockRadius - minuteScaleLen;
    for(var i=1;    i<=60;  i++){
        var radians=(-60+((i-1)*6))/180*Math.PI;
        minute_lines[i]=new createjs.Shape();
        minute_lines_fill[i]=minute_lines[i].graphics.beginFill(minute_color).command;
        minute_lines[i].graphics.drawRect(-10,-1,20,2);
        minute_lines[i].x=center_x+radius*Math.cos(radians);
        minute_lines[i].y=center_y+radius*Math.sin(radians);
        minute_lines[i].rotation=(-60+((i-1)*6));
        clock_container.addChild(minute_lines[i]);
    }

    /* Minute Numbers */
    // minute_numbers=new Array;
    // var radius = clockRadius + clockBorderWidth / 2;;
    // var display_number;
    // for(var i=1;    i<=12;  i++){
    //     var radians=(-60+((i-1)*30))/180*Math.PI;
    //     display_number=i*5;
    //     if(display_number==60){
    //         display_number="00";
    //     }
    //     minute_numbers[i]=new createjs.Text(display_number,"14px Mukta","#FFF");
    //     minute_numbers[i].x=center_x+radius*Math.cos(radians);
    //     minute_numbers[i].y=center_y+radius*Math.sin(radians);
    //     minute_numbers[i].textBaseline="middle";
    //     minute_numbers[i].textAlign="center";
    //     clock_container.addChild(minute_numbers[i]);
    // }

	am_pm=new createjs.Text(i,"20px Mukta","#2C3E50");
    am_pm.x=center_x;
    am_pm.y=center_y - clockRadius / 5;
    am_pm.textBaseline="middle";
    am_pm.textAlign="center";
    am_pm.text=btnAMPM_Text.text; //"AM";
	//am_pm.visible = false;
	//am_pm.text="";
    clock_container.addChild(am_pm);
	
    /* Hour Numbers */
    var hour_numbers=new Array;
    var hour_numbers_outline=new Array;
    var radius=clockRadius - hourScaleLen - 30;
    for(var i=1;    i<=12;  i++){
        var radians=(-60+((i-1)*30))/180*Math.PI;
        hour_numbers[i]=new createjs.Text(i,"24px Mukta","#34495E");
        hour_numbers[i].color=clock_color;
        hour_numbers[i].x=center_x+radius*Math.cos(radians);
        hour_numbers[i].y=center_y+radius*Math.sin(radians);
        hour_numbers[i].textBaseline="middle";
        hour_numbers[i].textAlign="center";
        hour_numbers_outline[i]=hour_numbers[i].clone();
        hour_numbers_outline[i].outline=2;
        hour_numbers_outline[i].color="#000000";
        clock_container.addChild(hour_numbers[i]);
    }

    /* Hour Hand Container */
    {
        hour_hand_container=new createjs.Container();
        clock_container.addChild(hour_hand_container);
        hour_hand=new createjs.Shape();
        var hour_hand_fill=hour_hand.graphics.beginFill(hourHandColor).command;
        hour_hand.graphics.drawRect(-20,-hourHandWidth/2,hourHandLen,hourHandWidth);
        // var hour_hand_end=new createjs.Shape();
        // hour_hand_end.graphics.beginFill("#95A5A6");
        // hour_hand_end.graphics.moveTo(0,60).lineTo(60,60).lineTo(30,120).lineTo(0,60);
        // hour_hand_end.rotation=270;
        // hour_hand_end.x=60;
        // hour_hand_end.y=30;
        // var hour_hand_grab=new createjs.Shape();
        // hour_hand_grab.hitArea=new createjs.Shape();
        // hour_hand_grab.hitArea.graphics.beginFill("#FFF000").drawCircle(30,130,60);
        // hour_hand_grab.rotation=270;
        // hour_hand_grab.x=130;
        // hour_hand_grab.y=30;
        hour_hand_line=new createjs.Shape();
        hour_hand_line.graphics.beginStroke("#000000")
            .setStrokeStyle(1)
            .setStrokeDash([10,5])
            .moveTo(0,0)
            .lineTo(0,clockRadius)
            .endStroke();
        hour_hand_line.alpha=.3;
        hour_hand_line.rotation=270;
        hour_hand_circle=new createjs.Shape();
        hour_hand_circle.graphics.beginStroke("#000000")
            .setStrokeStyle(2)
            .setStrokeDash([10,5])
            .drawCircle(0,clockRadius - 40,40);
        hour_hand_circle.alpha=.3;
        hour_hand_circle.rotation=270;
        hour_hand_circle.hitArea = new createjs.Shape();
        hour_hand_circle.hitArea.graphics.beginFill("#FFF000")
            .drawCircle(0,clockRadius - 40,40);
        // hour_hand_circle.x=130;
        // hour_hand_circle.y=30;
        hour_hand_container.addChild(hour_hand_line,hour_hand,hour_hand_circle);
        hour_hand_container.x=center_x;
        hour_hand_container.y=center_y;
        hour_hand_container.on("pressup",function(event){
            hour_hand_drag=false;
        })
        hour_hand_container.on("pressmove",function(event){
            if(!hour_hand_drag){
                var distance=getDistance(event.stageX,center_x,event.stageY,center_y);
                var point_x=center_x+distance*Math.cos((hour_hand_container.rotation/180)*Math.PI);
                var point_y=center_y+distance*Math.sin((hour_hand_container.rotation/180)*Math.PI);
                hour_hand_offset_x=(point_x-event.stageX);
                hour_hand_offset_y=(point_y-event.stageY);
                quadrant_hour=0;
                quadrant_minute=0;
                hour_hand_drag=true;
            }
            var angle=getDirection(event.stageX+hour_hand_offset_x,center_x,event.stageY+hour_hand_offset_y,center_y);
            if(angle < 0 && angle >= -90){
                if(quadrant_hour==2){
                    check_am_pm(true);
                }
                quadrant_hour=1;
            }else if(angle < -90 && angle >= -180){
                if(quadrant_hour==1){
                    check_am_pm(true);
                }
                quadrant_hour=2;
            }else{
                quadrant_hour=0;
            }
            find_hour_minute(angle);
            clock_angles(hour,minute);
        });
    }

    /* Minute Hand Container */
    {
        minute_hand_container=new createjs.Container();
        clock_container.addChild(minute_hand_container);
        minute_hand=new createjs.Shape();
        var minute_hand_fill=minute_hand.graphics.beginFill(minute_color).command;
        minute_hand.graphics.drawRect(-20,-minuteHandWidth/2,minuteHandLen,minuteHandWidth);
        // var minute_hand_end=new createjs.Shape();
        // minute_hand_end.graphics.beginFill("#000000").moveTo(0,60).lineTo(60,60).lineTo(30,120).lineTo(0,60).endStroke();
        // minute_hand_end.rotation=270;
        // minute_hand_end.x=110;
        // minute_hand_end.y=30;
        // var minute_hand_grab=new createjs.Shape();
        // minute_hand_grab.hitArea=new createjs.Shape();
        // minute_hand_grab.hitArea.graphics.beginFill("#FFF000")
        //  .drawCircle(0,clockRadius - 40,40);
        // minute_hand_grab.rotation=270;
        // minute_hand_grab.x=130;
        // minute_hand_grab.y=30;
        minute_hand_line=new createjs.Shape();
        minute_hand_line.graphics.beginStroke("#000000")
            .setStrokeStyle(2)
            .setStrokeDash([10,5])
            .moveTo(0, 0)
            .lineTo(0, clockRadius)
            .endStroke();
        minute_hand_line.alpha=.3;
        minute_hand_line.rotation=270;
        minute_hand_circle=new createjs.Shape();
        minute_hand_circle.graphics.beginStroke(minute_color)
            .setStrokeStyle(2)
            .setStrokeDash([10,5])
            .drawCircle(0,clockRadius - 40,40);
        minute_hand_circle.hitArea = new createjs.Shape();
        minute_hand_circle.hitArea.graphics.beginFill("#FFF000")
            .drawCircle(0,clockRadius - 40,40);
        minute_hand_circle.alpha=.3;
        minute_hand_circle.rotation=270;
        // minute_hand_circle.x=0;
        // minute_hand_circle.y=30;
        minute_hand_container.addChild(minute_hand_line,minute_hand,minute_hand_circle);
        minute_hand_container.x=center_x;
        minute_hand_container.y=center_y;
        minute_hand_container.on("pressup",function(event){
            minute_hand_drag=false;
        })
        minute_hand_container.on("pressmove",function(event){
            if(!minute_hand_drag){
                var distance=getDistance(event.stageX,center_x,event.stageY,center_y);
                var point_x=center_x+distance*Math.cos((minute_hand_container.rotation/180)*Math.PI);
                var point_y=center_y+distance*Math.sin((minute_hand_container.rotation/180)*Math.PI);
                minute_hand_offset_x=(point_x-event.stageX);
                minute_hand_offset_y=(point_y-event.stageY);
                quadrant_hour=0;
                quadrant_minute=0;
                minute_hand_drag=true;
            }
            var angle=getDirection(event.stageX+minute_hand_offset_x,center_x,event.stageY+minute_hand_offset_y,center_y);
            if(angle < 0 && angle >= -90){
                if(quadrant_minute==2){
                    hour_increase();
                    check_am_pm(false);
                }
                quadrant_minute=1;
            }else if(angle < -90 && angle >= -180){
                if(quadrant_minute==1){
                    hour_decrease();
                    check_am_pm(false);
                }
                quadrant_minute=2;
            }else{
                quadrant_minute=0;
            }
            find_minute_second(angle);
            clock_angles(hour,minute);
        });
    }

    /* Timezone Buttons */
    var timezoneTextArray = new Array;
    var timezoneButtonArray = new Array;
    {
        timezone_button_container = new createjs.Container();
        timezone_button_container.x = center_x;
        timezone_button_container.y = 0;
        stage.addChild(timezone_button_container);

        timezone_desc_container = new createjs.Container();
        timezone_desc_container.x = center_x;
        timezone_desc_container.y = 0;
        stage.addChild(timezone_desc_container);

        var timezone_side_cnt = (timezone_datas.length + 1) / 2;
        var timezone_index;
        for (timezone_index = 0; timezone_index < timezone_datas.length; timezone_index ++) {
            var containerHeight = stage.canvas.height / (timezone_index < timezone_side_cnt ? timezone_side_cnt : (timezone_datas.length - timezone_side_cnt));
            var container = new createjs.Container();
            container.x = ((stage.canvas.width / 2 - clockRadius) / 2 + clockRadius - 30) * (timezone_index < timezone_side_cnt ? -1 : 1) - 60;
            container.y = (timezone_index % timezone_side_cnt) * containerHeight;

            timezoneButtonArray[timezone_index] = new createjs.Shape();
            timezoneButtonArray[timezone_index].id = timezone_index;
            timezoneButtonArray[timezone_index].graphics.beginFill("#FFFFFF")
                .beginStroke("#000000")
                .setStrokeStyle(2)
                .drawRoundRect(0, 2, 120, containerHeight - 4, 2);
            timezoneButtonArray[timezone_index].on("click", function(event) {
                for (var textIndex = 0; textIndex < timezoneTextArray.length; textIndex ++) {
                    timezoneTextArray[textIndex].color="rgb(0,0,0)";
                    timezoneButtonArray[textIndex].graphics._fill.style = "rgb(255, 255, 255)";
                }
                timezone_value = event.target.id;
                timezoneButtonArray[event.target.id].graphics._fill.style = "rgb(0, 0, 0)";
                timezoneTextArray[event.target.id].color="rgb(255,255,255)";
            });

            timezoneTextArray[timezone_index] = new createjs.Text(timezone_datas[timezone_index].time, "20px Mukta","#111");
            if (timezone_index == timezone_value) {
                timezoneTextArray[timezone_index].color = "rgb(255, 255, 255)";
                timezoneButtonArray[timezone_index].graphics._fill.style = "rgb(0, 0, 0)";
            }
            timezoneTextArray[timezone_index].x = 60;
            timezoneTextArray[timezone_index].y = containerHeight / 2;
            timezoneTextArray[timezone_index].textBaseline="middle";
            timezoneTextArray[timezone_index].textAlign="center";
            container.addChild(timezoneButtonArray[timezone_index], timezoneTextArray[timezone_index]);
            timezone_button_container.addChild(container);

            if (false) {
                timezoneDescText = new createjs.Text(timezone_datas[timezone_index].name, "20px Mukta","#111");
                timezoneDescText.x = (timezone_index < timezone_side_cnt ? (container.x - 20) : (container.x + 120 + 20));
                timezoneDescText.y = container.y + containerHeight / 2;
                timezoneDescText.textBaseline="middle";
                timezoneDescText.textAlign=(timezone_index < timezone_side_cnt ? "right" : "left");
                timezone_desc_container.addChild(timezoneDescText);
            }
        }
    }

    // var circle_center=new createjs.Shape();
    // circle_center.graphics.beginFill("#34495E").beginStroke("#2C3E50").setStrokeStyle(10).drawCircle(0,0,20);
    // circle_center.x=center_x;
    // circle_center.y=center_y;
    // var circle_center_outline=new createjs.Shape();
    // circle_center_outline.graphics.beginStroke("#000000").setStrokeStyle(1).drawCircle(0,0,30);
    // circle_center_outline.x=center_x;
    // circle_center_outline.y=center_y;

    // clock_container.regX=center_x/2;
    // clock_container.regY=center_y/2;
    // clock_container.x=center_x-center_x/2;
    // clock_container.y=center_y-center_y/2;
    clock_container.scale=scale;

    digital_container=new createjs.Container();
    digital_container.x=center_x;
    digital_container.y=center_y;
    digital_container.scale=.8;
    stage.addChild(digital_container);

    digital=new createjs.Text(i,"40px Mukta","#000");
    digital.x=0;
    digital.y=-clockRadius / 2;
    digital.textBaseline="middle";
    digital.textAlign="center";

    var digital_back=new createjs.Shape();
    digital_back.graphics.beginFill("#FFFFFF")
        .drawRoundRect(-100,-clockRadius / 2 - 30,200,60,2);
    digital_back.x=0;
    digital_back.y=0;
    digital_back.alpha=.8;
    digital_container.addChild(digital_back, digital);

    color_change(color_list[4]);

    clock_angles(hour,minute);
    change_mode();

    change_timezone_buttons();

    function find_hour_minute(angle){
        var limit;
        if(angle>=150){
            limit=150;
            hour=8;
        }else if(angle>=120){
            limit=120;
            hour=7;
        }else if(angle>=90){
            limit=90;
            hour=6;
        }else if(angle>=60){
            limit=60;
            hour=5;
        }else if(angle>=30){
            limit=30;
            hour=4;
        }else if(angle>=0){
            limit=0;
            hour=3;
        }else if(angle>=-30){
            limit=-30;
            hour=2;
        }else if(angle>=-60){
            limit=-60;
            hour=1;
        }else if(angle>=-90){
            limit=-90;
            hour=12;
        }else if(angle>=-120){
            limit=-120;
            hour=11;
        }else if(angle>=-150){
            limit=-150;
            hour=10;
        }else if(angle>=-180){
            limit=-180;
            hour=9;
        }else{
            limit=-180;
            hour=9;
        }
        if(hour_type==24){
            if(hour==12){
                if(previous_hour==11){
                    hour=12;
                }else{
                    hour=0;
                }
            }
        } else if (hour_type == 12) {
            hour = hour % 12;
        }

        angle = (angle - limit) * 12;
        minute = Math.floor(angle  / 6);
    }
    function find_minute_second(angle) {
        if (angle >= -90) {
            angle += 90;
        } else {
            angle += 450;
        }
        minute = Math.floor(angle / 6);
    }
    function color_change(color){
        circle_back_fill.style=clockBorderColor;
        for(var i=1;i<=12;i++){
            hour_lines_fill[i].style=scaleColor;
        }
        for(var i=1;i<=60;i++){
            minute_lines_fill[i].style=scaleColor;
        }
        hour_hand_fill.style = hourHandColor;
        minute_hand_fill.style = minuteHandColor;
    }
    function getDirection(p1,p2,p3,p4){
        var dx=p1-p2;
        var dy=p3-p4;
        var radians=Math.atan2(dy,dx);
        var angle=radians*180/Math.PI;
        return angle;
    }
    function getDistance(p1,p2,p3,p4){
        var dx=p1-p2;
        var dy=p3-p4;
        var dist=Math.sqrt(dx*dx+dy*dy);
        return dist;
    }
}