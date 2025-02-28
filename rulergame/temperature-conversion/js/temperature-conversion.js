// Temperature Conversion

var session_prefix ="temperature_"
var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
var levelcounter;
var score;
var level;
var strikes;
var gameTimer;
var randomQuestion;
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
var stgUnit = admin_settings['stgUnit']?admin_settings['stgUnit']:sessionStorage.getItem(session_prefix+"stgUnit");
var stgRounding = admin_settings['stgRounding']?admin_settings['stgRounding']:sessionStorage.getItem(session_prefix+"stgRounding");
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+"stgMode");

var windowWidth = $(window).width();;

var correct_answer = 0;
var nearest_answers = [0,0,0,0,0];
var original_answer = 0;

if (!stgTimer){
    stgTimer = "On";
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
}
if (!stgSounds){
    stgSounds = "On";
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
}

if(!stgUnit)
{
    stgUnit = "Celsius";
    sessionStorage.setItem(session_prefix+'stgUnit', stgUnit);
}

if (!stgRounding)
{
    stgRounding = "Closest";
    sessionStorage.setItem(session_prefix+'stgRounding', stgRounding);
}

if(!stgMode)
{
    stgMode = "Game";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgUnit").val(stgUnit);
$("#stgRounding").val(stgRounding);
$("#stgMode").val(stgMode);

document.getElementById("verniersmallControl").readOnly = true;

$("#stgTimer").change(function(){
    stgTimer = $("#stgTimer option:selected").val();
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

	    
	gameStarted = 0;
	msrSelected = 0;
	msr = 0;
		
    level = 1;
    drawLevelCanvas(1);
    update();
});


$("#stgSounds").change(function(){
    stgSounds = $("#stgSounds option:selected").val();
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
	    
	gameStarted = 0;
	msrSelected = 0;
	msr = 0;
	
    level = 1;
    drawLevelCanvas(1);
});


$("#stgUnit").change(function(){
    stgUnit	= $("#stgUnit option:selected").val();
    sessionStorage.setItem(session_prefix+'stgUnit', stgUnit);
    
	msr = 0;
    vsr = 0;
    gameStarted = 0;
	msrSelected = 0;
    
	strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
	
    if (stgMode == "Trainer")
    {
		$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(0));       
    }
	
	update();
});

$("#stgRounding").change(function() {
    stgRounding = $("#stgRounding option:selected").val();
    sessionStorage.setItem(session_prefix+'stgRounding', stgRounding);
    update();
})

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
    
    if(stgMode == "Game")
    {
		$("#verniersmallControl").hide();
    }
    else
    {
		$("#verniersmallControl").show();
    }
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    
    level = 1;
    drawLevelCanvas(1);
    
	gameStarted = 0;
	msrSelected = 0;
	msr = 0;
	
    if (stgMode == "Trainer")
    {
		$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(0));        
    }
    update();
});

