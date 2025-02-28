// Vernier Caliper
// 2022.09

var session_prefix ="clock_"
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
var input_answer = "000000";


var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+"stgTimer");
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+"stgSounds");
var stgScale = admin_settings['stgScale']?admin_settings['stgScale']:sessionStorage.getItem(session_prefix+"stgScale");
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+"stgMode");
var stgSecond = admin_settings['stgSecond']?admin_settings['stgSecond']:sessionStorage.getItem(session_prefix+"stgSecond");
var stgMinuteHelp = admin_settings['stgMinuteHelp']?admin_settings['stgMinuteHelp']:sessionStorage.getItem(session_prefix+"stgMinuteHelp");

var stage=new createjs.Stage("myCanvas");

var hour_type=12;
var hour = 6;
var minute = 00;
var second = 0;
var am_pm_value="AM";

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
var secondHandLen = clockRadius * 4.4 / 5;
var secondHandWidth = 4;
//var secondHandColor = "rgb(255, 0, 0)";
var secondHandColor = "rgb(0, 0, 0)";

var windowWidth = $(window).width();;


if (!stgTimer){
    stgTimer = "On";
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
}

if (!stgSounds){
    stgSounds = "On";
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
}

if(!stgScale)
{
    stgScale = "12HR";
    sessionStorage.setItem(session_prefix+'stgScale', stgScale);
}

if(!stgMode)
{
    stgMode = "Game";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}

if (!stgSecond) {
    stgSecond = "Off";
    sessionStorage.setItem(session_prefix+'stgSecond', stgSecond);
}

if (!stgMinuteHelp) {
    stgMinuteHelp = "Off";
    sessionStorage.setItem(session_prefix+'stgMinuteHelp', stgMinuteHelp);
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgMode").val(stgMode);
$("#stgScale").val(stgScale);
$("#stgSecond").val(stgSecond);
$("#stgMinuteHelp").val(stgMinuteHelp);

document.getElementById("hoursmallControl").readOnly = true;
document.getElementById("minutesmallControl").readOnly = true;
document.getElementById("secondsmallControl").readOnly = true;

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


$("#stgScale").change(function(){
    stgScale = $("#stgScale option:selected").val();
    sessionStorage.setItem(session_prefix+'stgScale', stgScale);
    
    change_scale(stgScale);

    msr = 0;
    vsr = 0;

    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
    

    if (stgMode == "Trainer")
    {
        $("#hoursmallControl").val(hour);
        $("#minutesmallControl").val(minute);
		$("#secondsmallControl").val(second);
    }
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);

    change_mode();
    
    if(stgMode == "Game")
    {
        $("#hoursmallControl").hide();
        $("#minutesmallControl").hide();
		$("#secondsmallControl").hide();
		//am_pm.text = "";
    }
    else
    {
        $("#hoursmallControl").show();
        $("#minutesmallControl").show();
		$("#secondsmallControl").show();
		am_pm.text = am_pm_value;
    }
    
	if (stgScale == "24HR")
		am_pm.text = "";
	else if (stgScale == "12HR")
		am_pm.text = am_pm_value;
	
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    
    level = 1;
    drawLevelCanvas(1);
    
    if (stgMode == "Trainer")
    {
        $("#hoursmallControl").val(hour);
        $("#minutesmallControl").val(minute);
        $("#secondsmallControl").val(second);
    }
    
    drawType()
});

$("#stgSecond").change(function() {
    stgSecond = $("#stgSecond option:selected").val();
    sessionStorage.setItem(session_prefix+'stgSecond', stgSecond);

    change_second();
    drawType()
})

