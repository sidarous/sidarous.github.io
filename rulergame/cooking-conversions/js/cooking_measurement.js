// Cooking Measurement
// 2024.07.07

var BOWL_TYPE_NONE = -1;
var BOWL_TYPE_TEA_SPOON = 0;
var BOWL_TYPE_TABLE_SPOON = 1;
var BOWL_TYPE_FL_OZ = 2;
var BOWL_TYPE_CUP = 3;
var BOWL_TYPE_PINT = 4;
var BOWL_TYPE_QUART = 5;
var BOWL_TYPE_GALLON = 6;

var MAX_SOURCE_NUM = 20;
var bowl_unit_strs = [
    "teaspoon", "tablespoon", "fl oz", "cup", "pint", "quart", "gallon"
];
var bowl_units = [
    1,         1,           0.5,   0.125, 0.5,  0.25,   0.25
//  TEA_SPOON, TABLE_SPOON, FL_OZ, CUP,   PINT, QUART, GALLON
];
var bowl_sizes = [
    1,         3,           6,     48,    96,   192,   768
//  TEA_SPOON, TABLE_SPOON, FL_OZ, CUP,   PINT, QUART, GALLON
];

var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
var levelcounter;
var score;
var level;
var strikes;
var gameTimer;
var randomQuestion;
var gameover = true;
var previousQuestion;
var secs;
var allowMovement = false;
var stgRulerLength = 10;
var stgRulerPrecision = 10;

var stgTimer = "On";
var stgSounds = "On";
var stgAmount = "Both";
var stgMode = "Game";

var windowWidth = $(window).width();;


if (!stgTimer){
    stgTimer = "On";
    
}
if (!stgSounds){
    stgSounds = "On";
    
}

if(!stgAmount)
{
    stgAmount = "Small";
}

if(!stgMode)
{
    stgMode = "Game";
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgAmount").val(stgAmount);
$("#stgMode").val(stgMode);

document.getElementById("bowlsmallControl").readOnly = true;

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


$("#stgAmount").change(function(){
    stgAmount = $("#stgAmount option:selected").val();
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);

    imgInsertedBowls = [];
    
    if (stgMode == "Trainer")
    {
		// $("#bowlsmallControl").text(getTotalAmount());
    }
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    
    if(stgMode == "Game")
    {
		$("#bowlsmall").hide();
    }
    else
    {
		$("#bowlsmall").show();
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
		// $("#bowlsmallControl").text(getTotalAmount());        
    }
});

if($("#stgMode").val() =="Game")
{
	$("#bowlsmall").hide();
//	$("input[id=bowlsmall]").hide();
}

$("#btnStart").click(function(){
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess(getTotalAmount());
    imgInsertedBowls = [];
    paint();
});

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
        checkGuess(getTotalAmount());
		imgInsertedBowls = [];
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

    {
        var quesVal = bowl_sizes[randomQuestion.target] * bowl_units[randomQuestion.target] * randomQuestion.target_num;
        console.log(guess.toFixed(2) + "," + quesVal.toFixed(2));

        if (guess.toFixed(2) == quesVal.toFixed(2)) {
            showCheer();
            if (stgSounds === "On") { correctSound.play(); }
            score = score + pointvalue;
            $("#txtScore").text(padScore(score));
            levelcounter = levelcounter + 1;
            checklevel();
            showNewQuestion();
        }
        else {
            // doStrike(guess);
			doStrike(quesVal);
        }
    }
}

function doStrike(quesVal) {
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
    
    drawCorrection(randomQuestion, quesVal);
    //console.log("Delaying...");
    setTimeout(hideStrikeLayer,2500);
    //console.log("After setTimeout");
}    

