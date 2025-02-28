// Money Counting
// 2023.11.21
var session_prefix ="money_counting_"
var cheers = ["Awesome!", "Great job!", "You got it!", "Wonderful!","Bravo!","Brilliant!","Excellent!","Fantastic!","Hurray!","Incredible!","Marvelous!","Nice job!","On target!","Outstanding!","Perfect!","Super!","Sweeeeet!","Terrific!","Amazing!","That's right!","Very good!","Well done!","Yeeeesss!"];
var levelcounter;
var score;
var level;
var strikes;
var gameTimer;
// var randomQuestion;
var gameover = true;
var previousQuestion;
var secs;
var allowMovement = false;
var stgRulerLength = 10;
var stgRulerPrecision = 10;

var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+'stgTimer');
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+'stgSounds');
var stgChange = admin_settings['stgChange']?admin_settings['stgChange']:sessionStorage.getItem(session_prefix+'stgChange');
var stgIsRandomChange = "false";
var stgMode = "Game";

var windowWidth = $(window).width();;

var possible_bills=[1, 5, 10, 20, 50, 100];
var possible_coins = [1, 5, 10, 25, 50];
var MAX_BILL = 100;
var MAX_COIN = 50;

if (!stgTimer){
    stgTimer = "On";
    
}
if (!stgSounds){
    stgSounds = "On";
    
}

if(!stgChange)
{
    stgChange = "Random";
}


if(!stgMode)
{
    stgMode = "Game";
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgChange").val(stgChange);
$("#stgMode").val(stgMode);
$("#moneysmall").hide();
//$("moneysmallControl").hide();

function setChange(str, isFirst) {
    if (str == "Random") {
        stgIsRandomChange = true;
        // if (isFirst) {
        //     stgChange = "Coins";
        // } else {
        var changes = ["Coins", "Bills"]; //, "Bills and Coins"];
        var nRandom = Math.floor((Math.random() * changes.length));
        stgChange = changes[nRandom];
        // }
    } else {
        stgIsRandomChange = false;
        stgChange = str;
    }
	
	update();
}

document.getElementById("moneysmallControl").readOnly = true;

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
    paint();
    
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
    paint();
});


$("#stgChange").change(function(){
    stgChange = $("#stgChange option:selected").val();
    sessionStorage.setItem(session_prefix+'stgChange', stgChange);
    console.log(stgChange);
    setChange(stgChange, false);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    level = 1;
    drawLevelCanvas(1);

    imgInsertedCards = [];
	imgSelectedNewcard.img = null;
    
    if (stgMode == "Trainer")
    {
		$("#moneysmallControl").text("$" + getTotalAmount());
    }
    paint();
});

