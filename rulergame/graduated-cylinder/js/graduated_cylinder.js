// Vernier Caliper
// 2022.09

var session_prefix ="graduated_cylinder_"
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

var stgIsRandom = false;
var stgSubScaleForCM = "cm";
var sentScore = false


var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+"stgTimer");
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+"stgSounds");
var stgScale = admin_settings['stgScale']?admin_settings['stgScale']:sessionStorage.getItem(session_prefix+"stgScale");
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+"stgMode");

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
    stgScale = "Random";
    sessionStorage.setItem(session_prefix+'stgScale', stgScale);
}


if(!stgMode)
{
    stgMode = "Game";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgScale").val(stgScale);
$("#stgMode").val(stgMode);

if (stgScale == "Random") {
    stgIsRandom = true;
    var nRandom = Math.floor((Math.random() * 4));
    switch (nRandom) {
    case 0:
        val = "10ml"; break;
    case 1:
        val = "25ml"; break;
    case 2:
        val = "50ml"; break;
    case 3:
        val = "100ml"; break;
    }
    stgScale = val;
    msr = 0;
}

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
    update();
});


$("#stgScale").change(function(){
    stgScale = $("#stgScale option:selected").val();
    sessionStorage.setItem(session_prefix+'stgScale', stgScale);
    if (stgScale == "Random") {
        stgIsRandom = true;
		var nRandom = Math.floor((Math.random() * 4));
        switch (nRandom) {
        case 0:
            val = "10ml"; break;
        case 1:
            val = "25ml"; break;
        case 2:
            val = "50ml"; break;
        case 3:
            val = "100ml"; break;
        }
        stgScale = val;
        msr = 0;

    } else {
        stgIsRandom = false;
    }
    
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
		$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(1));       
    }
    update();
});

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
		$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(1));        
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
    sentScore = false
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    if(stgMode == "Type")
        checkGuess(parseInt(input_answer) * (randomQuestion>0?1:-1)/10);
    else
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
    if(stgMode=='Type'){
        if(seconds<10) {ctx.fillStyle = "#ffc107";}
        if(seconds<4) {ctx.fillStyle = "#f44336";}
        ctx.fillRect(0, 30-seconds, 30, 30);
        ctx.fillRect(0, 30-seconds*1.5, 30, 30);
    }
    else{
        if(seconds<5) {ctx.fillStyle = "#ffc107";}
        if(seconds<2) {ctx.fillStyle = "#f44336";}
        ctx.fillRect(0, 30-seconds, 30, 30);
        ctx.fillRect(0, 30-seconds*3, 30, 30);
    }
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
    if(secs === 0) {
        if(stgMode == "Type")
            checkGuess(parseInt(input_answer) * (randomQuestion>0?1:-1));
        else
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

function checkGuess(guess) {
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);
    if (gameover === true) {
		msrSelected = 0;
		gameStarted = 0;
        return false;
    }

    //if ($("#stgScale").val()=="Centimeter")
    {
        console.log(guess.toFixed(1) + "," + randomQuestion.toFixed(1));

        if (guess.toFixed(1) == randomQuestion.toFixed(1)) {
            showCheer();
            if (stgSounds === "On"){ correctSound.play() }
            score = score + pointvalue;
            $("#txtScore").text(padScore(score));
            levelcounter = levelcounter + 1;
            checklevel();
            showNewQuestion();
        }
        else {
            doStrike(guess.toFixed(1));
        }
		
		msrSelected = 0;
    }
}

function doStrike(guess) {
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
    
    drawCorrection(randomQuestion, guess);
    //console.log("Delaying...");
    setTimeout(hideStrikeLayer,2500);
    //console.log("After setTimeout");
}    

function drawCorrection(correct, incorrect){

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();
	
    if(stgMode == "Game" || stgMode == "Train"){
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
        $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + incorrect + " " +  "ml</span>").fadeIn();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    }
    else{
        $("#txtQuestion").html("<span><span class='questionWrongInstruction'>Right answer was </span>" +question2HtmlString(correct)+".").fadeIn();
    }
    drawSections = stgRulerLength * stgRulerPrecision;
    var sectionWidth = (250 * stgRulerLength) / drawSections;
    var c = $("#playerCanvas");
}


function question2HtmlString(val, str_type = 1) {
        var ret = "<span>";

        var cls_msr = str_type == 1 ? "questionWrongMeasurement" : "questionMeasurement";
        var cls_inst = str_type == 1 ? "questionWrongInstruction" : "questionInstruction";
        ret += "<span class='" + cls_msr +"'>" + val + stgSubScaleForML + "</span>";

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
	
	msrSelected = 0;
	gameStarted = 0;
	msr = 0;
}   

function checklevel() {
    if ( (levelcounter === 5) && (level < 10) ) {
        if(stgSounds === "On"){levelupSound.play();}
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
    input_answer = "00000";
    allowMovement = true;
    drawType()

    if (levelcounter === 0){
        html = "<br><br><div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    if (stgIsRandom)
    {
        var nRandom = Math.floor((Math.random() * 4));
        switch (nRandom) {
        case 0:
            val = "10ml"; break;
        case 1:
            val = "25ml"; break;
        case 2:
            val = "50ml"; break;
        case 3:
            val = "100ml"; break;
        }
        stgScale = val;
        msr = 0;
    }

    if (stgScale == "10ml")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomInt(5, 50) / 5;
        randomQuestion = Math.min(randomQuestion,9)
    }
    else if (stgScale == "25ml")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomInt(0, 50) / 2;
        randomQuestion = Math.min(randomQuestion,24)
    }
    else if (stgScale == "50ml")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomInt(5, 50);// / 1000;
        randomQuestion = Math.min(randomQuestion,49)
    }
    else if (stgScale == "100ml")
    {
        while (randomQuestion == previousQuestion) 
            randomQuestion = randomInt(10, 100);// / 1000;
        randomQuestion = Math.min(randomQuestion,99)
    }
	//randomQuestion = randomQuestion / 1000;

	stgSubScaleForML = "ml";

    $("#txtQuestion").hide()

	
	if (stgMode == "Game" || stgMode == "Training") {
    	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
    	html = "<span class='questionInstruction'>Control Dial Caliper to select</span><br>";
        //////////////////////////////////////////////////////////////////////////////////////////////////
    
        $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + randomQuestion + " " + stgSubScaleForML + " </span>").fadeIn();
    
    }
    else{
            html = "<span class='questionInstruction'>Enter the height.</span>";
            $("#txtQuestion").html(html).fadeIn(); 
            
                     
            
            msr = getMsrReading(randomQuestion)
    }
    if (stgTimer === "On"){
        
        if(stgMode=='Type'){
            secs = 22 - level*2;
        }
        else{
            secs = 10 - level + 1;
        }
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
    drawType()
    
}



$("#btnvernierdecrement").click(function(){
    //inputType = "Mouse";
    translateVernier(-1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(1));
	
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnvernierincrement").click(function(){
    //inputType = "Mouse";
    translateVernier(1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 10) / 10).toFixed(1));  

    // DrawThimbleChange()
    
    // newGame();
});