function drawCorrection(correct, quesVal){

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();
	
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
    //$("#txtQuestion").html("<span class='questionWrongInstruction'>You were wrong.</span><br><span class = 'questionWrongMeasurement'>Right answer was: " + quesVal.toFixed(2) + " " + "</span>").fadeIn();
    $("#txtQuestion").html("<span class='questionWrongInstruction'>You were wrong.<br>Right answer was: </span><span class='questionWrongMeasurement'> " +
		getFraction(quesVal / bowl_sizes[randomQuestion.target]) + " " +
		bowl_unit_strs[randomQuestion.target] +
		(quesVal / bowl_sizes[randomQuestion.target] == 1 ? "" : "s") +
		".</span>").fadeIn();
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
    $("#strikeBoard").hide();
    // clearPlayerCanvas(true);
    drawTimer(0);
    gameover = true;
    $("#buttonBar").fadeIn();
    $("#questionBar").hide();

    randomQuestion = undefined;

    paint();
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

function isEqualQuestion(ques1, ques2) {
	if (ques1 === undefined || ques2 === undefined)
		return false;
    return ques1.source === ques2.source &&
            ques1.target === ques2.target &&
            ques1.source_num === ques2.source_num &&
            ques1.target_num === ques2.target_num;
}

function newProblem(problem_bowls) {
    var newQuestion = {};
    
    newQuestion.target = problem_bowls[randomInt(0, problem_bowls.length - 1)];
    do {
        newQuestion.source = problem_bowls[randomInt(0, problem_bowls.length - 1)];
    } while (newQuestion.source === newQuestion.target);

    var source_num_unit = bowl_sizes[newQuestion.source] * bowl_units[newQuestion.source];
    var target_num_unit = bowl_sizes[newQuestion.target] * bowl_units[newQuestion.target];

    var max_num_unit = Math.max(source_num_unit, target_num_unit);
    
    console.log("source_target  " + source_num_unit + "," + target_num_unit);
    if (source_num_unit < target_num_unit) {
        newQuestion.target_num = randomInt(1, parseInt(MAX_SOURCE_NUM / max_num_unit)) * max_num_unit / target_num_unit;
        newQuestion.source_num = newQuestion.target_num * target_num_unit / source_num_unit;
    } else {
        newQuestion.source_num = randomInt(1, parseInt(MAX_SOURCE_NUM / max_num_unit)) * max_num_unit / source_num_unit;
        newQuestion.target_num = newQuestion.source_num * source_num_unit / target_num_unit;
    }

    return newQuestion;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function showNewQuestion() {
    imgInsertedBowls = [];

    var html = "";
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion
    
    var problem_bowls = [];
    var problem_bowls_small = [
        BOWL_TYPE_TEA_SPOON,
        BOWL_TYPE_TABLE_SPOON,
        BOWL_TYPE_FL_OZ,
        BOWL_TYPE_CUP,
    ];
    
    var problem_bowls_large = [
        BOWL_TYPE_CUP,
        BOWL_TYPE_PINT,
        BOWL_TYPE_QUART,
        BOWL_TYPE_GALLON,
    ];
    
    if (stgAmount == "Small") {
        problem_bowls = problem_bowls.concat(problem_bowls_small);
    } else if (stgAmount == "Large") {
        problem_bowls = problem_bowls.concat(problem_bowls_large);
    } else {
        var rand_val = randomInt(0, 1);
        if (rand_val == 0) {
            problem_bowls = problem_bowls.concat(problem_bowls_small);
        } else if (rand_val == 1) {
            problem_bowls = problem_bowls.concat(problem_bowls_large);
        }
    }

    do {
        randomQuestion = newProblem(problem_bowls);
        console.log("----" + bowl_sizes[randomQuestion.target] * bowl_units[randomQuestion.target] * randomQuestion.target_num + "----");
    } while (isEqualQuestion(randomQuestion, previousQuestion) || bowl_sizes[randomQuestion.target] * bowl_units[randomQuestion.target] * randomQuestion.target_num / bowl_sizes[randomQuestion.target] > 10);

    $("#txtQuestion").hide()
	
	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
	html = "<span class='questionInstruction'>How many " + bowl_unit_strs[randomQuestion.target] + "s " + "in " ;
    //////////////////////////////////////////////////////////////////////////////////////////////////

/*	if (randomQuestion.source == 0)
		randomQuestion.source_num  = 20;  */
	
    $("#txtQuestion").html(html +
        "<span class='questionInstruction'> " +
        getFraction((((randomQuestion.source_num * bowl_units[randomQuestion.source]) * 1000).toFixed(0) / 1000)) +
        " " +
        bowl_unit_strs[randomQuestion.source] +
        (randomQuestion.source_num * bowl_units[randomQuestion.source] == 1 ? "" : "s") +
        "?</span>").fadeIn();

    if (stgTimer === "On"){
        secs = 30 - 3 * (level - 1);
        startTimer()
    }

    paint();
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
    
    var defaultPrevent = function(e){ e.preventDefault() };
    canvas.addEventListener("touchstart", defaultPrevent);
    canvas.addEventListener("touchmove" , defaultPrevent);
    
    // clearPlayerCanvas(true);
    showNewQuestion();
}

