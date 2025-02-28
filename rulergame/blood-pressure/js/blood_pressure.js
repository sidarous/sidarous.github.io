// Blood Pressure
// 2024.07

var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
var levelcounter;
var score;
var level;
var strikes;
var gameTimer;
var gameover = true;
var randomQuestion = { high: 0, low: 0 };;
var previousQuestion;
var secs;
var initStartTime = 50;
var allowMovement = false;
var stgRulerLength = 10;
var stgRulerPrecision = 10;

var stgTimer = sessionStorage.getItem('stgTimer');
var stgSounds = "On";
var stgMode = "Game";

var windowWidth = $(window).width();;

if(!stgTimer){
        stgTimer = "On";
        sessionStorage.setItem('stgTimer', stgTimer);
}
    
if (!stgSounds){
    stgSounds = "On";
    
}

if(!stgMode)
{
    stgMode = "Game";
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgMode").val(stgMode);

// document.getElementById("verniersmallControl").readOnly = true;



$("#stgTimer").change(function(){
    stgTimer = $("#stgTimer option:selected").val();
    sessionStorage.setItem('stgTimer', stgTimer);
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);
    update();
    
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
    update();
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    
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
    
    if (stgMode == "Trainer")
    {
		$("#verniersmallControl").val((Math.round(cr * 1000) / 1000).toFixed(3));        
    }
    update();
});

if($("#stgMode").val() =="Game")
{
	$("input[id=verniersmallControl]").hide();
}

$("#btnStart").click(function(){
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess(get_total_value());
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
var viloateSound = new Sound("./assets/correct-plastic-click.mp3");

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
    ctx.canvas.height = initStartTime;
    ctx.canvas.width = 30;
    ctx.fillStyle = "#339966";
    // if(seconds<6) {ctx.fillStyle = "#ffc107";}
    // if(seconds<3) {ctx.fillStyle = "#f44336";}
    if(seconds<10) {ctx.fillStyle = "#ffc107";}
    if(seconds<6) {ctx.fillStyle = "#f44336";}
    // ctx.fillRect(0, 30-seconds*3, 30, 30);
    ctx.fillRect(0, initStartTime-seconds, 30, initStartTime);
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

function start_measurement() {
    msr -= needle_vel; // * ;
    switch (measure_state) {
        case 2:
            needle_vel = 0.6;
            if (msr - 20 < randomQuestion.high) {
                measure_state = 1;
                msr += violate_scale;
                violate_cnt = 0;
                needle_vel = 0.6;
                
                if (stgSounds === "On"){ viloateSound.play() }
            }
            break;
        case 1:
            violate_cnt ++;
            if (violate_cnt > 12) {
                msr += violate_scale;
                violate_cnt = 0;
                
        		if (stgSounds === "On"){ (new Sound("./assets/correct-plastic-click.mp3")).play() }
            }
            if (msr - 20 < randomQuestion.low) {
                measure_state = 0;
                needle_vel = 1.2;
            }
            break;
        default:
            break;
    }
    if (msr  < 0) {
        clearTimeout(measureTimer);
        return;
    }
    update();
    measureTimer = setTimeout(start_measurement, 40 / (1 + 0.8 * (needle_vel_percentage - 0.5)));
}

function startTimer() {
    drawTimer(secs);
    if(secs === 0) {
        checkGuess({});
    } else {
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
    clearTimeout(measureTimer);
    if (gameover === true) {
        return false;
    }

    {
        console.log(guess.high + "/" + guess.low + "," + randomQuestion.high + "/" + randomQuestion.low);

        if (isEqualQuestion(guess, randomQuestion)) {
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
	
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
    var html = "<span class='questionWrongInstruction'>You selected </span><span class='questionWrongMeasurement'>" + (parseInt(incorrect.high)) + "/" + (parseInt(incorrect.low)) + " " + "mmHg." + "</span><br>";
    $("#txtQuestion").html("<span>" +
        html +
        "<span class='questionWrongInstruction'>Right answer was </span><span class='questionWrongMeasurement'>" + (parseInt(correct.high)) + "/" + (parseInt(correct.low)) + " " + "mmHg." + "</span>" +
        "</span>"
    ).fadeIn();
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
    clearTimeout(measureTimer); 
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

function isEqualQuestion(old_one, new_one) {
	//console.log("answer_allow_error=" + answer_allow_error);
    if (new_one !== undefined && Object.keys(new_one).length > 0) {
        if (Math.abs(old_one.high - new_one.high) < answer_allow_error &&
            Math.abs(old_one.low - new_one.low) < answer_allow_error) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function generateNewProblem() {
    var high = randomInt(70, 200);
    return {
        high,
        low: randomInt(Math.max(30, high - 80), high - 20)
    }
}

function showNewQuestion() {
    var html = "";
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion;
    while (isEqualQuestion(previousQuestion, randomQuestion)) 
        randomQuestion = generateNewProblem();

    input_answer_up = "0";
    input_answer_down = "0";
    measure_state = 2;

    msr = 320;
    start_measurement();

    $("#txtQuestion").hide()

	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
	html = "<span class='questionInstruction'>Measure the blood pressure and submit the numbers.</span>";
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + randomQuestion + " " + "mmHg" + " </span>").fadeIn();
    $("#txtQuestion").html(html).fadeIn();

    if (stgTimer === "On"){
        // if( level < 4)
        // {
        //     secs = 40 - 3*(level-1);
        // }
        // else
        // {
        //     secs = 40 - 3*(level-1) - 1;
        // }
        secs = initStartTime ; //- 3 * (level - 1);
        startTimer()
    }

    update();
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
    randomQuestion = { high: 0, low: 0 };
    gameover = false;
    allowMovement = true;
    timerRunning = false;

    var defaultPrevent = function(e){ e.preventDefault() };
    canvas.addEventListener("touchstart", defaultPrevent);
    canvas.addEventListener("touchmove" , defaultPrevent);
    
    showNewQuestion();
}



$("#btnvernierdecrement").click(function(){
    //inputType = "Mouse";
    translateVernier(-1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 1000) / 1000).toFixed(3));
	
    // DrawThimbleChange()
    
    // newGame();
});


$("#btnvernierincrement").click(function(){
    //inputType = "Mouse";
    translateVernier(1);
    update();
    
	$("#verniersmallControl").val((Math.round(cr * 1000) / 1000).toFixed(3));  

    // DrawThimbleChange()
    
    // newGame();
});

