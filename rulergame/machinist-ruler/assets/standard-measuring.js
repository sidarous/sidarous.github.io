/*
 *------------------------------------------
 * The Ruler Game - Touchscreen Edition (v.3.0.0.1)
 *
 * Copyright 2018, Spears Technologies, Inc. and Ricky D. Spears
 * ALL RIGHTS RESERVED
 *
 * Copying, distributing, or making derivative works
 * of this source code is forbidden by U.S. and
 * international copyright law.
 * 
 * This script is being delivered to you AS IS. Spears Technologies, Inc. and Ricky D. Spears
 * makes no warranty as to its use or performance. SPEARS TECHNOLOGIES, INC. AND RICKY D. SPEARS 
 * DOES NOT AND CANNOT WARRANT THE PERFORMANCE OR RESULTS YOU MAY OBTAIN BY 
 * USING THIS SCRIPT OR DOCUMENTATION. SPEARS TECHNOLOGIES, INC. AND RICKY D. SPEARS MAKES 
 * NO WARRANTIES, EXPRESSED OR IMPLIED, AS TO NONINFRINGEMENT OF THIRD-PARTY 
 * RIGHTS, MERCHANTABILITY, OR FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT
 * WILL SPEARS TECHNOLOGIES, INC. OR RICKY D. SPEARS BE LIABLE TO YOU FOR ANY CONSEQUENTIAL,
 * INCIDENTAL, OR SPECIAL DAMAGES, ARISING FROM YOUR USE OF, OR YOUR INABILITY TO USE
 * THIS SCRIPT, INCLUDING ANY LOST PROFITS OR LOST SAVINGS,
 * EVEN IF A SPEARS TECHNOLOGIES, INC. AND RICKY D. SPEARS REPRESENTATIVE HAS BEEN ADVISED OF 
 * THE POSSIBILITY OF SUCH DAMAGES, OR FOR ANY CLAIM BY ANY THIRD PARTY.
 * ------------------------------------------
*/
$(document).ready(function(){
    "use strict";
    
    // Initialize settings
    var rgVersion = "";
    var pointvalue;
	var levelcounter;
	var score;
	var level;
	var strikes;
	var randomQuestion;
    var previousQuestion;
    var pause = false;
	var gameover = true;
	var timerRunning = false;
    var gameTimer;
    var secs;
    var measurement = [];
    var mousePos; 
    var touchPos;
    var drawSections;
    var guessSections;
    var maxRulerLength;
    var allowMovement = false;
    var maxRulerPrecision = 64;
    var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
    var offsetLeft = 30;
    var offsetRight = 30;
    var stgQuesMode = "Find";
    var stgFraction = "Yes";
    var stgScale = "Inches Random";
    var stgScaleFinal = "32nds";
    var input_answer = "000000";
    var ctx

    var stgTimer = Cookies.get('stgTimer');    
    var stgSounds = Cookies.get('stgSounds');
    var stgQuestionPrecision = Number(Cookies.get('stgQuestionPrecision'));
    var stgRulerPrecision = Number(Cookies.get('stgRulerPrecision'));
    var stgScale = (Cookies.get('stgScale'));
    var stgRulerLength = 2;
    var inputType = "Mouse";
    var inchScales = ['Inches Random','32nds','64ths','10ths','100ths']
    var metricScales = ['Metric Random','0.5mm','1mm']
    var unitGap = 512;
    var arr_quesInch = ["32nds", "64ths", "10ths", "100ths"];
    var arr_quesMetric = ["0.5mm", "1mm"];

    let show_num_start_x = 0; let show_num_start_y = 0;

    if(!stgTimer){
        stgTimer = "On";
        Cookies.set('stgTimer', stgTimer, { expires: 365 });
    }
    if(!stgSounds){
        stgSounds = "On";
        Cookies.set('stgSounds', stgSounds, { expires: 365 });
    }
    if(!stgQuestionPrecision) {
        stgQuestionPrecision=16;
        Cookies.set('stgQuestionPrecision', stgQuestionPrecision, { expires: 365 });
    }
    if(!stgRulerPrecision) {
        stgRulerPrecision=32;
        Cookies.set('stgRulerPrecision', stgRulerPrecision, { expires: 365 });
    } 
    if(!stgRulerLength) {
        stgRulerLength=2;
        Cookies.set('stgRulerLength', stgRulerLength, { expires: 365 });            
    }
    if(!stgScale) {
        stgScale = "Inches Random";
        Cookies.set('stgScale', stgScale, { expires: 365 });            
    }
    setStgRulerPrecision(stgScale)  
    showHideFraction()
          
    $("#stgTimer").val(stgTimer);
    $("#stgSounds").val(stgSounds);
    $("#stgQuestionPrecision").val(stgQuestionPrecision);
    $("#stgRulerPrecision").val(stgRulerPrecision);
    $("#stgRulerLength").val(stgRulerLength);
    resetGame()
    var set_input_answer = function (val) {
        var num_cnt = 0;

        if(stgScaleFinal == '32nds' || stgScaleFinal == '64ths'){
            num_cnt  = 5
        }
        if(stgScaleFinal == '10ths'){
            num_cnt  = 2
        }
        if(stgScaleFinal == '100ths'){
            num_cnt  = 3
        }
        if(stgScaleFinal == '0.5mm'){
            num_cnt  = 3
        }
        if(stgScaleFinal == '1mm'){
            num_cnt  = 2
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

        console.log(input_answer);
    }

    var get_total_value = function () {
        var ret = 0.0;        
        if(stgScaleFinal == '32nds' || stgScaleFinal == '64ths'){
            
            var str;
            var tmp1 = parseInt(`${input_answer[1]}${input_answer[2]}`);
            var tmp2 =parseInt(`${input_answer[3]}${input_answer[4]}`);
            let n = tmp1
            let d = tmp2
            if(parseInt(input_answer) == 0){
                str = 0
            }
            else if(tmp1 == 0 || tmp2 == 0){
                str = `${input_answer[0]}`
            }
            else{
                if(stgFraction == "Yes"){
                    n = (FractionReduce.reduce(tmp1, tmp2))[0];
                    d = (FractionReduce.reduce(tmp1, tmp2))[1];
                }
                if(input_answer[0] == 0){
                    str = `${n}/${d}`
                }
                else{
                    str = `${input_answer[0]} - ${n}/${d}`
                }
            }
            for(var i = 0; i < measurement?.length; i++){
                if(measurement[i] == str){
                    ret = i
                }
            }
            
        }
        else if(stgScaleFinal == '10ths'){ 
            var str = parseInt(input_answer)/10 
            for(var i = 0; i < measurement?.length; i++){
                if(measurement[i] == str){
                    ret = i
                }
            }
        }
        else if(stgScaleFinal == '100ths'){ 
            var str = parseInt(input_answer)/100
            for(var i = 0; i < measurement?.length; i++){
                if(measurement[i] == str){
                    ret = i
                }
            }
        }
        else if(stgScaleFinal == '0.5mm'){
            var str = parseInt(input_answer) /10
            for(var i = 0; i < measurement?.length; i++){
                if(measurement[i] == str){
                    ret = i
                }
            }
        }
        else if(stgScaleFinal == '1mm'){
            var str = parseInt(input_answer) 
            for(var i = 0; i < measurement?.length; i++){
                if(measurement[i] == str){
                    ret = i
                }
            }
        }
        return ret;
    }

    $("#btnSubmit").click(function(){
        checkGuess(get_total_value());
    })
    // Wire up settings controls to save settings to cookies
    $("#stgTimer").change(function(){
        stgTimer = $("#stgTimer option:selected").val();
        Cookies.set('stgTimer', stgTimer, { expires: 365 });
        resetGame();
        drawRuler();
    });
    $("#stgSounds").change(function(){
        stgSounds = $("#stgSounds option:selected").val();
        Cookies.set('stgSounds', stgSounds, { expires: 365 });
    });
    $("#stgQuestionPrecision").change(function(){
        stgQuestionPrecision = Number($("#stgQuestionPrecision option:selected").val());
        Cookies.set('stgQuestionPrecision', stgQuestionPrecision, { expires: 365 });
        if(stgQuestionPrecision > stgRulerPrecision){
            $("#stgRulerPrecision").val(stgQuestionPrecision).trigger('change');
        }
        resetGame();
        drawRuler();
    });
    $("#stgRulerPrecision").change(function(){
        stgRulerPrecision = Number($("#stgRulerPrecision option:selected").val());
        Cookies.set('stgRulerPrecision', stgRulerPrecision, { expires: 365 });
        if(stgRulerPrecision < stgQuestionPrecision){
           $("#stgQuestionPrecision").val(stgRulerPrecision).trigger('change');    
        }
        resetGame();
        drawRuler();
    });
    $("#stgRulerLength").change(function(){
        stgRulerLength = Number($("#stgRulerLength option:selected").val());
        Cookies.set('stgRulerLength', stgRulerLength, { expires: 365 });
        //fitRulerToScreen();
        resetGame();
        drawRuler();
    });
    $("#btnStart").click(function(){
        //inputType = "Mouse";
        newGame();
    });
    $("#btnSettings").click(function(){
        $("#preferencesBox").slideToggle();
    });
    
    
    $("#stgFraction").val(stgFraction);
    $("#stgQuesMode").val(stgQuesMode);

    $("#stgQuesMode").change(function(){
        stgQuesMode = ($("#stgQuesMode option:selected").val());
        Cookies.set('stgQuesMode', stgQuesMode, { expires: 365 });
        //fitRulerToScreen();
        resetGame();
        drawRuler();
    });
    
    $("#stgFraction").change(function(){
        stgFraction = ($("#stgFraction option:selected").val());
        Cookies.set('stgFraction', stgFraction, { expires: 365 });
        //fitRulerToScreen();
        resetGame();
        drawRuler();
    });
    
    function setStgRulerPrecision(stgScale){
        
        if(stgScale == 'Inches Random'){
            stgScaleFinal = arr_quesInch[randomInt(0, 3)];
        }
        else if(stgScale == 'Metric Random'){
            stgScaleFinal = arr_quesMetric[randomInt(0, 1)];
        }
        else{
            stgScaleFinal = stgScale
        }

        if(stgScaleFinal == '32nds'){
            stgRulerPrecision = 32;
            unitGap = 512
        }
        else if(stgScaleFinal == '64ths'){
            stgRulerPrecision = 64;
            unitGap = 512
        }
        else if(stgScaleFinal == '10ths'){
            stgRulerPrecision = 10;
            unitGap = 500;
        }
        else if(stgScaleFinal == '100ths'){
            stgRulerPrecision = 100;
            unitGap = 500;
        }
        else if(stgScaleFinal == '0.5mm'){
            stgRulerPrecision = 20;
            unitGap = 500;
        }
        else if(stgScaleFinal == '1mm'){
            stgRulerPrecision = 10;
            unitGap = 500;
        }
    }
    function showHideFraction(){
        if(stgScale == '32nds' || stgScale == '64ths' || stgScale == 'Inches Random'){
            $("#quesFraction").show();
        }
        else{
            $("#quesFraction").hide();
        }
    }
    $("#stgScale").change(function(){
        stgScale = ($("#stgScale option:selected").val());        
        Cookies.set('stgScale', stgScale, { expires: 365 });
        setStgRulerPrecision(stgScale)       
        showHideFraction() 
        resetGame();
        drawRuler();
    });

    window.addEventListener('touchstart', function onFirstTouch() {
        //console.log("Touched!");
        inputType = "Touch";
        window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);
    
    $(window).resize(function(){
         
        var prevWidth = window.innerWidth;

        window.addEventListener("resize", function() {
          var newWidth = window.innerWidth;

          if (prevWidth !== newWidth) {
             resetGameOnResize();
          }

          prevWidth = newWidth;
        });
       
    });




    //fitRulerToScreen();
    drawRuler();
    
    var correctSound = new Sound("assets/correct-plastic-click.mp3");
    var strikeSound = new Sound("assets/incorrect-plastic-click.mp3");    
    var levelupSound = new Sound("assets/level-up-plastic-click.mp3");
    var gameoverSound = new Sound("assets/game-over-plastic-click.mp3");


    function resetGameOnResize() {
      
        input_answer = "000000";
        endGame();
        strikes = 0;
        $("#txtStrikes").html("<span></span>");
        score = 0;
        $("#txtScore").html("<span></span>");
        level = 0;
        drawLevelCanvas(0);
        //fitRulerToScreen();
        drawRuler();
        console.log("resize trigger");
    }
    
    function drawPlayer(mousePos){
        //console.log("Drawing Player...");
        drawSections = stgRulerLength * stgRulerPrecision;
        var sectionWidth = (unitGap * stgRulerLength ) / drawSections;
        var c = $("#playerCanvas");
        var ctx = c[0].getContext('2d');
        ctx.canvas.height = 100;
        ctx.canvas.width = (stgRulerLength * unitGap) + 2 + offsetLeft + offsetRight;
        //ctx.fillStyle="#ddffdd";
        //ctx.fillRect(0,0,offsetLeft,100);
        //ctx.fillRect((stgRulerLength * unitGap) + 2 + offsetLeft,0,offsetRight,100);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(offsetLeft, 0, stgRulerLength * unitGap, 100);    
        //if((mousePos) && (allowMovement === true)){
        if(mousePos){
            //console.log('Player\'s Mouse position: ' + mousePos.x + ',' + mousePos.y);
            var canvasX = mousePos.x;
            var rulerX = mousePos.x - offsetLeft;
            if(rulerX<0){rulerX=0;}
            if(rulerX>(stgRulerLength * unitGap)){rulerX=stgRulerLength * unitGap;}
//console.log(canvasX,rulerX);
            var nearestSection = Math.round((rulerX) / sectionWidth);
            var barLength = nearestSection * sectionWidth;
            ctx.fillStyle="#339966";
            ctx.fillRect(offsetLeft,0,barLength,30);
            if(inputType === "Touch"){drawHandle(ctx,rulerX);}
        } else {
            clearPlayerCanvas(true);
        }
        //console.log("...Finished Drawing Player");
    }

    function drawCorrection(correct,incorrect){
        //console.log("Drawing Correction...");
        //console.log("correct = " + correct);        
        //console.log("incorrect = " + incorrect);
        //console.log("Correct = " + measurement[correct] +"; Your guess = " + measurement[incorrect]);
        clearPlayerCanvas(true);
        if(stgQuesMode == "Find"){
            let strUnit = "&quot;";
            if(stgScaleFinal == "1mm" || stgScaleFinal == "0.5mm"){
                strUnit = "mm"
            }
            $("#txtQuestion").hide();
            $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + measurement[incorrect] + strUnit + "</span>").fadeIn();
            // drawSections = stgRulerLength * maxRulerPrecision;
            drawSections = stgRulerLength * stgRulerPrecision;
            var sectionWidth = (unitGap * stgRulerLength ) / drawSections;
            var c = $("#playerCanvas");
            var ctx = c[0].getContext('2d');      
            var barLength = correct * sectionWidth;
            ctx.fillStyle="#f44336";
            ctx.fillRect(offsetLeft,0,barLength,30);
        }
        else{
            $("#txtQuestion").html("<span><span class='questionWrongInstruction'>Right answer was </span>" +question2HtmlString(measurement[correct]) + ".").fadeIn();
        }
        //console.log("...Finished Drawing Correction");
    }
    
/*
            var canvasX = mousePos.x;
            var rulerX = mousePos.x - offsetLeft;
            if(rulerX<0){rulerX=0;}
            if(rulerX>(stgRulerLength * unitGap)){rulerX=stgRulerLength * unitGap;}
//console.log(canvasX,rulerX);
            var nearestSection = Math.round((rulerX) / sectionWidth);
            var barLength = nearestSection * sectionWidth;
            ctx.fillStyle="#339966";
            ctx.fillRect(offsetLeft,0,barLength,30);  
*/    
    
    function question2HtmlString(val, str_type = 1) {
        var ret = "<span>";

        var cls_msr = str_type == 1 ? "questionWrongMeasurement" : "questionMeasurement";
        var cls_inst = str_type == 1 ? "questionWrongInstruction" : "questionInstruction";
        if(stgScaleFinal == '32nds' || stgScaleFinal == '64ths'){
            ret += "<span class='" + cls_msr +"'>" + val + "</span>" + "<span class='" + cls_inst +"'> inches</span>";
        }
        else if(stgScaleFinal == '100ths' || stgScaleFinal == '10ths'){
            ret += "<span class='" + cls_msr +"'>" + val + "</span>" + "<span class='" + cls_inst +"'> </span>";
        }
        else {
            ret += "<span class='" + cls_msr +"'>" + val + "</span>" + "<span class='" + cls_inst +"'> mm</span>";
        }

        return ret;
    }

    function clearPlayerCanvas(noFade){
        //console.log("Clearing Player Canvas...");
        var c = $("#playerCanvas");
        if(!noFade){ c.hide(); }
        var ctx = c[0].getContext('2d');
        ctx.canvas.height = 100;
        ctx.canvas.width = (stgRulerLength * unitGap) + 2 + offsetLeft + offsetRight; 
        //ctx.clearRect(0,0,(stgRulerLength * unitGap) + 2, 100);
        //ctx.fillStyle="#ddffdd";
        //ctx.fillRect(0,0,offsetLeft,100);
        //ctx.fillRect((stgRulerLength * unitGap) + 2 + offsetLeft, 0, offsetRight, 100); 
        ctx.fillStyle="#ffffff";
        ctx.fillRect(offsetLeft, 0, stgRulerLength * unitGap, 100);        
        if(inputType === "Touch"){ drawHandle(ctx,0); }
        //c.css('background-color','#ffffff !important');
        if(!noFade){ c.fadeIn(); }
        //console.log("...Finished Clearing Player Canvas");
    }
    
    function drawHandle(ctx,x){
        //console.log(ctx);
        //console.log(x,(stgRulerLength * unitGap) + 2 + offsetLeft);
        if(x > (stgRulerLength * unitGap)){
           x = (stgRulerLength * unitGap);
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
    
    function drawRuler(){
        //console.log("Drawing Ruler...");
        fitRulerToScreen();
        var c = $("#rulerCanvas");
        c.hide();
        ctx = c[0].getContext('2d');
        var markLen = [];
            markLen[1] = 48;
            markLen[2] = 38;
            markLen[4] = 28;
            markLen[8] = 22;
            markLen[16] = 16;
            markLen[32] = 10;
            markLen[64] = 6;
        
		const canvasContainer = document.getElementById('canvasArea');
		if(stgQuesMode == "Type"){
			ctx.canvas.height = 300;
			canvasContainer.style.height = '310px';
			$("#btnSubmit").show();
		}
		else {
			ctx.canvas.height = 150;
			canvasContainer.style.height = '160px';
			$("#btnSubmit").hide();
		}
        ctx.canvas.width = (stgRulerLength * unitGap) + 2 + offsetLeft + offsetRight;
        ctx.strokeStyle="#000000";
        ctx.lineWidth=2;
        ctx.font = "bold 24px Arial";
        ctx.strokeRect(1 + offsetLeft, 1 ,stgRulerLength * unitGap ,98);
        if(stgScaleFinal == '32nds'){
            stgRulerPrecision = 32;
            unitGap = 512
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 40
                    }
                    else if(i % 4 == 0){
                        markLenVal = 32
                    }
                    else if(i % 2 == 0){
                        markLenVal = 20
                    }
                    else{
                        markLenVal = 16
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    if(i % 4 == 0 && i!=stgRulerPrecision){
                        ctx.font = "bold 14px Arial";
                        ctx.fillText(i,x + offsetLeft-14,50);                    
                    }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText(l+1, (unitGap*(l+1))-14+offsetLeft, 65);
            }
        }
        else if(stgScaleFinal == '64ths'){
            stgRulerPrecision = 64;
            unitGap = 512
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 40
                    }
                    else if(i % 8 == 0){
                        markLenVal = 32
                    }
                    else if(i % 4 == 0){
                        markLenVal = 26
                    }
                    else if(i % 2 == 0){
                        markLenVal = 20
                    }
                    else{
                        markLenVal = 16
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    if(i % 8 == 0 && i!=stgRulerPrecision){
                        ctx.font = "bold 14px Arial";
                        ctx.fillText(i,x + offsetLeft-14,50);                    
                    }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText(l+1, (unitGap*(l+1))-14+offsetLeft, 65);
            }
        }
        else if(stgScaleFinal == '10ths'){
            stgRulerPrecision = 10;
            unitGap = 500;
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 44
                    }
                    else if(i % 1 == 0){
                        markLenVal = 38
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    if(i % 1 == 0 && i!=stgRulerPrecision){
                        ctx.font = "bold 14px Arial";
                        ctx.fillText(i,x + offsetLeft-14,50);                    
                    }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText(l+1, (unitGap*(l+1))-14+offsetLeft, 65);
            }
        }
        else if(stgScaleFinal == '100ths'){
            stgRulerPrecision = 100;
            unitGap = 500;
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 44
                    }
                    else if(i % 10 == 0){
                        markLenVal = 38
                    }
                    else if(i % 5 == 0){
                        markLenVal = 28
                    }
                    else{
                        let tmp = i%5
                        if(tmp == 2 || tmp == 3){
                            markLenVal = 20
                        }
                        else{
                            markLenVal = 16
                        }
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    if(i % 10 == 0 && i!=stgRulerPrecision){
                        ctx.font = "bold 14px Arial";
                        ctx.fillText(i/10,x + offsetLeft-14,50);                    
                    }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText(l+1, (unitGap*(l+1))-14+offsetLeft, 65);
            }
        }
        else if(stgScaleFinal == '0.5mm'){
            stgRulerPrecision = 20;
            unitGap = 500;
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 40
                    }
                    else if(i % 10 == 0){
                        markLenVal = 32
                    }
                    else if(i % 2 == 0){
                        markLenVal = 20
                    }
                    else{
                        markLenVal = 16
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    // if(i % 10 == 0 && i!=stgRulerPrecision){
                    //     ctx.font = "bold 14px Arial";
                    //     ctx.fillText(i,x + offsetLeft-14,50);                    
                    // }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText((l+1)*10, (unitGap*(l+1))-25+offsetLeft, 65);
            }
        }
        else if(stgScaleFinal == '1mm'){
            stgRulerPrecision = 10;
            unitGap = 500;
            for(var l = 0; l < stgRulerLength; l++) {
                for(var i = 1; i <= stgRulerPrecision; i++){
                    var gap = unitGap / stgRulerPrecision;
                    var x = (l * unitGap) + (i * gap);
                    var d = (FractionReduce.reduce(x, unitGap))[1];
                    let markLenVal = 16
                    if(i % stgRulerPrecision == 0){
                        markLenVal = 40
                    }
                    else if(i % 5 == 0){
                        markLenVal = 32
                    }
                    else if(i % 1 == 0){
                        markLenVal = 20
                    }
                    ctx.moveTo(x + offsetLeft,0);
                    ctx.lineTo(x + offsetLeft,markLenVal);
                    ctx.stroke();  
                    // if(i % 4 == 0 && i!=stgRulerPrecision){
                    //     ctx.font = "bold 14px Arial";
                    //     ctx.fillText(i,x + offsetLeft-14,50);                    
                    // }
                }
                ctx.font = "bold 24px Arial";
                ctx.fillText((l+1)*10, (unitGap*(l+1))-25+offsetLeft, 65);
            }
        }
        ctx.font = "bold 10px Arial";
        // ctx.fillText("Scale: " + stgScale,4+offsetLeft,66);       
        ctx.fillText("Graduation: " + stgScaleFinal,4+offsetLeft,80);
        ctx.fillText("Timer: " + stgTimer,4+offsetLeft,94);
        if(stgScaleFinal == '32nds' || stgScaleFinal == '64ths'){
            ctx.fillText("Simplifying fractions: " + stgFraction,64+offsetLeft,94);  
        }  
        // ctx.fillText("Precision: " + wordPrecision(stgRulerPrecision),64+offsetLeft,94);
        ctx.fillText(rgVersion,215+offsetLeft,94);
        c.fadeIn();
        clearPlayerCanvas(false);
        drawType(ctx)
        //console.log("...Finished Drawing Ruler");
    } 

    function drawType(ctx){
        let canvas = ctx.canvas
        if (stgQuesMode == "Type") {
            // show keyboards and input answer

            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1.5;
            ctx.fillRect(0 + 2, canvas.height / 2, canvas.width - 4, 100);
            // drawLine(ctx,0, canvas.height / 2 - 100, canvas.width , canvas.height / 2 - 100);
            //drawLine(-canvas.width / 2, canvas.height / 2 - 100, -canvas.width / 2, canvas.height / 2);
            //drawLine(-canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
            //drawLine(canvas.width / 2, canvas.height / 2 - 100, canvas.width / 2, canvas.height / 2);
            
            var input_type;
            console.log("randomQuestion====" + randomQuestion);
            
            
            
            if (stgScaleFinal == '32nds' || stgScaleFinal == '64ths') {
                show_num_start_x = 250; show_num_start_y = 160;
                if (stgFraction == "Yes") {
                    show_num_start_x -= 30;
                }
                ctx.fillStyle = "rgb(200, 200, 200)";
                // ctx.fillRect(show_num_start_x + 40 * 3, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 4, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 5 + 45, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 6 + 45, show_num_start_y, 30, 35);
                // if (stgFraction == "Yes") {
                    ctx.fillRect(show_num_start_x + 40 * 7 + 47, show_num_start_y, 30, 35);
                    ctx.fillRect(show_num_start_x + 40 * 8 + 45, show_num_start_y, 30, 35);
                // }
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = '18pt sans-serif';
                // outString(ctx, show_num_start_x + 40 * 4 + 35, show_num_start_y + 18, "feet", 0, 0);
                // if (stgFraction == "Yes") {
                    outString(ctx, show_num_start_x + 40 * 7 + 34, show_num_start_y + 15, "/", 0, 0);
                    outString(ctx, show_num_start_x + 40 * 9 + 35, show_num_start_y + 18, "inches", 0, 0);
                // } else {
                //     outString(ctx, show_num_start_x + 40 * 7 + 35, show_num_start_y + 18, "inches", 0, 0);
                // }

                if (input_answer) {
                    // outString(ctx, show_num_start_x + 40 * 3 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 4 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 5 + 5 + 45, show_num_start_y + 15, input_answer[1], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 6 + 5 + 45, show_num_start_y + 15, input_answer[2], 0, 0);
                    // if (stgFraction == "Yes") {
                        outString(ctx, show_num_start_x + 40 * 7 + 5 + 47, show_num_start_y + 15, input_answer[3], 0, 0);
                        outString(ctx, show_num_start_x + 40 * 8 + 5 + 45, show_num_start_y + 15, input_answer[4], 0, 0);
                    // }
                }
            } else if (stgScaleFinal == "10ths") {
                show_num_start_x = 300; show_num_start_y = 160;
               
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(show_num_start_x + 40 * 5, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 6, show_num_start_y, 30, 35);
                ctx.font = '20pt sans-serif';
                ctx.fillStyle = "rgb(0, 0, 0)";
                outString(ctx, show_num_start_x + 40 * 6-12, show_num_start_y + 22, ".", 0, 0);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = '18pt sans-serif';
                outString(ctx, show_num_start_x + 40 * 6 + 35, show_num_start_y + 18, "inches", 0, 0);

                if (input_answer) {
                    outString(ctx, show_num_start_x + 40 * 5 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 6 + 5, show_num_start_y + 15, input_answer[1], 0, 0);                 
                }
            }else if (stgScaleFinal == "100ths") {
                show_num_start_x = 300; show_num_start_y = 160;
               
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(show_num_start_x + 40 * 4, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 5, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 6, show_num_start_y, 30, 35);
                ctx.font = '20pt sans-serif';
                ctx.fillStyle = "rgb(0, 0, 0)";
                outString(ctx, show_num_start_x + 40 * 5-12, show_num_start_y + 22, ".", 0, 0);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = '18pt sans-serif';
                outString(ctx, show_num_start_x + 40 * 6 + 35, show_num_start_y + 18, "inches", 0, 0);

                if (input_answer) {
                    outString(ctx, show_num_start_x + 40 * 4 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 5 + 5, show_num_start_y + 15, input_answer[1], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 6 + 5, show_num_start_y + 15, input_answer[2], 0, 0);                  
                }
            }  else if (stgScaleFinal == "0.5mm") {
                show_num_start_x = 300; show_num_start_y = 160;
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(show_num_start_x + 40 * 4, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 5, show_num_start_y, 30, 35);
                ctx.font = '20pt sans-serif';
                ctx.fillStyle = "rgb(0, 0, 0)";
                outString(ctx, show_num_start_x + 40 * 6-9, show_num_start_y + 22, ".", 0, 0);
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(show_num_start_x + 40 * 6+5, show_num_start_y, 30, 35);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = '18pt sans-serif';
                outString(ctx, show_num_start_x + 40 * 6 + 35+5, show_num_start_y + 18, "mm", 0, 0);

                if (input_answer) {
                    outString(ctx, show_num_start_x + 40 * 4 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 5 + 5, show_num_start_y + 15, input_answer[1], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 6 + 5+5, show_num_start_y + 15, input_answer[2], 0, 0);
                }
            }
             else if (stgScaleFinal == "1mm") {
                show_num_start_x = 300; show_num_start_y = 160;
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(show_num_start_x + 40 * 5, show_num_start_y, 30, 35);
                ctx.fillRect(show_num_start_x + 40 * 6, show_num_start_y, 30, 35);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = '18pt sans-serif';
                outString(ctx, show_num_start_x + 40 * 6 + 35+5, show_num_start_y + 18, "mm", 0, 0);

                if (input_answer) {
                    outString(ctx, show_num_start_x + 40 * 5 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                    outString(ctx, show_num_start_x + 40 * 6 + 5, show_num_start_y + 15, input_answer[1], 0, 0);
                }
            }

            ctx.font = '18pt sans-serif';
            ctx.lineWidth = 2;
            show_num_start_x = 300; show_num_start_y = 210;
            for (let i = 0; i <= 9; i++) {
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(show_num_start_x + 40 * i - 5, show_num_start_y, 30, 30);

                ctx.fillStyle = "rgb(0, 0, 0)";
                outString(ctx, show_num_start_x + 40 * i, show_num_start_y + 15, i, 0, 0);
            }
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(show_num_start_x + 40 * 10 - 10, show_num_start_y, 30, 30);

            ctx.fillStyle = "rgb(0, 0, 0)";
            outString(ctx, show_num_start_x + 40 * 10 - 7, show_num_start_y + 15 - 3, "←", 0, 0);
        }
    }
    
    function drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function outString(ctx, x, y, s, x_align, y_align) {
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
        if(seconds<6) {ctx.fillStyle = "#ffc107";}
        if(seconds<3) {ctx.fillStyle = "#f44336";}
        //ctx.fillRect(0, 30-seconds*3, 30, 30);
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
    
    function showNewQuestion() {
        input_answer = "000000";
        drawType(ctx)
        setStgRulerPrecision(stgScale)        
        if(stgScale == 'Inches Random'){
            drawRuler();
            defineMeasurements();
        }
        else if(stgScale == 'Metric Random'){
            drawRuler();
            defineMeasurements();
        }
        //console.log("Showing New Question...");
        var html = "";
        allowMovement = true;
        if(levelcounter === 0){
            html = "<div class='level'>Level " + level + "</div>";
            showCheerBoard(html,1000);
        }
        previousQuestion = randomQuestion;
        if( (stgRulerLength ===1) && (stgQuestionPrecision === 1) ){ previousQuestion = 0; }
        // while ( (randomQuestion % (maxRulerPrecision / stgQuestionPrecision) !== 0) || (randomQuestion === previousQuestion) ) {
        while ( (randomQuestion === previousQuestion) ) {
            randomQuestion = Math.round((Math.random()*(guessSections-1))+1);
        }
        //console.log("randomQuestion = " + randomQuestion);
        $("#txtQuestion").hide();
        if (stgQuesMode == "Find") {
            if(inputType === "Touch"){
                html = "<span class='questionInstruction'>Drag to select</span><br>";
            } else {
                html = "<span class='questionInstruction'>Click to select</span><br>";
            }
            let strUnit = "&quot;";
            if(stgScaleFinal == "1mm" || stgScaleFinal == "0.5mm"){
                strUnit = "mm"
            }
            $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + measurement[randomQuestion] + strUnit+"</span>").fadeIn(); 
        }
        else{
            html = "<span class='questionInstruction'>Enter the number representing the length shown below.</span>";
            $("#txtQuestion").html(html).fadeIn(); 
            
                     
            drawSections = stgRulerLength * stgRulerPrecision;
            if(drawSections){
                var sectionWidth = (unitGap * stgRulerLength ) / drawSections;
                let rulerX = randomQuestion * sectionWidth
                let x = rulerX + offsetLeft;    
                drawPlayer({x:x, y:50});
            }
        }
        //$("#txtQuestion").html("<span class='questionMeasurement'>" + measurement[randomQuestion] + "</span>").fadeIn();         
        if (stgTimer === "On"){
            secs = 20 - (level-1)*3;
			secs = Math.max(secs, 3)
            startTimer();
        } 
        //console.log("...Finished Showing New Question");
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

    function checkGuess(guess) {
        //console.log("Checking guess...");
        //console.log("guess = " + guess);
        //guess = guess / (stgRulerPrecision / stgQuestionPrecision);        
        // guess = guess * (maxRulerPrecision / stgRulerPrecision);     
        guess = guess * (stgRulerPrecision / stgRulerPrecision);
        //console.log("guess = " + guess);
        allowMovement = false;
        timerRunning = false;
        clearTimeout(gameTimer);
        if (gameover === true) {
            return false;
        }
        if (guess === randomQuestion) {
            showCheer();
            if(stgSounds === "On"){correctSound.play();}
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
        strikes++;
        $("#strikeBoard").append("<img src='/images/strike.gif'>");
        $("#txtStrikes").append("<img src='/images/strike.gif'>");        
        $("#strikeBoard").show(); 
        drawCorrection(randomQuestion,guess);
        //console.log("Delaying...");
        setTimeout(hideStrikeLayer,2500);
        //console.log("After setTimeout");
    }    
    
    function hideStrikeLayer() {
        pause = false;
        //console.log("Hiding Strike Layer...");
        $("#strikeBoard").hide();
        clearPlayerCanvas(true);
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
        clearPlayerCanvas(true);
        drawTimer(0);
        gameover = true;
        $("#buttonBar").fadeIn();
        $("#questionBar").hide();
    }   
    
    function checklevel() {
        if ( (levelcounter === 10) && (level < 10) ) {
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
    
    function newGame() {
        // if((document.domain != "www.rulergame.net") && (document.domain != "rulergame.net")) {
        //     alert("The Ruler Game - Touchscreen Edition is not designed to be played offline.\nYou will now be redirected to the online game.");
        //     location.replace("https://www.rulergame.net/");
        // }
        defineMeasurements();
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
        
        var canvas = document.getElementById('rulerCanvas');
        canvas.addEventListener('mousemove', function(evt) {
            if(allowMovement && stgQuesMode=='Find'){
                mousePos = getMousePos(canvas, evt);
                drawPlayer(mousePos);
            }
          }, false);
        canvas.addEventListener('click', getMouseClick, false);
        canvas.addEventListener('mouseout', function(){
            if(allowMovement && stgQuesMode=='Find'){
                clearPlayerCanvas(true);
            }
          }, false);
        canvas.addEventListener('touchstart', function(evt) {
            if(allowMovement && stgQuesMode=='Find'){
                touchPos = getTouchPos(canvas, evt);
                //console.log(touchPos);
                drawPlayer(touchPos);
            }
          }, false);
        canvas.addEventListener('touchmove', function(evt) {
            if(allowMovement && stgQuesMode=='Find'){
                touchPos = getTouchPos(canvas, evt);
                //console.log(touchPos);
                drawPlayer(touchPos);
            }
          }, false);
         canvas.addEventListener('touchend', getTouchEnd, false);
        var defaultPrevent=function(e){e.preventDefault();};
        canvas.addEventListener("touchstart", defaultPrevent);
        canvas.addEventListener("touchmove" , defaultPrevent);
        window.addEventListener('keydown', onKeyEvent, false);
        
        // document.addEventListener("mousedown", mousePressed, false);
        // document.addEventListener("mouseup", mouseReleased, false);
        
        clearPlayerCanvas(true);
        showNewQuestion();
    }

    function onKeyEvent(e) {
        // //console.log(e.keycode);
        if (e.keyCode >= 96/*'0'*/ && e.keyCode <= 105/*'9'*/)  // when using numpad...
        {
            {
                set_input_answer("" + (e.keyCode - 96));
                drawType(ctx)
            }
        } else if (e.keyCode >= 48/*'0'*/ && e.keyCode <= 57/*'9'*/) {
            {
                set_input_answer("" + (e.keyCode - 48));
                drawType(ctx)
            }
        } else if (e.keyCode == 8/*BackSpace*/) {
            set_input_answer("Back");
            drawType(ctx)
        } else {
            // //console.log(e.keyCode);
            return false;
        }
        e.preventDefault();
    }
    
    function resetGame() {
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
    }


    function getMousePos(canvas, evt) {
        // from https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
      }
    
    function getMouseClick(me) {
        //console.log("Clicked on " + mousePos.x + ","+ mousePos.y);
        if (stgQuesMode == "Type") {
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

            var canvas = document.getElementById('rulerCanvas');
            var mousePosTmp = getMousePos(canvas, me);
            x = mousePosTmp.x
            y = mousePosTmp.y;
            console.log("x", x)
            if (y > (210) && y < (240)) {
                if (x > (295 + 40 * 10) && x < (335 + 40 * 10)) {
                    set_input_answer("Back");
                } else {
                    for (let i = 0; i <= 9; i++) {
                        if (x > (295 + 40 * i) && x < (335 + 40 * i)) {
                            set_input_answer("" + i);
                            break;
                        }
                    }
                }
            }
            drawType(ctx)
            return;
        } 

        if (pause || gameover)
            return

        //var canvasX = mousePos.x;
        var rulerX = mousePos.x - offsetLeft;
        drawSections = stgRulerLength * stgRulerPrecision;
        var sectionWidth = (unitGap * stgRulerLength ) / drawSections;
        var nearestSection = Math.round(rulerX / sectionWidth);
        checkGuess(nearestSection);
    }
    
    function getMousePosWindow(event) {
        return [event.clientX, event.clientY];
    }

    function getTouchPosWindow(event) {
        return [event.touches[0].pageX, event.touches[0].pageY];
    }


    function getTouchPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    }

    function getTouchEnd() {
        //console.log("Clicked on " + mousePos.x + ","+ mousePos.y);
        if (pause || gameover)
            return

        var rulerX = touchPos.x - offsetLeft;
        drawSections = stgRulerLength * stgRulerPrecision;
        var sectionWidth = (unitGap * stgRulerLength ) / drawSections;
        var nearestSection = Math.round(rulerX / sectionWidth);
        clearPlayerCanvas(true);
        checkGuess(nearestSection);
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
    
    function wordPrecision(setting){
        var word;
        switch(setting) {
            case 1:
                word="Wholes";
                break;
            case 2:
                word="Halves";
                break;
            case 4:
                word="Quarters";
                break;
            case 8:
                word="Eighths";
                break;
            case 16:
                word="Sixteenths";
                break;
            case 32:
                word="Thirtysecondths";
                break;
            case 64:
                word="Sixtyfourths";
                break;
            default:
                word="";
        }
        return word;
    }
    
    function padScore(num){
        return ("00000" + num).slice(-5);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function fitRulerToScreen(){
        maxRulerLength = Math.floor((window.innerWidth - 50)/unitGap);
        if(maxRulerLength === 0) {maxRulerLength = 1;}
        //console.log("maxRulerLength="+maxRulerLength);
        //if(maxRulerLength < stgRulerLength){
        if(maxRulerLength < Number($("#stgRulerLength option:selected").val()) ){
            stgRulerLength = maxRulerLength;
            $("#rulerLengthMessage").text("Will display as " + maxRulerLength + "\" based on your current browser size, screen size, and screen rotation.");            

        } else {
            $("#rulerLengthMessage").text("");
        }
    }
    
    function defineMeasurements() {
        //guessSections = stgRulerLength * stgRulerPrecision;
        // guessSections = stgRulerLength * maxRulerPrecision;
        guessSections = stgRulerLength * stgRulerPrecision;
        measurement = [];
        measurement[0] = 0;
        var counter1 = 0;
        var counter2 = 0;
        if(stgScaleFinal == '32nds' || stgScaleFinal == '64ths'){
            for(var l = 0; l < stgRulerLength; l++) {
                counter2 = 0;
                // for(var i = 1; i <= maxRulerPrecision; i++){
                for(var i = 1; i <= stgRulerPrecision; i++){
                    counter1++;
                    counter2++;
                    // var n = (FractionReduce.reduce(counter2, maxRulerPrecision))[0];
                    // var d = (FractionReduce.reduce(counter2, maxRulerPrecision))[1];
                    var n = counter2;
                    var d = stgRulerPrecision;
                    if(stgFraction == "Yes"){
                        n = (FractionReduce.reduce(counter2, stgRulerPrecision))[0];
                        d = (FractionReduce.reduce(counter2, stgRulerPrecision))[1];
                    }
                    var strMeasurement = "";
                    var strFraction = n + "/" + d;
                    if(strFraction === "1/1"){
                        strMeasurement = l + 1;
                    } else {
                        if(l > 0) {
                            strMeasurement = l + " - ";
                        }
                        strMeasurement += strFraction;
                    }
                    measurement[counter1] = strMeasurement;
                }
            }
        }
        
        if(stgScaleFinal == '10ths'){
            for(var l = 0; l < stgRulerLength; l++) {
                counter2 = 0;
                // for(var i = 1; i <= maxRulerPrecision; i++){
                for(var i = 1; i <= stgRulerPrecision; i++){
                    counter1++;
                    counter2++;
                    var n = counter2;
                    var d = stgRulerPrecision*l;
                    strMeasurement =  (n + d)/10;
                    measurement[counter1] = strMeasurement;
                }
            }
        }
        if( stgScaleFinal == '100ths'){
            for(var l = 0; l < stgRulerLength; l++) {
                counter2 = 0;
                // for(var i = 1; i <= maxRulerPrecision; i++){
                for(var i = 1; i <= stgRulerPrecision; i++){
                    counter1++;
                    counter2++;
                    var n = counter2;
                    var d = stgRulerPrecision*l;
                    var strFraction = n + d;
                    strMeasurement =  (n + d)/100;
                    measurement[counter1] = strMeasurement;
                }
            }
        }
        if( stgScaleFinal == '1mm'){
            for(var l = 0; l < stgRulerLength; l++) {
                counter2 = 0;
                // for(var i = 1; i <= maxRulerPrecision; i++){
                for(var i = 1; i <= stgRulerPrecision; i++){
                    counter1++;
                    counter2++;
                    var n = counter2;
                    var d = stgRulerPrecision*l;
                    strMeasurement =  (n + d);
                    measurement[counter1] = strMeasurement;
                }
            }
        }
        if( stgScaleFinal == '0.5mm'){
            for(var l = 0; l < stgRulerLength; l++) {
                counter2 = 0;
                // for(var i = 1; i <= maxRulerPrecision; i++){
                for(var i = 1; i <= stgRulerPrecision; i++){
                    counter1++;
                    counter2++;
                    var n = counter2;
                    var d = stgRulerPrecision*l;
                    strMeasurement =  (n + d)/2;
                    measurement[counter1] = strMeasurement;
                }
            }
        }
        console.log(guessSections);
        console.log(measurement);
    }


}); //===========================================================================================
var FractionReduce = (function(){
    "use strict";
    // from https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
    //Euclid's Algorithm
    var getGCD = function(n, d){
        var numerator = (n<d)?n:d;
        var denominator = (n<d)?d:n;        
        var remainder = numerator;
        var lastRemainder = numerator;

        while (true){
            lastRemainder = remainder;
            remainder = denominator % numerator;
            if (remainder === 0){
                break;
            }
            denominator = numerator;
            numerator = remainder;
        }
        if(lastRemainder){
            return lastRemainder;
        }
    };

    var reduce = function(n, d){
        var gcd = getGCD(n, d);

        return [n/gcd, d/gcd];
    };

    return {
            getGCD:getGCD,
            reduce:reduce
           };

}());