$("#stgMinuteHelp").change(function() {
    stgMinuteHelp = $("#stgMinuteHelp option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMinuteHelp', stgMinuteHelp);

    change_minute_help();
})

if($("#stgMode").val() =="Game")
{
    $("input[id=hoursmallControl]").hide();
    $("input[id=minutesmallControl]").hide();
	$("input[id=secondsmallControl]").hide();
}

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
    
    if(stgMode == "Type"){
        let value = parseInt(input_answer)
        if(stgSecond == 'On')
        {
            hour = parseInt(input_answer/10000)
            minute = parseInt(input_answer%10000/100)
            second = parseInt(input_answer%100)
        }
        else{
            hour = parseInt(input_answer/100)
            minute = parseInt(input_answer%100)
        }
        checkGuess();
    }
    else
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
        console.log(hour + " :" + minute);
        console.log(randomQuestion.hour + " :" + randomQuestion.minute);
		if (stgScale == "12HR")
        {
			if (hour == randomQuestion.hour &&
				minute == randomQuestion.minute &&
				(stgSecond == "Off" || second == randomQuestion.second) &&
				(stgScale == "24HR" || am_pm_value == randomQuestion.am_pm)) {
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
		else
		{
			if ((hour == randomQuestion.hour || hour - 12 == randomQuestion.hour || hour + 12 == randomQuestion.hour )&&
				minute == randomQuestion.minute &&
				(stgSecond == "Off" || second == randomQuestion.second) &&
				(stgScale == "24HR" || am_pm_value == randomQuestion.am_pm)) {
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
	
    if(stgMode == "Game" || stgMode == "Train"){
    	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
        if ($("#stgScale").val()=="12HR")
    	{
    		$("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + get_time_string(hour, minute, second, am_pm_value) + "</span>").fadeIn();
    	}
        else
            $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + get_time_string(hour, minute, second) + "</span>").fadeIn();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    }
    else{
        var tmp = ""
        if ($("#stgScale").val()=="12HR")
    	{
    		tmp= get_time_string(correct.hour, correct.minute, correct.second, correct.am_pm);
    	}
        else
            tmp= get_time_string(correct.hour, correct.minute, correct.second);
        $("#txtQuestion").html("<span><span class='questionWrongInstruction'>Right answer was </span>" +question2HtmlString(tmp)+".").fadeIn();
    }
    // drawSections = stgRulerLength * stgRulerPrecision;
    // var sectionWidth = (250 * stgRulerLength) / drawSections;
    // var c = $("#playerCanvas");
}


function question2HtmlString(val, str_type = 1) {
        var ret = "<span>";

        var cls_msr = str_type == 1 ? "questionWrongMeasurement" : "questionMeasurement";
        var cls_inst = str_type == 1 ? "questionWrongInstruction" : "questionInstruction";
        ret += "<span class='" + cls_msr +"'>" + val  + "</span>";

        return ret;
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
    $("#buttonBar").show();
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
    randHour = randomInt(0, maxHour - 1);
    randMinute = randomInt(0, 59);
    randSecond = randomInt(0, 59);
    randAmPm = randomInt(0, 1) == 0 ? "AM" : "PM";

    return {
        hour: randHour,
        minute: randMinute,
        second: randSecond,
        hour_type: maxHour,
        am_pm: randAmPm
    };
}

function showNewQuestion() {
    //console.log("Showing New Question...");
    var html = "";
    if(stgSecond=='On'){
        input_answer = "0000000";
    }
    else{
        input_answer = "00000";
    }
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    if ($("#stgScale").val() == "12HR")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomTime(12);
    }
    else if ($("#stgScale").val() == "24HR")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomTime(24);
    }
	//randomQuestion = randomQuestion / 1000;

    $("#txtQuestion").hide()

	

    if (stgMode == "Game" || stgMode == "Training") {
    	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
    	html = "<span class='questionInstruction'>Control hands to select</span><br>";
        //////////////////////////////////////////////////////////////////////////////////////////////////
    
        $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + get_time_string_by_json(randomQuestion) + " </span>").fadeIn();
    
    }
    else{
            html = "<span class='questionInstruction'>Enter the time.</span>";
            $("#txtQuestion").html(html).fadeIn(); 
            am_pm_value = randomQuestion.am_pm
            check_am_pm();
            clock_angles(randomQuestion.hour, randomQuestion.minute, randomQuestion.second);
    }
    
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
    drawType()
    

}


function newGame() {
    $("#preferencesBox").hide();
    $("#buttonBar").hide();
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
    drawType()
    
}


$("#btnhourincrement").click(function(){
    //inputType = "Mouse";
    hour_increase();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
    $("#hoursmallControl").val(hour);  
	
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnhourdecrement").click(function(){
    //inputType = "Mouse";
    hour_decrease();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
	$("#hoursmallControl").val(hour);  

    // DrawThimbleChange()
    
    // newGame();
});

$("#btnminuteincrement").click(function(){
    //inputType = "Mouse";
    minute_increase();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
    $("#minutesmallControl").val(minute);  
    
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnminutedecrement").click(function(){
    //inputType = "Mouse";
    minute_decrease();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
    $("#minutesmallControl").val(minute);  

    // DrawThimbleChange()
    
    // newGame();
});

$("#btnsecondincrement").click(function(){
    //inputType = "Mouse";
    second_increase();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
    $("#secondsmallControl").val(second);
    
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnseconddecrement").click(function(){
    //inputType = "Mouse";
    second_decrease();
    check_am_pm(false);
    clock_angles(hour, minute, second);
    
    $("#secondsmallControl").val(second);  

    // DrawThimbleChange()
    
    // newGame();
});

function handleTick(event){
    stage.update(event);
    
    var c = $("#myCanvas");
    var ctx = c[0].getContext('2d');
    
    ctx.font = "bold 10px Arial";
    ctx.fillStyle='black';
    outString1(ctx, 3, c[0].height-55, "Timer: " + stgTimer, 0, 0);
    outString1(ctx, 3, c[0].height-45, "Mode: " + (stgMode=="Trainer"?"Training":stgMode), 0, 0);
    outString1(ctx, 3, c[0].height-35, "Seconds: " + stgSecond, 0, 0);
    outString1(ctx, 3, c[0].height-25, "Minute Help: " + stgMinuteHelp, 0, 0);
    outString1(ctx, 3, c[0].height-15, "Format: " + stgScale, 0, 0);
}

function init() {
    createjs.Touch.enable(stage,true,false);
    clock1=new clock(xOffset, yOffset, 1);
    createjs.Ticker.timingMode=createjs.Ticker.RAF;
    createjs.Ticker.on("tick",handleTick);
    
    
    window.addEventListener('keydown', onKeyEvent, false);
	
    var typeCanvas = document.getElementById('typeCanvas');
    typeCanvas.addEventListener('click', getMouseClick, false);
}

var am_pm;
var previous_hour=hour;

/* Widgets */
var second_hand;
var second_hand_container;
var minute_hand_container;
var hour_hand_container;
var digital_container;
var digital;
var minute_numbers;
var second_hand_line;
var second_hand_circle;
var minute_hand_line;
var minute_hand_circle;
var hour_hand_line;
var hour_hand_circle;

function change_mode() {
    if(stgMode == "Game" || stgMode == "Type"){
        /*second_hand_line.visible = false;
        second_hand_circle.visible = false;
        minute_hand_line.visible=false;
        minute_hand_circle.visible=false;
        hour_hand_line.visible=false;
        hour_hand_circle.visible=false; */
		digital_container.visible = false;
    }else if (stgMode == "Trainer") {
       
		digital_container.visible = true;
    }
	
	if (stgSecond == "On")
	{
		second_hand_line.visible = true;
		second_hand_circle.visible = true;
	}
	minute_hand_line.visible=true;
	minute_hand_circle.visible=true;
	hour_hand_line.visible=true;
	hour_hand_circle.visible=true;
}

function change_second() {
    if (stgSecond == "On") {
        second_hand.visible = true;
        // if (stgMode == "Trainer")
        // {
            second_hand_line.visible = true;
            second_hand_circle.visible = true;
        // }
        $('#secondhandgroup').show();
    } else if (stgSecond == "Off") {
        second_hand.visible = false;
        second_hand_line.visible = false;
        second_hand_circle.visible = false;
        $('#secondhandgroup').hide();
    }

    clock_angles(hour, minute, second);
}

function change_minute_help() {
    if (stgMinuteHelp == "On") {
        for (var i = 1; i <= 12; i ++) {
            minute_numbers[i].visible = true;
        }
    } else if (stgMinuteHelp == "Off") {
        for (var i = 1; i <= 12; i ++) {
            minute_numbers[i].visible = false;
        }
    }
}


function change_scale() {
    if (stgScale == "12HR") {
        hour_type=12;
        if(hour>12){
            hour=hour%12;
        }
		
		am_pm.text = am_pm_value;
        clock_angles(hour,minute,second);
    } else if (stgScale == "24HR") {
        hour_type=24;
        if(hour_type==24){
            if(hour==12){
                if(previous_hour==11){
                    hour=12;
                }else{
                    hour=0;
                }
            }
            if(am_pm_value=="PM"){
                hour=hour%12+12;
            }
        }
		
		am_pm.text = "";
        clock_angles(hour,minute,second);
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

function second_increase() {
    second ++;
    if (second == 60) {
        minute_increase();
        second = 0;
    }
}

function second_decrease(){
    second --;
    if(second < 0){
        minute_decrease();
        second = 59;
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
        if(am_pm_value=="AM"){
            am_pm_value="PM";
        }else{
            am_pm_value="AM";
        }
    }
	
	if (stgScale == "12HR")
		am_pm.text=am_pm_value;
	else
		am_pm.text = "";
}

function set_digital(hour,minute,second){
    digital.text = get_time_string(hour, minute, second);
}

function get_time_string_by_json(show_time) {
    var minute_extra = "";
    if (show_time.minute < 10) {
        minute_extra = "0";
    }
    var hour_extra = "";
    if (show_time.hour_type == 24 && show_time.hour < 10) {
        hour_extra = "0";
    }
    var second_extra = "";
    if (show_time.second < 10) {
        second_extra = "0";
    }

    var ret = hour_extra+show_time.hour+":"+minute_extra+show_time.minute;

    if (stgSecond == "On")
    {
        var second_extra = "";
        if (show_time.second < 10) {
            second_extra = "0";
        }
        ret += ":" + second_extra + show_time.second;
    }

    if (show_time.hour_type == 12)
        ret += " " + show_time.am_pm;
    return ret;
}

function get_time_string(hour, minute, second, am_pm) {
    var minute_extra = "";
    if (minute < 10) {
        minute_extra = "0";
    }
    var hour_extra = "";
    if (hour_type == 24 && hour < 10) {
        hour_extra = "0";
    }

    var ret = hour_extra+hour+":"+minute_extra+minute;

    if (stgSecond == "On")
    {
        var second_extra = "";
        if (second < 10) {
            second_extra = "0";
        }
        ret += ":" + second_extra + second;
    }

    if (am_pm !== undefined)
        ret += " " + am_pm;
    return ret;
}

function clock_angles(hour,minute,second){
    var secondAngle, minAngle, hourAngle;
    if (stgSecond == "On")
    {
        secondAngle = 360 * (second / 60) - 90;
        minAngle = 360 * (minute / 60) + 6 * (second / 60) - 90;
        hourAngle=360 * (hour / 12) + 30 * (minute / 60) + 0.5 * (second / 60) - 90;
    }
    else
    {
        secondAngle = 0;
        minAngle = 360 * (minute / 60) - 90;
        hourAngle=360 * (hour / 12) + 30 * (minute / 60) - 90;
    }
    second_hand_container.rotation = secondAngle;
    minute_hand_container.rotation = minAngle;
    hour_hand_container.rotation = hourAngle;
    previous_hour = hour;
    set_digital(hour,minute,second);

    $("#hoursmallControl").val(hour);
    $("#minutesmallControl").val(minute);
    $("#secondsmallControl").val(second);
    
    
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
    var second_hand_drag=false;
    var second_hand_offset_x;
    var second_hand_offset_y;
    var center_x=x;
    var center_y=y;
    var quadrant_hour;
    var quadrant_minute;
    var quadrant_second;
    var color_list=["#000000","#000000","#1976D2","#FF5722","#388E3C"];
    var minute_color=color_list[1];
    var second_color=color_list[1];
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
    minute_numbers=new Array;
    var radius = clockRadius + clockBorderWidth / 2;;
    var display_number;
    for(var i=1;    i<=12;  i++){
        var radians=(-60+((i-1)*30))/180*Math.PI;
        display_number=i*5;
        if(display_number==60){
            display_number="00";
        }
        minute_numbers[i]=new createjs.Text(display_number,"14px Mukta","#FFF");
        minute_numbers[i].x=center_x+radius*Math.cos(radians);
        minute_numbers[i].y=center_y+radius*Math.sin(radians);
        minute_numbers[i].textBaseline="middle";
        minute_numbers[i].textAlign="center";
        clock_container.addChild(minute_numbers[i]);
    }

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

    am_pm=new createjs.Text(i,"20px Mukta","#2C3E50");
    am_pm.x=center_x;
    am_pm.y=center_y - clockRadius / 5;
    am_pm.textBaseline="middle";
    am_pm.textAlign="center";
    am_pm.text="AM";
	//am_pm.text="";
    clock_container.addChild(am_pm);

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
                quadrant_second=0;
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
            clock_angles(hour,minute,second);
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
                quadrant_second=0;
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
            clock_angles(hour,minute,second);
        });
    }

    /* Second Hand Container */
    {
        second_hand_container=new createjs.Container();
        clock_container.addChild(second_hand_container);
        second_hand=new createjs.Shape();
        var second_hand_fill=second_hand.graphics.beginFill(second_color).command;
        second_hand.graphics.drawRect(-20,-secondHandWidth/2,secondHandLen,secondHandWidth);
        second_hand_line=new createjs.Shape();
        second_hand_line.graphics.beginStroke("#000000")
            .setStrokeStyle(2)
            .setStrokeDash([10,5])
            .moveTo(0, 0)
            .lineTo(0, clockRadius)
            .endStroke();
        second_hand_line.alpha=.3;
        second_hand_line.rotation=270;
        second_hand_circle=new createjs.Shape();
        second_hand_circle.graphics.beginStroke(second_color)
            .setStrokeStyle(2)
            .setStrokeDash([10,5])
            .drawCircle(0,clockRadius - 40,40);
        second_hand_circle.hitArea = new createjs.Shape();
        second_hand_circle.hitArea.graphics.beginFill("#FFF000")
            .drawCircle(0,clockRadius - 40,40);
        second_hand_circle.alpha=.3;
        second_hand_circle.rotation=270;
        // minute_hand_circle.x=0;
        // minute_hand_circle.y=30;
        second_hand_container.addChild(second_hand_line,second_hand,second_hand_circle);
        second_hand_container.x=center_x;
        second_hand_container.y=center_y;
        second_hand_container.on("pressup",function(event){
            second_hand_drag=false;
        })
        second_hand_container.on("pressmove",function(event){
            if(!second_hand_drag){
                var distance=getDistance(event.stageX,center_x,event.stageY,center_y);
                var point_x=center_x+distance*Math.cos((second_hand_container.rotation/180)*Math.PI);
                var point_y=center_y+distance*Math.sin((second_hand_container.rotation/180)*Math.PI);
                second_hand_offset_x=(point_x-event.stageX);
                second_hand_offset_y=(point_y-event.stageY);
                quadrant_hour=0;
                quadrant_minute=0;
                quadrant_second=0;
                second_hand_drag=true;
            }
            var angle=getDirection(event.stageX+second_hand_offset_x,center_x,event.stageY+second_hand_offset_y,center_y);
            second=second_move(angle);
            if(second<=15){
                if(quadrant_second==2){
                    minute_increase();
                    check_am_pm(false);
                }
                quadrant_second=1;
            }else if(second>=45){
                if(quadrant_second==1){
                    minute_decrease();
                    check_am_pm(false);
                }
                quadrant_second=2;
            }else{
                quadrant_second=0;
            }
            clock_angles(hour,minute,second);
        });
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

    var digital_label=new createjs.Text("Digital","14px Mukta","#111");
    digital_label.x=675;
    digital_label.y=650;
    digital_label.textBaseline="middle";
    digital_label.textAlign="center";
    stage.addChild(digital_label);

    color_change(color_list[4]);

    clock_angles(hour,minute,second);
    change_mode();
    change_second();
    change_minute_help();

    function second_move(angle){
        var amount=Math.round(((angle+90)/360)*60);
        if(amount<0){
            amount+=60;
        }
        return amount;
    }
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
            if(am_pm_value=="PM"){
                hour=hour%12+12;
            }
        } else if (hour_type == 12) {
            hour = hour % 12;
        }

        angle = (angle - limit) * 12;
        minute = Math.floor(angle  / 6);
        if (stgSecond == "On")
            second = second_positions(angle / 6 - minute);
        else
            second = 0;
    }
    function find_minute_second(angle) {
        if (angle >= -90) {
            angle += 90;
        } else {
            angle += 450;
        }
        minute = Math.floor(angle / 6);
        if (stgSecond == "On")
            second = second_positions(angle / 6 - minute);
        else
            second = 0;
    }
    function second_positions(angle) {
        return Math.floor(angle * 60);
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
        second_hand_fill.style = secondHandColor;
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
    drawType()
}

