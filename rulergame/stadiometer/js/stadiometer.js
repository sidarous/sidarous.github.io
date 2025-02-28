var session_prefix ="stadiometer_"
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

var initStartTime = 40;
var sentScore = false

var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+"stgTimer");
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+"stgSounds");
var stgUnit = admin_settings['stgUnit']?admin_settings['stgUnit']:sessionStorage.getItem(session_prefix+"stgUnit");
var stgQuesType = admin_settings['stgQuesType']?admin_settings['stgQuesType']:sessionStorage.getItem(session_prefix+"stgQuesType");
var stgFraction = admin_settings['stgFraction']?admin_settings['stgFraction']:sessionStorage.getItem(session_prefix+"stgFraction");
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+"stgMode");
var stgQuesMode = admin_settings['stgQuesMode']?admin_settings['stgQuesMode']:sessionStorage.getItem(session_prefix+"stgQuesMode");

var windowWidth = $(window).width();;


var canvas = document.getElementById("myCanvas");
var canvasArea = document.getElementById("canvasArea");
/*drawing offset*/
var scale;
var xOffset;
var yOffset;
var dragMode = 0; //0 == none, 1 = world, 2 = vernier, 3 = object

var prev_mx, prev_my; //prev mouse positions
// var bgColor = "rgb(0,64,84)";
var bgColor = "rgb(255,255,255)";
var fgColor = "orange";//rgb(255,255,255)";
const scaleColor = "black";


var cr;

const scaleOriginX = 67; //jaw Left position
const scaleOriginY0 = 105; //105; //scale top position
const scaleOriginY = 205; //162; //scale bottom position
const offsetOriginX = 12; //distance of scale origin level from scaleOriginX
const vernierOriginX = 55; //distance of vernier origin in pixel in vernier.png
const vernierOriginY = 204; //161;

var cmUnit = 0.1;
var inchUnit = 0.125;
var smallUnit = inchUnit;

const cmScaleLengthPixels = canvas.height;
const inchScaleLengthPixels = canvas.height;
const cmScaleDivisions = 81; // 8.1cm : 81 scales per scroll screen
const cmTotalDivisions = 210 / cmUnit; // 210cm total
const inchTotalDivisions = 82 / inchUnit;

const inchProMax = 80;
const inchProMin = 40;
const cmProMax = 205;
const cmProMin = 100;
var scaleTotalDivisions = inchTotalDivisions;

var vernierScaleDivisions = 50;
var vernierScaleDivisionsForInch = 25;
var cm_pixels = cmScaleLengthPixels / cmScaleDivisions;
var inch_pixels = cm_pixels / cmUnit * 2.54 * inchUnit;
var small_pixels = inch_pixels;

var rulerWidth = 200;

var accel = 0;
var prev_delta = 0.0;
const add_accel_unit = 1.0;

var setUnit = function (unit) {
    if (unit == "Inch") {
        $("#stgQuesType").html("\
                <option value=\"Both\" selected>Both</option>\
                <option value=\"Feet and Inches\">Feet and Inches</option>\
                <option value=\"Inches\">Inches</option>");
        largeUnit = 50;
        smallUnit = inchUnit;
        small_pixels = inch_pixels;
        scaleTotalDivisions = inchTotalDivisions;
    } else if (unit == "Metric") {
        $("#stgQuesType").html("\
                <option value=\"Both\" selected>Both</option>\
                <option value=\"Meter and Centimeters\">Meters and Centimeters</option>\
                <option value=\"Centimeters\">Centimeters</option>");
        largeUnit = 20;
        smallUnit = cmUnit;
        small_pixels = cm_pixels;
        scaleTotalDivisions = cmTotalDivisions;
    }
    stgQuesType = "Both";
}


if (!stgTimer){
    stgTimer = "On";
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
}
if (!stgSounds){
    stgSounds = "On";
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
}

if (!stgUnit) {
    stgUnit = "Inch";
    sessionStorage.setItem(session_prefix+'stgUnit', stgUnit);
    setUnit(stgUnit);
}

