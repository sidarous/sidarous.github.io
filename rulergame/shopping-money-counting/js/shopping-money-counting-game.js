// Shopping Money Game
var session_prefix ="shopping_money_"
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

var startTime = admin_settings['startTime']?admin_settings['startTime']:sessionStorage.getItem(session_prefix+'startTime');
var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+'stgTimer');
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+'stgSounds');
var stgDifficulty = admin_settings['stgDifficulty']?admin_settings['stgDifficulty']:sessionStorage.getItem(session_prefix+'stgDifficulty');
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+'stgMode');
var countsOfItems = admin_settings['countsOfItems']?admin_settings['countsOfItems']:sessionStorage.getItem(session_prefix+'countsOfItems');

var windowWidth = $(window).width();;
var randomMax = 10;

if (!startTime){
    startTime = 30;
    
}
if (!stgTimer){
    stgTimer = "On";
    
}
if (!stgSounds){
    stgSounds = "On";
    
}

if(!stgDifficulty)
{
    stgDifficulty = "Decimals";
}

if(!countsOfItems)
{
    countsOfItems = 2;
}


if(!stgMode)
{
    stgMode = "Game";
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgDifficulty").val(stgDifficulty);
$("#stgMode").val(stgMode);

document.getElementById("moneysmallControl").readOnly = true;

$("#stgRange").change(function(){
    var stgRange = $("#stgRange option:selected").val();
    sessionStorage.setItem(session_prefix+'stgRange', stgRange);
    
	
	
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

	if (stgRange == "$0 - $10"){
		randomMax = 10;
	}
	else if (stgRange == "$0 - $50") {
		randomMax = 50;
	}
	else if (stgRange == "$0 - $100") {
		randomMax = 100;
	}

	console.log("------------------stgRange--------------" + randomMax);
	
    level = 1;
    drawLevelCanvas(1);
    paint()
});

$("#stgStartTime").change(function(){
    var tmp = $("#stgStartTime option:selected").val();
	
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

	if (tmp == "30"){
		startTime = 30;
	}
	else if (tmp == "60") {
		startTime = 60;
	}
    sessionStorage.setItem(session_prefix+'startTime', startTime);

	console.log("------------------stgStartTime--------------" + startTime);
	
    level = 1;
    drawLevelCanvas(1);
    paint()
});

$("#stgCountsOfItems").change(function(){
    var stgCountsOfItems = $("#stgCountsOfItems option:selected").val();
    
	
	
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

	if (stgCountsOfItems == "2"){
		countsOfItems = 2;
	}
	else if (stgCountsOfItems == "3") {
		countsOfItems = 3;
	}
	else if (stgCountsOfItems == "4") {
		countsOfItems = 4;
	}
	else if (stgCountsOfItems == "5") {
		countsOfItems = 5;
	}
    sessionStorage.setItem(session_prefix+'countsOfItems', countsOfItems);

	console.log("------------------countsOfItems--------------" + countsOfItems);
	
    level = 1;
    drawLevelCanvas(1);
    paint()
});

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
    paint()
    
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
    paint()
});


$("#stgDifficulty").change(function(){
    stgDifficulty = $("#stgDifficulty option:selected").val();
    sessionStorage.setItem(session_prefix+'stgDifficulty', stgDifficulty);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);

    imgInsertedCards = [];
    
    if (stgMode == "Trainer")
    {
		//$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));
		if (stgDifficulty == "Decimals")
			$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));
		else
			$("#moneysmallControl").text("$" + getTotalAmount());
    }
    paint()
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
    
    if(stgMode == "Game")
    {
		$("#moneysmall").hide();
    }
    else
    {
		$("#moneysmall").show();
    }
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    
    level = 1;
    drawLevelCanvas(1);
    
	imgInsertedCards = [];
    
    if (stgMode == "Trainer")
    {
		//$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));        
		if (stgDifficulty == "Decimals")
			$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));
		else
			$("#moneysmallControl").text("$" + getTotalAmount());
    }
    paint()
});

if($("#stgMode").val() =="Game")
{
	$("#moneysmall").hide();
//	$("input[id=moneysmall]").hide();
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
	imgInsertedCards = [];
	//console.log("----playgame---" + getTotalAmount().toFixed(2));
    newGame();
});

