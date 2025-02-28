//2024.7.29

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

var stgTimer = "On";
var stgSounds = "On";
var stgUnit = "lb";
var stgMode = "Game";

var windowWidth = $(window).width();;


if (!stgTimer){
    stgTimer = "On";
}
if (!stgSounds){
    stgSounds = "On";
}

if (!stgUnit) {
    stgUnit = "lb";
    setUnit(stgUnit);
}

if(!stgMode)
{
    stgMode = "Game";
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgUnit").val(stgUnit);
$("#stgMode").val(stgMode);

document.getElementById("largesmallControl").readOnly = true;
document.getElementById("smallsmallControl").readOnly = true;

$("#smallsmallControl").hide();
$("#largesmallControl").hide();
		
function show_values_to_controls() {
    $("#largesmallControl").val(large_msr);
    $("#smallsmallControl").val(small_msr);
}

$("#stgTimer").change(function(){
    stgTimer = $("#stgTimer option:selected").val();
    
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
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
});

$("#stgUnit").change(function(){
    stgUnit = $("#stgUnit option:selected").val();
    setUnit(stgUnit);
    msr_init();
    update();
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    
    if(stgMode == "Game")
    {
        $("#smallsmallControl").hide();
        $("#largesmallControl").hide();
    }
    else
    {
        $("#smallsmallControl").show();
        $("#largesmallControl").show();
    }
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    
    level = 1;
    drawLevelCanvas(1);
    
    if (stgMode == "Trainer")
    {
        $("#largesmallControl").val(large_msr);
        $("#smallsmallControl").val(small_msr);
    }
});

if($("#stgMode").val() =="Game")
{
	$("#largesmallControl").hide();
	$("#smallsmallControl").hide();
}

$("#btnStart").click(function(){
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess(parseFloat(input_answer));
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

function msr_init() {
	
    large_msr = 0;
    small_msr = 0;
	input_answer = "0.0";
	isWeightRight = false;
	
}

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
    var c = $("#timerCanvas");
    var ctx = c[0].getContext('2d');
    ctx.canvas.height = 40;
    ctx.canvas.width = 30;
    ctx.fillStyle = "#339966";
    // if(seconds<6) {ctx.fillStyle = "#ffc107";}
    // if(seconds<3) {ctx.fillStyle = "#f44336";}
    if(seconds<10) {ctx.fillStyle = "#ffc107";}
    if(seconds<6) {ctx.fillStyle = "#f44336";}
    // ctx.fillRect(0, 30-seconds*3, 30, 30);
    ctx.fillRect(0, 40 - seconds, 30, 40);
    
    console.log("seconds=" + seconds);
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
        checkGuess(parseFloat(input_answer));
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
        return false;
    }

    console.log(guess.toFixed(2) + "," + randomQuestion.toFixed(2));

    if (guess.toFixed(2) == randomQuestion.toFixed(2)) {
        showCheer();
        if (stgSounds === "On"){ correctSound.play() }
        score = score + pointvalue;
        $("#txtScore").text(padScore(score));
        levelcounter = levelcounter + 1;
        checklevel();
        showNewQuestion();
    }
    else {
        doStrike(guess);
    }

    //console.log("...Finished Checking Guess");
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
    //console.log("Drawing Correction...");
    //console.log("correct = " + correct);        
    //console.log("incorrect = " + incorrect);
    //console.log("Correct = " + measurement[correct] +"; Your guess = " + measurement[incorrect]);

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();

    // if (scale == "cm"){
    //     $("#txtQuestion").html("<span class='questionWrongInstruction'>You entered</span><br><span class='questionWrongMeasurement'>" + incorrect / 10 + "cm</span>").fadeIn();
    // } else {
    //     $("#txtQuestion").html("<span class='questionWrongInstruction'>You entered</span><br><span class='questionWrongMeasurement'>" + incorrect + "mm</span>").fadeIn();
    // }
	
    $("#txtQuestion").html("<span><span class='questionWrongInstruction'>You entered </span>" +
        "<span class='questionWrongMeasurement'>" + incorrect.toFixed(stgUnit == "lb" ? 2 : 1) + " " + stgUnit + "</span><br>" +
        "<span class='questionWrongInstruction'>Right answer was </span>" +
        "<span class='questionWrongMeasurement'>" + randomQuestion.toFixed(stgUnit == "lb" ? 2 : 1) + " " + stgUnit + "</span></span>").fadeIn();
	
    drawSections = stgRulerLength * stgRulerPrecision;
    var sectionWidth = (250 * stgRulerLength) / drawSections;
    var c = $("#playerCanvas");
    // var ctx = c[0].getContext('2d');      
    // var barLength = correct * sectionWidth;
    // ctx.fillStyle="#f44336";
    // ctx.fillRect(offsetLeft, 0, barLength, 30);
    // ctx.fillRect(30, 0, barLength, 30);
    //console.log("...Finished Drawing Correction");
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
        setTimeout(endGame,3000);
    }
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
	console.log("levelcounter=" + levelcounter);
	console.log("level="+level); 
    if ( (levelcounter === 5) && (level < 10) ) 
    {
        if(stgSounds === "On")
        {
        	levelupSound.play();
        }
        level = level + 1;
        levelcounter = 0;
        pointvalue = pointvalue + 10;
        drawLevelCanvas(level);
        showCheerBoard("<h1>Level " + level + "</h1>",1000);
    }
}