if (!stgQuesType) {
    stgQuesType = "Both";
    sessionStorage.setItem(session_prefix+'stgQuesType', stgQuesType);
}

if (!stgFraction) {
    stgFraction = "Yes";
    sessionStorage.setItem(session_prefix+'stgFraction', stgFraction);
}

if(!stgMode)
{
    stgMode = "Game";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}

if (!stgQuesMode)
{
    stgQuesMode = "Find";
    sessionStorage.setItem(session_prefix+'stgQuesMode', stgQuesMode);
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgUnit").val(stgUnit);
$("#stgQuesType").val(stgQuesType);
$("#stgFraction").val(stgFraction);
$("#stgMode").val(stgMode);
$("#stgQuesMode").val(stgQuesMode);

document.getElementById("smallmsrControl").readOnly = true;

$("#smallmsrControl").hide();
		

function show_values_to_controls() {
    $("#smallmsrControl").val(msr);
}

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

$("#stgUnit").change(function(){
    stgUnit = $("#stgUnit option:selected").val();
    sessionStorage.setItem(session_prefix+'stgUnit', stgUnit);
    setUnit(stgUnit);
    msr_init();
    update();
});

$("#stgQuesType").change(function(){
    stgQuesType = $("#stgQuesType option:selected").val();
    sessionStorage.setItem(session_prefix+'stgQuesType', stgQuesType);
    msr_init();
    update();
});

$("#stgFraction").change(function(){
    stgFraction = $("#stgFraction option:selected").val();
    sessionStorage.setItem(session_prefix+'stgFraction', stgFraction);
    msr_init();
    update();
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
    
    if(stgMode == "Game")
    {
        $("#smallmsrControl").hide();
    }
    else
    {
        $("#smallmsrControl").show();
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
        $("#smallmsrControl").val(msr);
    }

    update();
});

$("#stgQuesMode").change(function(){
    stgQuesMode = $("#stgQuesMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgQuesMode', stgQuesMode);
    msr_init();
    update();
});

if($("#stgMode").val() =="Game")
{
	$("#smallmsrControl").hide();
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
    checkGuess(get_total_msr());
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
    if (stgUnit == "Inch") {
        msr = 60 * 8; //16;
    } else {
        msr = 150 * 10;
    }

    set_input_answer("Back");
    set_input_answer("Back");
    set_input_answer("Back");
    set_input_answer("Back");
    set_input_answer("Back");
    set_input_answer("Back");
    set_input_answer("Back");
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
    ////console.log(seconds);
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
    ctx.fillRect(0, initStartTime - seconds, 30, initStartTime);
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
        checkGuess(get_total_msr());
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
    ////console.log("Checking guess...");
    ////console.log("guess = " + guess);
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);
    if (gameover === true) {
        return false;
    }

	console.log("-------------------------");
    console.log(guess.toFixed(2) + "," + randomQuestion.val.toFixed(2));
	console.log("-------------------------");
    
    if (guess.toFixed(2) == randomQuestion.val.toFixed(2)) {
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

    ////console.log("...Finished Checking Guess");
}

function doStrike(guess) {
    pause = true;
    ////console.log("Doing Strike...");
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
    ////console.log("Delaying...");
    setTimeout(hideStrikeLayer,2500);
    ////console.log("After setTimeout");
}    

function drawCorrection(correct, incorrect){

    $("#txtQuestion").hide();

    if (stgQuesMode == "Find") {
        $("#txtQuestion").html("<span><span class='questionWrongInstruction'>You selected </span>" +
            question2HtmlString({
                val: incorrect,
                unit: randomQuestion.unit,
                quesType: randomQuestion.quesTypeFinal
            }, 1) + ".").fadeIn();
    } else {
        $("#txtQuestion").html("<span><span class='questionWrongInstruction'>Right answer was </span>" +
            question2HtmlString({
                val: randomQuestion.val,
                unit: randomQuestion.unit,
                quesType: randomQuestion.quesTypeFinal
            }, 1) + ".").fadeIn();
    }
	
    drawSections = stgRulerLength * stgRulerPrecision;
    var sectionWidth = (250 * stgRulerLength) / drawSections;
    var c = $("#playerCanvas");
    // var ctx = c[0].getContext('2d');      
    // var barLength = correct * sectionWidth;
    // ctx.fillStyle="#f44336";
    // ctx.fillRect(offsetLeft, 0, barLength, 30);
    // ctx.fillRect(30, 0, barLength, 30);
    ////console.log("...Finished Drawing Correction");
}


function hideStrikeLayer() {
    pause = false;
    ////console.log("Hiding Strike Layer...");
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
    // if ( (levelcounter === 10) && (level < 10) ) //
    if ( (levelcounter === 5) && (level < 10) ) {
        if(stgSounds === "On"){levelupSound.play();}
        level = level + 1;
        levelcounter = 0;
        pointvalue = pointvalue + 10;
        drawLevelCanvas(level);
        showCheerBoard("<h1>Level " + level + "</h1>",1000);
        //$("#txtQuestion").hide();
        //$("#txtQuestion").html("<span class='gameOver'>Level " + level + "</span><span class='questionMeasurement'>&nbsp;</span>").fadeIn();
    }
}

function clearPlayerCanvas(noFade){
    ////console.log("Clearing Player Canvas...");
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
    ////console.log("...Finished Clearing Player Canvas");
}

function drawHandle(ctx,x){
    ////console.log(ctx);
    ////console.log(x,(stgRulerLength * 256) + 2 + offsetLeft);
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

function isEqualQuestion(newQues, oldQues) {
    if (newQues == undefined || newQues.unit == undefined) {
        return true;
    }
    if (newQues.unit != oldQues.unit) {
        return false;
    }
    if (newQues.val == oldQues.val) {
        return true;
    }

    return false;
}

/*
 * str_type: 1-wrong measurement 0-question
 */
function question2HtmlString(ques, str_type) {
    var ret = "<span>";

    var cls_msr = str_type == 1 ? "questionWrongMeasurement" : "questionMeasurement";
    var cls_inst = str_type == 1 ? "questionWrongInstruction" : "questionInstruction";

    if (ques.unit == "Inch") {
        var arr_ques = ["Inches", "Feet and Inches"];
        var quesType = ques.quesType ? ques.quesType : stgQuesType;
        if (quesType == "Both") {
            quesType = arr_ques[randomInt(0, 1)];
            ques.quesTypeFinal = quesType;
        }
        //console.log(ques.val);
        if (quesType == "Inches") {
            ret += "<span class='" + cls_msr +"'>" + (stgFraction == "Yes" ? getFraction(ques.val) : ques.val) + "</span>" + "<span class='" + cls_inst +"'> inches</span>";
        } else {
            var feet_val = parseInt(ques.val / 12);
            var inch_val = (ques.val - feet_val * 12).toFixed(3);
            ret += (feet_val != 0 ? ("<span class='" + cls_msr + "'>" + feet_val + "</span>" + "<span class='" + cls_inst + "'> feet </span>") : "") +
                ((feet_val == 0 || inch_val != 0) ? "<span class='" + cls_msr + "'>" + (stgFraction == "Yes" ? getFraction(inch_val) : parseInt(inch_val).toFixed(0)) + "</span>" + "<span class='" + cls_inst + "'> inches</span>" : "");
        }
    } else {
    	//console.log("stgFraction : " + stgFraction);
    	//stgFraction = "No";
    	
        var arr_ques = ["Centimeters", "Meter and Centimeters"];
        var quesType = ques.quesType ? ques.quesType : stgQuesType;
        if (quesType == "Both") {
            quesType = arr_ques[randomInt(0, 1)];
            ques.quesTypeFinal = quesType;
        }
        if (quesType == "Centimeters") {
            ret += "<span class='"+ cls_msr + "'>" + (stgFraction == "Yes" ? getFraction(ques.val) : ques.val) + "</span>" + "<span class='" + cls_inst + "'> centimeters</span>";
            //ret += "<span class='"+ cls_msr + "'>" + (ques.val) + "</span>" + "<span class='" + cls_inst + "'> centimeters</span>";
        } else {
            var meter_val = parseInt(ques.val / 100);
            var cm_val = (ques.val - meter_val * 100).toFixed(1);
            ret += (meter_val != 0 ? ("<span class='"+ cls_msr + "'>" + meter_val + "</span>" + "<span class='" + cls_inst + "'> meter </span>") : "") +
                ((meter_val == 0 || cm_val != 0) ? "<span class='"+ cls_msr + "'>" + (stgFraction == "Yes" ? getFraction(cm_val) : parseInt(cm_val).toFixed(0)) + "</span>" + "<span class='" + cls_inst + "'> centimeters</span>" : "");
        }
    }

    return ret;
}

function showNewQuestion() {
    ////console.log("Showing New Question...");
    var html = "";
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    var max_pro_value = 1;
    var min_pro_value = 1;
    var max_pro_unit = 1;
    if (stgUnit == "Inch") {
        max_pro_value = inchProMax;
        min_pro_value = inchProMin;
        max_pro_unit = inchUnit;
        if (stgFraction == "Yes") {
        	max_pro_value /= inchUnit;
        	min_pro_value /= inchUnit;
        } else {
            max_pro_value = inchProMax ; //* inchUnit - 1;
        }
    } else {
        max_pro_value = cmProMax;
        min_pro_value = cmProMin;
        max_pro_unit = cmUnit;
        if (stgFraction == "Yes") {
        	max_pro_value /= cmUnit;
        	min_pro_value /= cmUnit;
        } else {
            max_pro_value = cmProMax ; //* cmUnit - 1;
        }
    }
    //console.log("max_pro_value " + max_pro_value);
    //console.log("min_pro_value " + min_pro_value);
    //console.log("max_pro_unit " + max_pro_unit);
    
    while (isEqualQuestion(randomQuestion, previousQuestion)) {
        var randomVal;
        if (stgFraction == "Yes") {
            randomVal = randomInt(min_pro_value, max_pro_value) * max_pro_unit;
        } else {
            randomVal = randomInt(min_pro_value, max_pro_value);
        }
        randomQuestion = {
            val: randomVal,
            unit: stgUnit
        };
        //console.log("randomQuestion : " + randomQuestion.val + " " + randomQuestion.unit);
    }

    $("#txtQuestion").hide()

	msr_init();
	
    if (stgQuesMode == "Find") {
        html = "<span class='questionInstruction'>Select </span>";
    
        $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + question2HtmlString(randomQuestion, 0) + ".</span>").fadeIn();
    } else {
        html = "<span class='questionInstruction'>Enter the number representing the height shown below.</span>";
    
        $("#txtQuestion").html(html).fadeIn();
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
        secs = initStartTime - 4 * (level-1);
        startTimer()
    }

    update();
}

function newGame() {
    $("#preferencesBox").hide();
    $("#buttonBar").hide();
    $("#questionBar").toggle();
    $("#txtScore").text("00000");
    drawTimer(40);        
    drawLevelCanvas(1);
    $("#txtStrikes").html("<span></span>");
    $("#strikeBoard").html("<span></span>");
    pointvalue = 10;
    levelcounter = 0;
    score = 0;
    level = 1;
    strikes = 0;       
    randomQuestion = {};
    gameover = false;
    allowMovement = true;
    timerRunning = false;
    
	msr_init();

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

$("#btnmsrdecrement").click(function(){
    //inputType = "Mouse";
    translateSmall(-1);
    update();
});

$("#btnmsrincrement").click(function(){
    //inputType = "Mouse";
    translateSmall(1);
    update();
});