function drawType(){
    var scale
   
		
    let canvas 
    var c = $("#typeCanvas");
    var ctx = c[0].getContext('2d');
    canvas = ctx.canvas
    if(stgMode == "Type"){
        ctx.canvas.height = 180;
        ctx.canvas.width = 320
        $(".number-input").hide();
	}
	else {
        ctx.canvas.height = 0;
        ctx.canvas.width = window.innerWidth > 1366 ? 600:window.innerWidth*0.8
        $(".number-input").show();
	}
    
    if (stgMode == "Type") {
        // show keyboards and input answer

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.fillRect(0 + 2, 0, canvas.width - 4, 150);
        // drawLine(ctx,0, canvas.height / 2 - 100, canvas.width , canvas.height / 2 - 100);
        //drawLine(-canvas.width / 2, canvas.height / 2 - 100, -canvas.width / 2, canvas.height / 2);
        //drawLine(-canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
        //drawLine(canvas.width / 2, canvas.height / 2 - 100, canvas.width / 2, canvas.height / 2);
        
        var input_type;
        console.log("randomQuestion====" + randomQuestion);
        
        
        
        if(1){
            show_num_start_x = 10; show_num_start_y = 10;
            // if (stgFraction == "Yes") {
            //     show_num_start_x -= 30;
            // }
            ctx.fillStyle = "rgb(200, 200, 200)";
            // ctx.fillRect(show_num_start_x + 40 * 3, show_num_start_y, 30, 35);
            
            if(stgSecond=='On'){
                ctx.fillRect(show_num_start_x + 40 * 0 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 1 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 2 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 3 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 4 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 5 + 20, show_num_start_y, 30, 35);
                ctx.font = '20pt sans-serif';
                ctx.fillStyle = "rgb(0, 0, 0)"
                outString1(ctx, show_num_start_x + 40 * 2 + 8, show_num_start_y + 18, ':', 0, 0);
                outString1(ctx, show_num_start_x + 40 * 4 + 8, show_num_start_y + 18, ':', 0, 0);
            }
            else{
                ctx.fillRect(show_num_start_x + 40 * 0 + 45 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 1 + 45 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 2 + 47 + 20, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 3 + 47 + 20, show_num_start_y, 30, 35);
                ctx.font = '20pt sans-serif';
                ctx.fillStyle = "rgb(0, 0, 0)"
                outString1(ctx, show_num_start_x + 40 * 2 + 47 + 7, show_num_start_y + 18, ':', 0, 0);
            }
                
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = '18pt sans-serif';
            
            // outString(ctx, show_num_start_x + 40 * 4 + 35, show_num_start_y + 18, "feet", 0, 0);
           

            if (input_answer) {
                if(stgSecond=='On'){
                    outString1(ctx, show_num_start_x + 40 * 0 + 5  + 20, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 1 + 5  + 20, show_num_start_y + 15, input_answer[1], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 2 + 5  + 20, show_num_start_y + 15, input_answer[2], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 3 + 5  + 20, show_num_start_y + 15, input_answer[3], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 4 + 5  + 20, show_num_start_y + 15, input_answer[4], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 5 + 5  + 20, show_num_start_y + 15, input_answer[5], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 5 + 45 + 10, show_num_start_y + 18, randomQuestion?.am_pm?randomQuestion.am_pm:'AM', 0, 0);
                }
                else{
                    outString1(ctx, show_num_start_x + 40 * 0 + 5 + 45 + 20, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 1 + 5 + 45 + 20, show_num_start_y + 15, input_answer[1], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 2 + 5 + 47 + 20, show_num_start_y + 15, input_answer[2], 0, 0);
                    outString1(ctx, show_num_start_x + 40 * 3 + 5 + 47 + 20, show_num_start_y + 15, input_answer[3], 0, 0);
                outString1(ctx, show_num_start_x + 40 * 4 + 45 + 20, show_num_start_y + 18, randomQuestion?.am_pm?randomQuestion.am_pm:'AM', 0, 0);
                }
            }
        }
        ctx.font = '18pt sans-serif';
        ctx.lineWidth = 2;
        show_num_start_x = 50; show_num_start_y = 60;
        for (let i = 0; i <= 4; i++) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(show_num_start_x + 40 * i - 5, show_num_start_y, 30, 30);

            ctx.fillStyle = "rgb(0, 0, 0)";
            outString1(ctx, show_num_start_x + 40 * i, show_num_start_y + 15, i+1, 0, 0);
        }
        for (let i = 5; i <= 9; i++) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(show_num_start_x + 40 * (i-5) - 5, show_num_start_y+50, 30, 30);

            ctx.fillStyle = "rgb(0, 0, 0)";
            outString1(ctx, show_num_start_x + 40 * (i-5), show_num_start_y + 15+50, (i+1)%10, 0, 0);
        }
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.strokeRect(show_num_start_x + 40 * 5 - 10 + 10, show_num_start_y, 30, 30);

        ctx.fillStyle = "rgb(0, 0, 0)";
        outString1(ctx, show_num_start_x + 40 * 5 - 7 + 10, show_num_start_y + 15 - 3, "←", 0, 0);
    }
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