if($("#stgMode").val() =="Game")
{
	$("input[id=verniersmallControl]").hide();
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
    sentScore = true
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess(cr);
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
    if(lvl == 0) {
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
    var html = "<br><br><div class='cheer animated rubberBand'>" + cheers[x] + "</div>";
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
    if(secs == 0) {
        checkGuess(cr);
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

function Fahrenheit2Celsius(value) {
    return (value - 32) * 5 / 9;
}

function Celsius2Fahrenheit(value) {
    return value * 9 / 5 + 32;
}

function checkGuess(guess) {
    origin_guess_val = guess;
    
    
	answer = 0;
	//randomQuestion = -33;
	if (stgUnit == "Fahrenheit") 
	{
		answer = Celsius2Fahrenheit(randomQuestion.toFixed(0));
	}
	else if(stgUnit == "Celsius")
		answer = Fahrenheit2Celsius(randomQuestion.toFixed(0));
	
	original_answer = answer;
	
	answer = Math.round(answer);

	if (stgUnit == "Fahrenheit" && answer % 2 != 0)
	{
		//console.log("answer_2");
		if (Math.abs(original_answer - (answer + 1)) < Math.abs(original_answer - (answer - 1)))
			answer = answer + 1;
		else 
			answer = answer - 1;
	}
	
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);
    if (gameover == true) {
		msrSelected = 0;
		gameStarted = 0;
        return false;
    }

    
    console.log("question===" + randomQuestion.toFixed(0));
    console.log("guessed===" + guess);
    console.log("original_answer===" + original_answer);
    console.log("answer===" + answer);

	correct_answer = answer;
	
    //if ($("#stgScale").val()=="Centimeter")
    {
        var delta = 0;
        if (stgRounding == "Closest")
            delta = 0;
        else if (stgRounding == "Within 1 degree")
            delta = 1;
        else if (stgRounding == "Within 2 degrees")
            delta = 2;
        
        if (Math.abs(guess - Math.round(answer)) <= delta) {
            showCheer();
            if (stgSounds == "On"){ correctSound.play() }
            score = score + pointvalue;
            $("#txtScore").text(padScore(score));
            levelcounter = levelcounter + 1;
            checklevel();
            showNewQuestion();
        }
        else {        	
            doStrike(origin_guess_val.toFixed(0));
        }
		
		msrSelected = 0;
    }
}

function doStrike(guess) {
    pause = true;
    //console.log("Doing Strike...");
    if(stgSounds == "On"){strikeSound.play();}
    // strikeSound.play();
    strikes++;
    if (strikes <= 3)
    {
        $("#strikeBoard").append("<img src='images/strike.gif'>");
        $("#txtStrikes").append("<img src='images/strike.gif'>");        
        $("#strikeBoard").show(); 
    }
    
    drawCorrection(randomQuestion, guess);
    //console.log("Delaying...");
    setTimeout(hideStrikeLayer,5000);
    //console.log("After setTimeout");
}    

function drawCorrection(correct, incorrect){

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();
	
    if (stgUnit == "Fahrenheit")
    	stgSubScaleForML = "℉";
    else if (stgUnit == "Celsius")
        stgSubScaleForML = "℃";

	html = "<span class='questionWrongInstruction'>You answered: " + incorrect + " " + stgSubScaleForML + ", </span>";
	html = html + "<span class='questionWrongInstruction'>Correct answer is: " + original_answer.toFixed(1) + " " + stgSubScaleForML + "<br>And it should be rounded to: " + correct_answer + " " + stgSubScaleForML + "</span><br>";
	//if (stgRounding == "Within 1 degree")
	//	html = html + "<span calss='questionWrongInstruction'>Nearest values are:" + (correct_answer - 1) + "," + (correct_answer + 1) + " " + stgSubScaleForML + "</span>";
	//else if(stgRounding == "Within 2 degrees")
	//	html = html + "<span calss='questionWrongInstruction'>Nearest values are:" + (correct_answer - 2) + "," + (correct_answer - 1) + "," + (correct_answer + 1) + "," + (correct_answer + 2) + " " + stgSubScaleForML + "</span>";
	console.log("html" + html);
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
    $("#txtQuestion").html(html).fadeIn();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    drawSections = stgRulerLength * stgRulerPrecision;
    var sectionWidth = (250 * stgRulerLength) / drawSections;
    var c = $("#playerCanvas");
}


function hideStrikeLayer() {
    pause = false;
    //console.log("Hiding Strike Layer...");
    $("#strikeBoard").hide();
    // clearPlayerCanvas(true);
    if(strikes < 3){
        showNewQuestion();
    } else {
        if(stgSounds == "On"){gameoverSound.play();}
        $("#txtQuestion").hide();
        $("#txtQuestion").html("<span class='gameOver'>Game Over</span><span class='questionMeasurement'>&nbsp;</span>").fadeIn();
        if(game_id){
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
        sentScore = true
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
	
	msrSelected = 0;
	gameStarted = 0;
	msr = 0;
}   

function checklevel() {
    if ( (levelcounter == 5) && (level < 10) ) {
        if(stgSounds == "On"){levelupSound.play();}
        level = level + 1;
        levelcounter = 0;
        pointvalue = pointvalue + 10;
        drawLevelCanvas(level);
        showCheerBoard("<br><br><h1>Level " + level + "</h1>",1000);
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

function drawHandle(ctx,x){
    //console.log(ctx);
    //console.log(x,(stgRulerLength * 256) + 2 + offsetLeft);
    if (x > (stgRulerLength * 250)){
       x = stgRulerLength * 450;
    }

    var borderWidth = 3;
    var radius = offsetLeft - borderWidth;
    //context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.arc(x + offsetLeft, 30 + offsetLeft, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#339966';
    ctx.fill();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#000000';
    ctx.stroke();    
}

function padScore(num){
    return ("00000" + num).slice(-5);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function showNewQuestion() {
    //console.log("Showing New Question...");
    var html = "";
    allowMovement = true;

    if (levelcounter == 0){
        html = "<br><br><div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    if (stgUnit == "Celsius")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = Celsius2Fahrenheit(randomInt(-35, 50) * 1);
    }
    else if (stgUnit	== "Fahrenheit")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = Fahrenheit2Celsius(randomInt(-15, 60) * 2);
    }
	//randomQuestion = randomQuestion / 1000;

    if (stgUnit == "Celsius")
    	stgSubScaleForML = "℉";
    else if (stgUnit == "Fahrenheit")
        stgSubScaleForML = "℃";

    $("#txtQuestion").hide()

	
	

	if (stgUnit == "Celsius")
	{
		///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
		html = "<span class='questionMeasurement'>Convert </span>";
    	//////////////////////////////////////////////////////////////////////////////////////////////////
		$("#txtQuestion").html(html + "<span class='questionMeasurement'>" + randomQuestion.toFixed(0) + " " + stgSubScaleForML + " to Celsius</span>").fadeIn();
	}
	else if(stgUnit == "Fahrenheit")
	{
		///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
		html = "<span class='questionMeasurement'>Convert </span>";
    	//////////////////////////////////////////////////////////////////////////////////////////////////
    	$("#txtQuestion").html(html + "<span class='questionMeasurement'>" + randomQuestion.toFixed(0) + " " + stgSubScaleForML + " to Fahrenheit</span>").fadeIn();
	}
    

    if (stgTimer == "On"){
        
        //secs = 30 - 3 * (level - 1);
        if (stgUnit == "Celsius")
            secs = 20 - level * 2 + 2;
        else if (stgUnit == "Fahrenheit")
            secs = 20 - level * 2 + 2;
        startTimer();
    }

    update();
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
    gameStarted = 1;
	msrSelected = 0;
	msr = 0;

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

    var defaultPrevent = function(e){ e.preventDefault() };
    canvas.addEventListener("touchstart", defaultPrevent);
    canvas.addEventListener("touchmove" , defaultPrevent);
    
    // clearPlayerCanvas(true);
    showNewQuestion();
    
}



$("#btntempdecrement").click(function(){
    //inputType = "Mouse";
    translateVernier(-1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(0));
	
    // DrawThimbleChange()
    
    // newGame();
});


$("#btntempincrement").click(function(){
    //inputType = "Mouse";
    translateVernier(1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(0));  

    // DrawThimbleChange()
    
    // newGame();
});