$("#btnSettings").click(function(){
    
    $("#preferencesBox").slideToggle();
});

$("#btnSubmit").click(function(){
    checkGuess(getTotalAmount());
    imgInsertedCards = [];
	imgSelectedNewcard.img = null;
    paint();
	if (stgMode == "Trainer")
    {
		//$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));        
		if (stgDifficulty == "Decimals")
			$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));
		else
			$("#moneysmallControl").text("$" + getTotalAmount());
    }
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
        checkGuess(getTotalAmount());
		imgInsertedCards = [];
		imgSelectedNewcard.img = null;
		paint();
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
        //console.log(guess.toFixed(2) + "," + randomQuestion.toFixed(2));
		var result_sum = 0;
		for (i = 0 ; i < countsOfItems ; i ++)
			result_sum += selectedQuestionNumbers[i];
		
        //if (guess.toFixed(2) == randomQuestion.toFixed(2)) {
		if (guess.toFixed(2) == result_sum.toFixed(2)) {
            showCheer();
            if (stgSounds === "On"){ correctSound.play() }
            score = score + pointvalue;
            $("#txtScore").text(padScore(score));
            levelcounter = levelcounter + 1;
            checklevel();
            showNewQuestion();
        }
        else {
            doStrike(result_sum, guess);
        }
    }
}

function doStrike(correct_answer, guess) {
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
    
    drawCorrection(correct_answer, guess);
    //console.log("Delaying...");
    setTimeout(hideStrikeLayer,4000);
    //console.log("After setTimeout");
}    

function drawCorrection(correct, incorrect){

    // clearPlayerCanvas(true);
    $("#txtQuestion").hide();
	
    $("#txtQuestion").html("<span class='questionWrongInstruction'>You answered: $" + (stgDifficulty == "Decimals" ? incorrect.toFixed(2) : incorrect) + ". Correct answer was: $" + (stgDifficulty == "Decimals" ? correct.toFixed(2) : correct) + "</span>").fadeIn();
	
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
	
	console.log("next question---" + countsOfItems);
	console.log("next question---" + randomMax);

    if (stgDifficulty == "Decimals") {
		for (i = 0; i < countsOfItems ; i++)
        {
			previousQuestion = randomQuestion
			
			while (randomQuestion == previousQuestion) 
				randomQuestion = randomInt(1, randomMax * 100);// / 100;
			randomQuestion = randomQuestion / 100.0;
			
			selectedQuestionNumbers[i] = randomQuestion;
		}
    } 
	else if (stgDifficulty == "Wholes") 
	{
		for (i = 0; i < countsOfItems ; i++)
		{
			previousQuestion = randomQuestion;
			while (randomQuestion == previousQuestion) 
				randomQuestion = randomInt(1, randomMax);// / 100;
			
			selectedQuestionNumbers[i] = randomQuestion;
		}
    }

    $("#txtQuestion").hide();
	
	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
	html = "<span class='questionInstruction'>Drop bills and coins to match </span><br><br>";
    //////////////////////////////////////////////////////////////////////////////////////////////////

	var questionString = "<span class = 'questionMeasurement'>";
	for (i = 0; i < countsOfItems ; i++)
	{
		if (i < countsOfItems - 1)
			questionString += ("$" + selectedQuestionNumbers[i] + " + ");
		else 
			questionString += ("$" + selectedQuestionNumbers[i] + "</span>");
	}
    //$("#txtQuestion").html(html + "<span class='questionMeasurement'> $ " + randomQuestion + " " + "</span>").fadeIn()
    $("#txtQuestion").html(html + questionString).fadeIn()

    if (stgTimer === "On"){
		if (startTime == 30)
			secs = startTime - 3 * (level - 1);
		else if (startTime == 60)
			secs = startTime - 7 * (level - 1);
        startTimer()
    }
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
    
    imgInsertedCards = [];
	if (stgDifficulty == "Decimals")
		$("#moneysmallControl").text("$" + getTotalAmount().toFixed(2));
	else
		$("#moneysmallControl").text("$" + getTotalAmount());
	imgSelectedNewcard.img = null;
    paint();
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