function getMousePosWindow(event) {
    return [event.clientX, event.clientY];
}

function getTouchPosWindow(event) {
    return [event.touches[0].pageX, event.touches[0].pageY];
}

function getMousePos(event)
{
	return [ event.clientX ,event.clientY ];
}
function getMousePos1(canvas, evt) {
    // from https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
  }
function getTouchPos(event)
{
	return [event.touches[0].pageX, event.touches[0].pageY];
}

function onKeyEvent(e)
{
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
    }
    if(e.keyCode==37 ||e.keyCode==38)
	{
        translateVernier(-10);
    }
    else if (e.keyCode==39||e.keyCode==40)
	{
        translateVernier(10);
    }
    else if (e.keyCode==33) //page up
	{
        scale *= 1.05;
        update();
    }
    else if (e.keyCode==34) //page down
	{
        scale *= 0.96;
        update();
    }
    else if (e.keyCode >= 96/*'0'*/ && e.keyCode <= 105/*'9'*/)  // when using numpad...
    {
        {
            set_input_answer("" + (e.keyCode - 96));
            drawType()
        }
    } else if (e.keyCode >= 48/*'0'*/ && e.keyCode <= 57/*'9'*/) {
        {
            set_input_answer("" + (e.keyCode - 48));
            drawType()
        }
    } else if (e.keyCode == 8/*BackSpace*/) {
        set_input_answer("Back");
        drawType()
    }
	else 
	{
        return false;
    }

    e.preventDefault();
}