$("#stgMode").change(function(){
    stgMode = $("#stgMode option:selected").val();
    
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
    
    if (stgMode == "Trainer")
    {
		$("#moneysmallControl").text("$" + getTotalAmount());        
    }
    paint();
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
		if (stgMode == "Trainer")
		{
			$("#moneysmallControl").text("$" + getTotalAmount());        
		}
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
        console.log(guess.toFixed(2) + "," + randomQuestion.change.toFixed(2));

        if (guess.toFixed(2) == randomQuestion.change.toFixed(2)) {
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
    $("#txtQuestion").html("<span class='questionWrongInstruction'>You answered: </span><span class='questionWrongMeasurement'>$" + incorrect + ". Correct answer was: $" + correct.change.toFixed(2) +  "<br>&nbsp;</span>").fadeIn();
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
        $("#txtQuestion").html("<span class='gameOver'>Game Over</span><span class='questionMeasurement'><br>&nbsp;</span>").fadeIn();
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

function isEqualQuestion(ques1, ques2) {
	if (ques1 === undefined || ques2 === undefined)
		return false;
    return ques1.total_amount === ques2.total_amount && ques1.pay === ques2.pay && ques1.change === ques2.change;
}

function isNoChange(val) {
    var bill = parseInt(val);
    var coin = parseInt(val * 100) - bill * 100;

    var temp = bill;
    var i;
    for (i = possible_bills.length - 1; i >= 0; i --) {
        if (temp == bill) {
            temp = temp % possible_bills[i];
        } else if (temp < possible_bills[i]) {
            continue;
        } else {
            temp -= possible_bills[i];
        }
        if (temp === 0) {
            break;
        }
    }
    if (i === -1) {
        return false;
    }

    temp = coin;
    for (i = possible_coins.length - 1; i >= 0; i --) {
        if (temp == coin) {
            temp = temp % possible_coins[i];
        } else if (temp < possible_coins[i]) {
            continue;
        } else {
            temp -= possible_coins[i];
        }
        if (temp === 0) {
            break;
        }
    }
    if (i === -1) {
        return false;
    }

    return true;
}

function makePay(val, changeType) {
    console.log("Total amount: ", val);
	
    var retPay = {bills: {}, coins: {}, value: 0};
    var bill = parseInt(val);
    var coin = Math.round((val - bill) * 100);

	if (changeType === "Coins") {
		retPay.bills["1"] = bill;
		retPay.value += bill;
	} else if (changeType === "Bills and Coins") {
		var one_pos = coin % 10;
		if (one_pos >= 5) {
			retPay.coins["5"] = 1;
			retPay.value += 0.05;
			one_pos -= 5;
			coin -= 5;
		}
        retPay.coins["1"] = one_pos;
        retPay.value += retPay.coins["1"] * 0.01;
		coin -= retPay.coins["1"];
		
		var temp_arr = [0, 10, 50];
		for (var index = temp_arr.length - 1; index > 0; index --) {
			if (coin + temp_arr[index] < 100) {
				temp_arr.splice(index, 1);
			}
		}
		var added_coin = temp_arr[randomInt(0, temp_arr.length - 1)];
		coin += added_coin;
		if (coin > 100) {
			bill += parseInt(coin / 100);
			coin = coin % 100;
		}
		if (coin !== 0) {
			for (var i = possible_coins.length - 1; i >= 0; i --) {
				retPay.coins[possible_coins[i]] = parseInt(coin / possible_coins[i]);
				retPay.value += possible_coins[i] * retPay.coins[possible_coins[i]] * 0.01;
				coin = coin % possible_coins[i];
				if (coin === 0) {
					break;
				}
			}
		}
    }

    var i;
    var temp;
    var possible_cands = [];
    if (changeType !== "Coins") {
        temp = bill;
        for (i = possible_bills.length - 1; i >= 0; i --) {
            retPay.bills[possible_bills[i]] = 0;

            if (temp == bill) {
                retPay.bills[possible_bills[i]] = parseInt(temp / possible_bills[i]);
                retPay.value += possible_bills[i] * retPay.bills[possible_bills[i]];
                temp = temp % possible_bills[i];
				if (temp === 0) {
					break;
				}

                if ((changeType === "Bills and Coins" && (retPay.value + possible_bills[i] - bill) < 20) ||
                    (changeType !== "Bills and Coins")) {
                    var newRetPay = JSON.parse(JSON.stringify(retPay));
                    newRetPay.bills[possible_bills[i]] ++;
                    newRetPay.value += possible_bills[i];
					newRetPay.value = Math.round(newRetPay.value * 100) / 100;
					possible_cands.push(newRetPay);
                }
            } else if (temp >= possible_bills[i]) {
                retPay.bills[possible_bills[i]] = parseInt(temp / possible_bills[i]);
                retPay.value += possible_bills[i] * retPay.bills[possible_bills[i]];
                temp = temp % possible_bills[i];
				if (temp === 0) {
					break;
				}
                
                if ((changeType === "Bills and Coins" && (retPay.value + possible_bills[i] - bill) < 20) ||
                    (changeType !== "Bills and Coins")) {
                    var newRetPay = JSON.parse(JSON.stringify(retPay));
                    newRetPay.bills[possible_bills[i]] ++;
                    newRetPay.value += possible_bills[i];
                    newRetPay.value = Math.round(newRetPay.value * 100) / 100;
					possible_cands.push(newRetPay);
                }
            } else {
                if ((changeType === "Bills and Coins" && (retPay.value + possible_bills[i] - bill) < 20) ||
                    (changeType !== "Bills and Coins")) {
                    var newRetPay = JSON.parse(JSON.stringify(retPay));
                    newRetPay.bills[possible_bills[i]] ++;
                    newRetPay.value += possible_bills[i];
                    newRetPay.value = Math.round(newRetPay.value * 100) / 100;
					possible_cands.push(newRetPay);
                }
            }
            //console.log(temp, JSON.stringify(possible_cands));
        }
    }
    if (changeType !== "Bills") {
        temp = coin;
        for (i = possible_coins.length - 1; i >= 0; i --) {
            if (changeType === "Bills and Coins" && possible_coins[i] < 10) {
                continue;
            }
            retPay.coins[possible_coins[i]] = 0;
			
            if (temp == coin) {
                retPay.coins[possible_coins[i]] = parseInt(temp / possible_coins[i]);
                retPay.value += possible_coins[i] * retPay.coins[possible_coins[i]] * 0.01;
				retPay.value = Math.round(retPay.value * 100) / 100;
                temp = temp % possible_coins[i];
                if (temp === 0) {
                    break;
                }

                var newRetPay = JSON.parse(JSON.stringify(retPay));
                newRetPay.coins[possible_coins[i]] ++;
                newRetPay.value += possible_coins[i] * 0.01;
				newRetPay.value = Math.round(newRetPay.value * 100) / 100;
                possible_cands.push(newRetPay);
            } else if (temp >= possible_coins[i]) {
                retPay.coins[possible_coins[i]] = parseInt(temp / possible_coins[i]);
                retPay.value += (possible_coins[i] * retPay.coins[possible_coins[i]] * 0.01);
                temp = temp % possible_coins[i];
                if (temp === 0) {
                    break;
                }
                
                var newRetPay = JSON.parse(JSON.stringify(retPay));
                newRetPay.coins[possible_coins[i]] ++;
                newRetPay.value += possible_coins[i] * 0.01;
                newRetPay.value = Math.round(newRetPay.value * 100) / 100;
                possible_cands.push(newRetPay);
            } else {
                var newRetPay = JSON.parse(JSON.stringify(retPay));
                newRetPay.coins[possible_coins[i]] ++;
                newRetPay.value += possible_coins[i] * 0.01;
                newRetPay.value = Math.round(newRetPay.value * 100) / 100;
                possible_cands.push(newRetPay);
            }
            //console.log(temp, JSON.stringify(possible_cands));
        }
    }
	
	if (changeType === "Bills") {
		possible_bills.map(bill_unit => {
			var newRetPay = JSON.parse('{"bills":[],"coins":[],"value":0}');
			var real_val = bill + bill_unit;
			if (bill_unit < 100 && bill_unit >= 10 && real_val < 300) {
				for (var i = possible_bills.length - 1; i >= 0; i --) {
					newRetPay.bills[possible_bills[i]] = parseInt(real_val / possible_bills[i]);
					newRetPay.value += possible_bills[i] * newRetPay.bills[possible_bills[i]];
					real_val -= possible_bills[i] * newRetPay.bills[possible_bills[i]];
					if (real_val == 0) {
						break;
					}
				}
				
				if (real_val == 0 && (newRetPay.bills[bill_unit] <= 0)) {
					var same_index = possible_cands.findIndex(item => {
						var ret = true;
						Object.entries(item.bills).map(each_bill_cnt => {
							if (each_bill_cnt[1] !== newRetPay[each_bill_cnt[0]]) {
								ret = false;
								return;
							}
						});
						return ret;
					});
					if (same_index < 0) {
						newRetPay.value = Math.round(newRetPay.value * 100) / 100;
						possible_cands.push(newRetPay);
					}
				}
			}
		});
	} else if (changeType === "Coins") {
		possible_coins.map(coin_unit => {
			var newRetPay = JSON.parse('{"bills":[],"coins":[],"value":0}');
			newRetPay.bills["1"] = bill;
			newRetPay.value += bill;
			var real_val = coin + coin_unit;
			if (coin_unit >= 10 && real_val < 300) {
				for (var i = possible_coins.length - 1; i >= 0; i --) {
					newRetPay.coins[possible_coins[i]] = parseInt(real_val / possible_coins[i]);
					newRetPay.value += possible_coins[i] * newRetPay.coins[possible_coins[i]] * 0.01;
					real_val -= possible_coins[i] * newRetPay.coins[possible_coins[i]];
					if (real_val == 0) {
						break;
					}
				}
				
				if (real_val == 0 && (newRetPay.coins[coin_unit] <= 0)) {
					var same_index = possible_cands.findIndex(item => {
						var ret = true;
						Object.entries(item.coins).map(each_coin_cnt => {
							if (each_coin_cnt[1] !== newRetPay[each_coin_cnt[0]]) {
								ret = false;
								return;
							}
						});
						return ret;
					});
					if (same_index < 0) {
						newRetPay.value = Math.round(newRetPay.value * 100) / 100;
						possible_cands.push(newRetPay);
					}
				}
			}
		});
	}

    // console.log(JSON.stringify(possible_cands));
	possible_cands = possible_cands.filter(item => {
		var bill_cnt = 0, coin_cnt = 0;
		Object.entries(item.bills).map(item => {
			bill_cnt += item[1];
		});
		Object.entries(item.coins).map(item => {
			coin_cnt += item[1];
		});
		if (bill_cnt > 8 || bill_cnt + coin_cnt > 12) {
			return false;
		}
		return true;
	});
    //console.log(JSON.stringify(possible_cands));
	console.log(possible_cands);
	if (possible_cands.length > 0) {
        var ret = possible_cands[randomInt(0, possible_cands.length - 1)];
        return ret;
    } else {
        return undefined;
    }
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

    if (stgIsRandomChange) {
        setChange("Random", false);
    }

	// stgChange = "Bills";
	// stgChange = "Coins";
	// stgChange = "Bills and Coins";
	if (stgChange == "Coins") {
        while (isEqualQuestion(randomQuestion, previousQuestion)) {
            var randomTotalAmount = randomInt(1, 300);
            randomTotalAmount = randomTotalAmount / 100.0;
            if (isNoChange(randomTotalAmount)) {
                continue;
            }
			// randomTotalAmount = 0.69;
            var randomPay = makePay(randomTotalAmount, stgChange);
			if (randomPay === undefined)
				continue;
            randomQuestion = {
                total_amount: randomTotalAmount,
                pay: randomPay,
                change: randomPay.value - randomTotalAmount
            };
        }
    } else if (stgChange == "Bills") {
        while (isEqualQuestion(randomQuestion, previousQuestion)) {
            var randomTotalAmount = randomInt(1, 300);
            if (isNoChange(randomTotalAmount)) {
                continue;
            }
			// randomTotalAmount = 117;
            var randomPay = makePay(randomTotalAmount, stgChange);
			if (randomPay === undefined)
				continue;
            randomQuestion = {
                total_amount: randomTotalAmount,
                pay: randomPay,
                change: randomPay.value - randomTotalAmount
            };
        }
    } else if (stgChange == "Bills and Coins") {
        while (isEqualQuestion(randomQuestion, previousQuestion)) {
            var randomTotalAmount = randomInt(1, 30000);
            randomTotalAmount = randomTotalAmount / 100.0;
			if (isNoChange(randomTotalAmount)) {
                continue;
            }
			// randomTotalAmount = 197.75;
            var randomPay = makePay(randomTotalAmount, stgChange);
			if (randomPay === undefined)
				continue;
            randomQuestion = {
                total_amount: randomTotalAmount,
                pay: randomPay,
                change: randomPay.value - randomTotalAmount
            };
        }
    }

    $("#txtQuestion").hide();
	
	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
	html = "<span class='questionInstruction'>Price is: </span>";
    html += "<span class='questionMeasurement'> $" + randomQuestion.total_amount + "</span><br>";
    html += "<span class='questionInstruction'> Buyer gives you: </span><br>&nbsp";
    //html += "<span class='questionMeasurement'> $ " + randomQuestion.pay.value + "</span>";
    //////////////////////////////////////////////////////////////////////////////////////////////////

    $("#txtQuestion").html(html).fadeIn()
    

    if (stgTimer === "On"){
        
        // if( level < 4)
        // {
        //     secs = 40 - 3*(level-1);
        // }
        // else
        // {
        //     secs = 40 - 3*(level-1) - 1;
        // }
        secs = 30 - 4 * (level - 1);
        startTimer()
    }
	
	update();
}


function newGame() {
    $("#preferencesBox").hide();
    $("#buttonBar").fadeOut();
    // $("#questionBar").toggle();
    $("#questionBar").css("display", "flex");
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
    randomQuestion = {total_amount: 0, pay: {bills: {}, coins: {}, value: 0}, change: 0};
    gameover = false;
    allowMovement = true;
    timerRunning = false;
    
    imgInsertedCards = [];
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