function clearPlayerCanvas(noFade){
    //console.log("Clearing Player Canvas...");
    var c = $("#playerCanvas");
    if(!noFade){ c.hide(); }
    var ctx = c[0].getContext('2d');
    ctx.canvas.height = 100;
    // ctx.canvas.width = (stgRulerLength * 250) + 2 + offsetLeft + offsetRight; 
    ctx.canvas.width = 100; 
    //ctx.clearRect(0,0,(stgRulerLength * 256) + 2, 100);
    //ctx.fillStyle="#ddffdd";
    //ctx.fillRect(0,0,offsetLeft,100);
    //ctx.fillRect((stgRulerLength * 256) + 2 + offsetLeft, 0, offsetRight, 100); 
    ctx.fillStyle="#ffffff";
    // ctx.fillRect(offsetLeft, 0, stgRulerLength * 250, 100);        
    ctx.fillRect(0, 0, 100, 100);        
    // if(inputType === "Touch"){ drawHandle(ctx,0); }
    // drawHandle(ctx,0);
    //c.css('background-color','#ffffff !important');
    if(!noFade){ c.fadeIn(); }
    //console.log("...Finished Clearing Player Canvas");
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

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    var max_pro_value = 1;
    var max_pro_unit = 1;
    if (stgUnit == "lb") {
        max_pro_value = 390;
        max_pro_unit = 0.25;
    } else if (stgUnit == "kg") {
        max_pro_value = 180;
        max_pro_unit = 0.1;
    }
    while (randomQuestion == previousQuestion) {
        randomQuestion = randomInt(1, max_pro_value / max_pro_unit) * max_pro_unit;
    }
	console.log(randomQuestion);

    $("#txtQuestion").hide()

	msr_init();
	
	if (stgUnit == "lb")
		//html = "<span class='questionInstruction'>Control Weight Scales.</span><br>";
		html = "<span class='questionInstruction'>Balance the scale and submit the correct amount of pounds.</span><br>";
	else if (stgUnit == "kg")
		html = "<span class='questionInstruction'>Balance the scale and submit the correct amount of kilograms.</span><br>";

    $("#txtQuestion").html(html).fadeIn(); //  + "<span class='questionMeasurement'>" + randomQuestion + " " + "g </span>").fadeIn();

    if (stgTimer === "On"){
        
        // if( level < 4)
        // {
        //     secs = 40 - 3*(level-1);
        // }
        // else
        // {
        //     secs = 40 - 3*(level-1) - 1;
        // }
        secs = 40 - 4 * (level-1);
        startTimer()
    }

    update();
}


function newGame() {
    $("#preferencesBox").hide();
    $("#buttonBar").fadeOut();
    $("#questionBar").toggle();
    $("#txtScore").text("00000");
    drawTimer(30);        
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
    
	msr_init();

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



$("#btnlargedecrement").click(function(){
    //inputType = "Mouse";
    translateLarge(-1);
    update();
});

$("#btnlargeincrement").click(function(){
    //inputType = "Mouse";
    translateLarge(1);
    update();
});

$("#btnsmalldecrement").click(function(){
    //inputType = "Mouse";
    translateSmall(-1);
    update();
});

$("#btnsmallincrement").click(function(){
    //inputType = "Mouse";
    translateSmall(1);
    update();
});