function getMouseClick(me) {
    if (stgMode == "Type") {
        var m;

        if (me.type == 'touchstart')
            m = getTouchPosWindow(me);
        else
            m = getMousePosWindow(me);
        
        // var doc = document.documentElement;
        // var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        // var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);


        var x, y;
        // if (me.type != 'touchstart') {
        //     //x = (m[0] - canvas.offsetLeft + left) / scale - xOffset; // - canvas.offsetLeft ;
        //     //y = (m[1] - canvas.offsetTop + top) / scale - yOffset; // - canvas.offsetTop + top ;
        //     x = (m[0] - canvas.offsetLeft + left) / scale - xOffset; // - canvas.offsetLeft ;
        //     y = (m[1] - canvas.offsetTop + top) / scale - yOffset; // - canvas.offsetTop + top ;
        // }
        // else {
        //     //x = (m[0] - canvas.offsetLeft) / scale - xOffset; // - canvas.offsetLeft ;
        //     //y = (m[1] - canvas.offsetTop) / scale - yOffset; // - canvas.offsetTop + top ;
        //     x = (m[0] - canvas.offsetLeft) / scale - xOffset; // - canvas.offsetLeft ;
        //     y = (m[1] - canvas.offsetTop) / scale - yOffset; // - canvas.offsetTop + top ;
        // }

        var canvas = document.getElementById('typeCanvas');

        var mousePosTmp = getMousePos1(canvas, me);
        x = mousePosTmp.x
        y = mousePosTmp.y;
        console.log("x", x)
        console.log("y", y)
        if (y > (60) && y < (90)) {
            if (x > (45 + 40 * 5) && x < (85 + 40 * 5)) {
                set_input_answer("Back");
            } else {
                for (let i = 0; i <= 4; i++) {
                    if (x > (45 + 40 * i) && x < (85 + 40 * i)) {
                        set_input_answer("" + (i+1));
                        break;
                    }
                }
            }
        }
        
        if (y > (110) && y < (140)) {
            for (let i = 0; i <= 4; i++) {
                if (x > (45 + 40 * i) && x < (85 + 40 * i)) {
                    set_input_answer("" + (i+5+1)%10);
                    break;
                }
            }
        }
        drawType()
        return;
    } 
}

var set_input_answer = function (val) {
    var num_cnt = 0;
    if(stgSecond =='On' ){
        num_cnt  = 6
    }
    else{
        num_cnt  = 4
    }
    if (val == "Back") {
        input_answer = "" + parseInt(parseInt(input_answer) / 10);
        for (var i = input_answer.length; i < num_cnt; i ++) {
            input_answer = "0" + input_answer;
        }
    } else {
        input_answer += val;
        input_answer = input_answer.substring(input_answer.length - num_cnt);
    }

}
