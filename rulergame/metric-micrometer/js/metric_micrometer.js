// Imperial Micrometer 
// 2022.08

var session_prefix ="metric_micrometer_"
var   canvas=document.getElementById("rulerCanvas");
var   ctx=canvas.getContext("2d");

var canvas_offset_left = canvas.offsetLeft;
var canvas_offset_top = canvas.offsetTop;

var sleeve_width = 100;
var sleeve_height = 250;
var sleeve_top_left_x = 200;
var sleeve_top_left_y = 100;
var sleeve_bottom_left_x = sleeve_top_left_x;
var sleeve_bottom_left_y = sleeve_top_left_y + sleeve_height;

var	width=canvas.width;
var height=canvas.height;

var sleeve_top_right_x = sleeve_top_left_x + sleeve_width;
var sleeve_top_right_y = sleeve_top_left_y;
var sleeve_bottom_right_x = sleeve_bottom_left_x + sleeve_width;
var sleeve_bottom_right_y = sleeve_bottom_left_y;


var thimble_mid_top_x = sleeve_top_right_x + 100;
var thimble_mid_top_y = sleeve_top_right_y - 50;
var thimble_mid_bottom_x = sleeve_bottom_right_x + 100;
var thimble_mid_bottom_y = sleeve_bottom_right_y + 50;

var thimble_right_top_x = thimble_mid_top_x + 100;
var thimble_right_top_y = thimble_mid_top_y;
var thimble_right_bottom_x = thimble_mid_bottom_x + 100;
var thimble_right_bottom_y = thimble_mid_bottom_y;

var thimble_start_y = sleeve_bottom_right_y;

var micrometer_value = 0;
let sleeve_small_scale = [];
var sleeve_small_scale_value = 0;
let thimble_scale = [];
var thimble_scale_value = 0;
let sleeve_main_scale = [];
var sleeve_main_scale_value = 20;

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
sleeve_change_value = 0;

var input_answer = "00000";

var stgTimer = admin_settings['stgTimer']?admin_settings['stgTimer']:sessionStorage.getItem(session_prefix+'stgTimer');    
var stgSounds = admin_settings['stgSounds']?admin_settings['stgSounds']:sessionStorage.getItem(session_prefix+'stgSounds');
var stgMode = admin_settings['stgMode']?admin_settings['stgMode']:sessionStorage.getItem(session_prefix+'stgMode');
var stgVernierScale = admin_settings['stgVernierScale']?admin_settings['stgVernierScale']:sessionStorage.getItem(session_prefix+'stgVernierScale');


var windowWidth = $(window).width();;

//if ( !jQuery.browser.mobile ) {
//	alert("imperial_micrometer.js");
//}

if (!stgTimer){
    stgTimer = "On";
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
}
if (!stgSounds){
    stgSounds = "On";
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
    
}


if(!stgMode)
{
    stgMode = "Game";
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
}


if (!stgVernierScale){
    stgVernierScale = "On";
    sessionStorage.setItem(session_prefix+'stgVernierScale', stgVernierScale);
    
}

$("#stgTimer").val(stgTimer);
$("#stgSounds").val(stgSounds);
$("#stgMode").val(stgMode);
$("#stgVernierScale").val(stgVernierScale);

$("#stgTimer").change(function(){
    stgTimer = $("#stgTimer option:selected").val();
    sessionStorage.setItem(session_prefix+'stgTimer', stgTimer);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");

    // level = 0;
    // drawLevelCanvas(0);
    level = 1;
    drawLevelCanvas(1);
    
    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
});


$("#stgSounds").change(function(){
    stgSounds = $("#stgSounds option:selected").val();
    sessionStorage.setItem(session_prefix+'stgSounds', stgSounds);
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    // level = 0;
    // drawLevelCanvas(0);
    level = 1;
    drawLevelCanvas(1);
    
    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
});



$("#stgVernierScale").change(function(){
    stgVernierScale = $("#stgVernierScale option:selected").val();
    sessionStorage.setItem(session_prefix+'stgVernierScale', stgVernierScale);
    

    if(stgVernierScale == "Off")
    {
        $("#sleevesmall").hide();
    }
    else
    {
        $("#sleevesmall").show();
    }

    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    // level = 0;
    // drawLevelCanvas(0);
    level = 1;
    drawLevelCanvas(1);
    
    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
});

$("#modeSelection").change(function(){
    stgMode = $("#stgMode option:selected").val();
    sessionStorage.setItem(session_prefix+'stgMode', stgMode);
    
    if(stgMode == "Game")
    {
        $("input[type=number]").hide();
    }
    else
    {
        $("input[type=number]").show();
    }
    
    strikes = 0;
    $("#txtStrikes").html("<span></span>");
    score = 0;
    $("#txtScore").html("<span></span>");
    $("#txtScore").text("00000");
    
    // level = 0;
    // drawLevelCanvas(0);
    level = 1;
    drawLevelCanvas(1);
    
    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
});

if($("#stgMode").val() =="Game")
{
    // $("#number").hide();
    $("input[type=number]").hide();
}

$("#btnStart").click(function(){
    //inputType = "Mouse";
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
    if(stgMode == "Type"){
        if(stgVernierScale=="On"){
            checkGuess(input_answer/1000);
        }
        else{
            checkGuess(input_answer/100);
        }
    }
    else{
        checkGuess(micrometer_value);
    }
})

var set_input_answer = function (val) {
    var num_cnt = 0;

    if(stgVernierScale=="On"){
        num_cnt  = 5
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

    console.log(input_answer);
}

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
        
        ctx.clearRect(0, 0, width, height);
        DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
    }
});


var defaultPrevent = function(e){ e.preventDefault() };
canvas.addEventListener("touchstart", defaultPrevent);
canvas.addEventListener("touchmove" , defaultPrevent);

DisplayScales();
DrawSleeveMainChange()
DrawThimbleChange();
DrawSleeveSmallChange()

// DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
// DisplayScales();
// var html = "<input type='number' id='sleevemainControl' name='sleevemain' min='0' max='0.975' style='left: 150px; top: -120px;' 'step='0.025'>";
// $("#sleevemain").html(html).show();


canvas.addEventListener("mousemove", on_mousemove, false);
canvas.addEventListener("mousedown", on_mousedown, false);
canvas.addEventListener("mouseup", on_mouseup, false);
// document.addEventListener("mousemove", on_mousemove, false);
// document.addEventListener("mousedown", on_mousedown, false);
// document.addEventListener("mouseup", on_mouseup, false);

document.addEventListener('touchstart', on_mousedown, false);
document.addEventListener('touchmove', on_mousemove, false);
document.addEventListener('touchend', on_mouseup, false);
// canvas.addEventListener('touchstart', on_mousedown, false);
// canvas.addEventListener('touchmove', on_mousemove, false);
// canvas.addEventListener('touchend', on_mouseup, false);
// canvas.addEventListener("click", on_click, false);

var correctSound = new Sound("./assets/correct-plastic-click.mp3");
var strikeSound = new Sound("./assets/incorrect-plastic-click.mp3");    
var levelupSound = new Sound("./assets/level-up-plastic-click.mp3");
var gameoverSound = new Sound("./assets/game-over-plastic-click.mp3");

window.addEventListener('touchstart', function onFirstTouch() {
    //console.log("Touched!");
    // inputType = "Touch";
    window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

$("#txtScore").text("00000");
drawLevelCanvas(1);
drawTimer(0);

// for (var i = 0; i < 3; i++)
// {
//     $("#txtStrikes").append("<img src='images/strike.gif'>");
//     $("#strikeBoard").show();
// }

// showCheer();



function DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y)
{
    // sleeve curve
    
    SleeveContour(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y);
    
    // Drawing Thimble Contour
    ThimbleContour (sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y);

    // Drawing thimble scale
    DrawThimbleScale(thimble_start_y);

    // Drawing the sleeve small scale

    
    ctx.lineWidth=1;
    
    var sleeve_main_scale_start_y = sleeve_top_left_y + 150;
   
    // Drawing Sleeve main scale

    ctx.moveTo(sleeve_top_left_x, sleeve_main_scale_start_y);
    ctx.lineTo(sleeve_top_right_x, sleeve_main_scale_start_y);
    //ctx.stroke();
    var sleeve_main_FontSize = "30px";
    var	sleeve_main_FontStyle = "Times new romans";
    var sleeve_main_Font = sleeve_main_FontSize + " " + sleeve_main_FontStyle;
    var sleeve_main_index = 0;
    for (let k = 0; k < 51; k++)
    {
        if ( sleeve_top_left_x + k*8 < sleeve_top_right_x )
        {
            if ( k % 10 == 0)
            {
                ctx.moveTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y);
                ctx.lineTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y + 50);
                ctx.font = sleeve_main_Font;
                if (k <= 10)
                {
                    ctx.fillText(k / 2, sleeve_top_left_x + k*8 -10, sleeve_main_scale_start_y + 80);
                }
                else if ( sleeve_top_left_x + k*8 + 10 < sleeve_top_right_x )
                {
                    ctx.fillText(k / 2, sleeve_top_left_x + k*8 -15, sleeve_main_scale_start_y + 80);
                }
                
            }
            else if( k % 2 == 0)
            {
                ctx.moveTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y);
                ctx.lineTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y + 30);
            }
            else
            {
                ctx.moveTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y);
                ctx.lineTo(sleeve_top_left_x + k*8, sleeve_main_scale_start_y + 15);
            }
        }
        else
        {
            sleeve_main_index = k - 1;
            break;
        }

        
    }
    
    for (let n = 0; n <= 50; n++)
    {
        if ((thimble_scale[n] >= sleeve_main_scale_start_y) && (thimble_scale[n+1] < sleeve_main_scale_start_y))
        {
            thimble_scale_value = Math.round(n)/100.0;
        }
    }
   
    var sleeve_small_FontSize = "10px";
    var	sleeve_small_FontStyle = "Times new romans";
    var sleeve_small_Font = sleeve_small_FontSize + " " + sleeve_small_FontStyle;
    
    for (let j = 0; j < 10; j++)
    {
        ctx.moveTo(sleeve_top_left_x, sleeve_top_left_y + 29 + j*9);
        ctx.lineTo(sleeve_top_right_x, sleeve_top_right_y + 29 + j*9 );
        ctx.font = sleeve_small_Font;
        ctx.fillText(9-j, sleeve_top_left_x-10, sleeve_top_left_y + 33 + j*9);
    }

    // Calculating the Sleeve Small Scale Value
    for (let j = 0; j < 10; j++)
    {
        sleeve_small_scale[j] = sleeve_top_left_y + 29 + j*9;
        
        for ( let k = 0; k < 41; k++)
        {
            if (sleeve_small_scale[j] == thimble_scale[k])
            {
                sleeve_small_scale_value = (9-j)/1000;
            }
        }
    }
    //console.log("sleeve_small_scale_value = ", sleeve_small_scale_value);
    sleeve_main_scale_value = Math.round(1000*sleeve_main_index*0.5)/1000;
    
    if (sleeve_main_scale_value < 0)
    {
        sleeve_main_scale_value = 0;
    }
    //console.log("sleeve_main_scale_value = ", sleeve_main_scale_value);
    
    // micrometer value
    // micrometer_value = Math.round(1000*(Math.round(10*sleeve_main_scale_value)/10 + Math.round(100*thimble_scale_value)/100 + Math.round(1000*sleeve_small_scale_value)/1000))/1000;
    // console.log("total_value = ", micrometer_value);
    CalculateMicroValue();
    // micrometer_value = Math.round(10*(sleeve_main_scale_value))/10 + Math.round(100*(thimble_scale_value))/100 + Math.round(1000*(sleeve_small_scale_value))/1000;

    var sleeve_main_FontSize = "20px";
    var	sleeve_main_FontStyle = "Times new romans";
    var sleeve_main_Font = sleeve_main_FontSize + " " + sleeve_main_FontStyle;
    ctx.font = sleeve_main_Font;

    // ctx.fillText('Sleeve main', 10, 420);
    
	// // ctx.fillText(sleeve_main_scale_value, 150, 420);
    // var sleevemain_left = 150;
    // $("#sleevemainControl").val(sleeve_main_scale_value);
    // // if ($("#sleevemainControl").val() < 0)
    // // {
    // //     $("#sleevemainControl").val(0);
    // // }

    //ctx.fillText('Thimble scale', 10, 450);
    
	// // ctx.fillText(thimble_scale_value, 150, 450);
    // $("#thimbleControl").val(thimble_scale_value);
    // // if ($("#thimbleControl").val() < 0)
    // // {
    // //     $("#thimbleControl").val(0);
    // // }

    // ctx.fillText('sleeve small', 10, 480);
    //ctx.fillText('Vernier scale', 10, 480);
    
	// // ctx.fillText(sleeve_small_scale_value, 150, 480);
    // $("#sleevesmallControl").val(sleeve_small_scale_value);
    // // if ($("#sleevesmallControl").val() < 0)
    // // {
    // //     $("#sleevesmallControl").val(0);
    // // }
    
    if (stgMode == "Trainer")
    {
        ctx.fillText('Micrometer Value', 300, 480);
        ctx.fillText(micrometer_value, 500, 480);
    }
    else
    {
        ctx.fillStyle = "white";
        ctx.fillRect(300, 460, 300, 30);
    }
    
    // //ctx.stroke();

    ctx.stroke();

    drawType()
    
    
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Timer: " + stgTimer,4,ctx.canvas.height - 40);
    ctx.fillText("Mode: " + (stgMode=='Trainer'?'Training':stgMode) ,4,ctx.canvas.height - 40 + 14);        
    ctx.fillText("Vernier Scale: " + (stgVernierScale),4,ctx.canvas.height - 40 + 14 + 14);
}


function drawType(){
    let canvas 
    var c = $("#typeCanvas");
    var ctx = c[0].getContext('2d');
    canvas = ctx.canvas
    if(stgMode == "Type"){
        ctx.canvas.height = 120;
        ctx.canvas.width = 465
        // $("#btnSubmit").show();
        $("#detailedControl").hide();
	}
	else {
        ctx.canvas.height = 0;
        ctx.canvas.width = 465
        // $("#btnSubmit").hide();
        $("#detailedControl").show();
        
	}
    
    if (stgMode == "Type") {
        // show keyboards and input answer

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.fillRect(0 + 2, 0, canvas.width - 4, 120);
        // drawLine(ctx,0, canvas.height / 2 - 100, canvas.width , canvas.height / 2 - 100);
        //drawLine(-canvas.width / 2, canvas.height / 2 - 100, -canvas.width / 2, canvas.height / 2);
        //drawLine(-canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
        //drawLine(canvas.width / 2, canvas.height / 2 - 100, canvas.width / 2, canvas.height / 2);
        
        var input_type;
        
        
        
        {
            show_num_start_x = 20; show_num_start_y = 20;
            // if (stgFraction == "Yes") {
            //     show_num_start_x -= 30;
            // }
            ctx.fillStyle = "rgb(200, 200, 200)";
            // ctx.fillRect(show_num_start_x + 40 * 3, show_num_start_y, 30, 35);
            ctx.fillRect(show_num_start_x + 40 * 2 + 45, show_num_start_y, 30, 35);
            ctx.fillRect(show_num_start_x + 40 * 3 + 45, show_num_start_y, 30, 35);
            ctx.fillRect(show_num_start_x + 40 * 4 + 45, show_num_start_y, 30, 35);
            ctx.fillRect(show_num_start_x + 40 * 5 + 45, show_num_start_y, 30, 35);
            if(stgVernierScale=="On"){
                ctx.fillRect(show_num_start_x + 40 * 6 + 45, show_num_start_y, 30, 35);
            }
            
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = '18pt sans-serif';
            outString(ctx, show_num_start_x + 40 * 4 + 34, show_num_start_y + 20, ".", 0, 0);

            if (input_answer) {
                outString(ctx, show_num_start_x + 40 * 2 + 45 + 5, show_num_start_y + 15, input_answer[0], 0, 0);
                outString(ctx, show_num_start_x + 40 * 3 + 45 + 5, show_num_start_y + 15, input_answer[1], 0, 0);
                outString(ctx, show_num_start_x + 40 * 4 + 45 + 5, show_num_start_y + 15, input_answer[2], 0, 0);
                outString(ctx, show_num_start_x + 40 * 5 + 45 + 5, show_num_start_y + 15, input_answer[3], 0, 0);
                if(stgVernierScale=="On"){
                    outString(ctx, show_num_start_x + 40 * 6 + 45 + 5, show_num_start_y + 15, input_answer[4], 0, 0);
                }
            }
        } 

        ctx.font = '18pt sans-serif';
        ctx.lineWidth = 2;
        show_num_start_x = 20; show_num_start_y = 70;
        for (let i = 0; i <= 9; i++) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(show_num_start_x + 40 * i - 5, show_num_start_y, 30, 30);

            ctx.fillStyle = "rgb(0, 0, 0)";
            outString(ctx, show_num_start_x + 40 * i, show_num_start_y + 15, (i+1)%10, 0, 0);
        }
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.strokeRect(show_num_start_x + 40 * 10, show_num_start_y, 30, 30);

        ctx.fillStyle = "rgb(0, 0, 0)";
        outString(ctx, show_num_start_x + 40 * 10 , show_num_start_y + 15 - 3, "←", 0, 0);
    }
}


function GetMicrometerCoordinates(micrometer_value) {
    const sleeve_main_scale_value = Math.floor(micrometer_value / 0.5) * 0.5;
    
    const sleeve_top_right_x = sleeve_top_left_x + (sleeve_main_scale_value/0.125 + 1)*2;
    
    const remainder_after_main = micrometer_value - sleeve_main_scale_value;

    // Step 2: Calculate thimble_scale_value (step 0.001)
    const thimble_scale_value = Math.floor(remainder_after_main / 0.01) * 0.01;
    const remainder_after_thimble = remainder_after_main - thimble_scale_value;

    // Step 3: Calculate sleeve_small_scale_value (step 0.0001) if vernier is on
    let sleeve_small_scale_value = 0;
    if (stgVernierScale === "On") {
        sleeve_small_scale_value = Math.round(remainder_after_thimble / 0.001) * 0.001;
    }

    // Calculate total thimble displacement (0.001 + 0.0001)

    thimble_start_y = sleeve_bottom_right_y - (60 - thimble_scale_value / 0.01) * 10;
    // var thimble_interval  = (thimble_val/0.001)*10
    // thimble_start_y = thimble_start_y + thimble_interval;

    if (thimble_start_y < sleeve_top_right_y)
    {
        thimble_start_y = thimble_start_y + 2*sleeve_height;
    }
    else if (thimble_start_y > sleeve_bottom_right_y)
    {
        thimble_start_y = thimble_start_y - 2*sleeve_height;
    }
    
    thimble_start_y = thimble_start_y  + sleeve_small_scale_value;

    

    if (thimble_start_y < sleeve_top_right_y)
    {
        thimble_start_y = thimble_start_y + 2*sleeve_height;
    }
    else if (thimble_start_y > sleeve_bottom_right_y)
    {
        thimble_start_y = thimble_start_y - 2*sleeve_height;
    }
        
        
    return { sleeve_top_right_x, thimble_start_y };
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

// Drawing Sleeve Contour
function SleeveContour(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y)
{
    
    ctx.lineWidth=5;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(sleeve_top_left_x,sleeve_top_left_y);
    ctx.bezierCurveTo(sleeve_top_left_x - 100,sleeve_top_left_y, sleeve_top_left_x -100,sleeve_bottom_left_y, sleeve_bottom_left_x,sleeve_bottom_left_y);
    ctx.stroke();
    //ctx.fill();
       
    ctx.moveTo(sleeve_top_left_x, sleeve_top_left_y);
    ctx.lineTo(sleeve_top_right_x, sleeve_top_right_y);

    ctx.moveTo(sleeve_bottom_left_x, sleeve_bottom_left_y);
    ctx.lineTo(sleeve_bottom_right_x, sleeve_bottom_right_y);
    
    ctx.stroke();
}


// Drawing Thimble contour
function ThimbleContour (sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y)
{
    
    ctx.lineWidth=10;
    ctx.beginPath();
    ctx.fillStyle = "#eeeeee";
    ctx.moveTo(sleeve_top_right_x, sleeve_top_right_y);
    ctx.lineTo(thimble_mid_top_x, thimble_mid_top_y);
    ctx.lineTo(thimble_right_top_x, thimble_right_top_y);
    ctx.lineTo(thimble_right_bottom_x, thimble_right_bottom_y);
    ctx.lineTo(thimble_mid_bottom_x, thimble_mid_bottom_y);
    ctx.lineTo(sleeve_bottom_right_x, sleeve_bottom_right_y);
    ctx.lineTo(sleeve_bottom_right_x, sleeve_bottom_right_y);
    ctx.moveTo(thimble_mid_top_x, thimble_mid_top_y);
    ctx.lineTo(thimble_mid_bottom_x, thimble_mid_bottom_y);
    ctx.stroke();  
    ctx.fill();
}


// Drawing Thimble scale
function DrawThimbleScale(thimble_start_y)
{
    ctx.fillStyle = "#000000";
    var thimble_FontSize = "20px";
    var	thimeble_FontStyle = "Times new romans";
    var thimble_Font = thimble_FontSize + " " + thimeble_FontStyle;
    //let thimble_scale = [];
    for (let i = 0; i <= 50; i++)
    {
        thimble_scale[i] = thimble_start_y - i * 10;
		
        if (thimble_scale[i] < sleeve_top_right_y)
        {
            // Athimble_scale[i] += sleeve_height;
            thimble_scale[i] += 2 * sleeve_height;
        }
        else if (thimble_scale[i] > sleeve_bottom_right_y)
        {
            // thimble_scale[i] -= sleeve_height;
            thimble_scale[i] -= 2 * sleeve_height;
        }
		
		thimble_scale[i] = Math.floor(thimble_scale[i] + 0.5);
		console.log("thimble_scale[" + i + "]=" + thimble_scale[i]);

        //thime_scale_x
        // if ( i % 5 == 0)
        // {
        //     ctx.moveTo(sleeve_bottom_right_x, thimble_scale[i] );
        //     ctx.lineTo(sleeve_bottom_right_x + 50, thimble_scale[i]);
        //     ctx.font=thimble_Font;
        //     if (i / 5 < 5)
        //     {
        //         ctx.fillText(i, sleeve_bottom_right_x + 50, thimble_scale[i]);
        //     }
            
        // }
        // else
        // {
        //     ctx.moveTo(sleeve_bottom_right_x, thimble_scale[i] );
        //     ctx.lineTo(sleeve_bottom_right_x + 15, thimble_scale[i]);
        // }

        if ( i % 5 == 0)
        {
            
            ctx.font=thimble_Font;
            if (i / 5 < 10)
            {
                if (thimble_scale[i] < sleeve_top_right_y)
                {
                    continue;
                }
                else if (thimble_scale[i] > sleeve_bottom_right_y)
                {
                    continue;
                }
                // ctx.fillText(i, sleeve_bottom_right_x + 50, thimble_scale[i]);
                ctx.moveTo(sleeve_bottom_right_x, thimble_scale[i] );
                ctx.lineTo(sleeve_bottom_right_x + 50, thimble_scale[i]);
                ctx.fillText(i, sleeve_bottom_right_x + 50, thimble_scale[i]);
            }
        }
        else
        {
            if (thimble_scale[i] < sleeve_top_right_y)
            {
                continue;
            }
            else if (thimble_scale[i] > sleeve_bottom_right_y)
            {
                continue;
            }
            ctx.moveTo(sleeve_bottom_right_x, thimble_scale[i] );
            ctx.lineTo(sleeve_bottom_right_x + 15, thimble_scale[i]);
        }


    }
   
}


var isMouseDown = false;

var down_x = 0;
var down_y = 0;
var move_x = 0;
var move_y = 0;
var rect;

function getCoordinates(evt)
{
    rect=canvas.getBoundingClientRect();
    x = evt.touches[0].clientX - rect.left,
    y = evt.touches[0].clientY - rect.top
    return {x:x, y:y};
}

function on_mousemove (ev) 
{
    //windowWidth = $(window).width();
    var x, y;

    // if (ev.layerX || ev.layerX == 0) 
    // { 
        // x = ev.layerX;
        // y = ev.layerY;
    // }

    // rect=canvas.getBoundingClientRect();

    // console.log(isMouseDown);
    if (isMouseDown)
    {
        if ((ev.type == "touchmove"))
        {
            // x = ev.touches[0].clientX;
            // y = ev.touches[0].clientY;

            x = ev.touches[0].pageX;
            y = ev.touches[0].pageY;

            // alert("touch move!!!")
            // alert(x);
            // alert(y);
            // console.log(x);
            // console.log(y);
            x = x - canvas.offsetLeft;
            y = y - canvas.offsetTop;
            // x = x - rect.left;
            // y = y - rect.top;
            // console.log(x);
            // console.log(y);
            // console.log("type is touchmove");

            move_x = x - down_x;
            move_y = y - down_y;
            down_x = x;
            down_y = y;

        // if (isMouseDown)
        // {
    
            sleeve_top_right_x = sleeve_top_right_x + move_x;
            sleeve_top_right_y = sleeve_top_right_y;
            sleeve_bottom_right_x = sleeve_bottom_right_x + move_x;
            sleeve_bottom_right_y = sleeve_bottom_right_y;


            thimble_mid_top_x = thimble_mid_top_x + move_x;
            thimble_mid_top_y = thimble_mid_top_y;
            thimble_mid_bottom_x = thimble_mid_bottom_x + move_x;
            thimble_mid_bottom_y = thimble_mid_bottom_y;

            thimble_right_top_x = thimble_right_top_x + move_x;
            thimble_right_top_y = thimble_right_top_y;
            thimble_right_bottom_x = thimble_right_bottom_x + move_x;
            thimble_right_bottom_y = thimble_right_bottom_y;
            thimble_start_y = thimble_start_y + move_y;

            if (sleeve_top_right_x < sleeve_top_left_x)
            {
                sleeve_top_right_x = sleeve_top_left_x;  
                sleeve_bottom_right_x = sleeve_top_left_x;
                thimble_mid_top_x = sleeve_bottom_right_x + 100;
                thimble_mid_bottom_x = thimble_mid_top_x;
                thimble_right_top_x = thimble_mid_top_x + 100;
                thimble_right_bottom_x = thimble_right_top_x;
            }
            else if (sleeve_top_right_x > sleeve_top_left_x + 400)
            {
                sleeve_top_right_x = sleeve_top_left_x + 400;
                sleeve_bottom_right_x = sleeve_bottom_left_x + 400;
                thimble_mid_top_x = sleeve_bottom_right_x + 100;
                thimble_mid_bottom_x = thimble_mid_top_x;
                thimble_right_top_x = thimble_mid_top_x + 100;
                thimble_right_bottom_x = thimble_right_top_x;
            }

            if (thimble_start_y < sleeve_top_right_y)
            {
                // thimble_start_y = thimble_start_y + sleeve_height;
                thimble_start_y = thimble_start_y + 2*sleeve_height;
            }
            else if (thimble_start_y > sleeve_bottom_right_y)
            {
                // thimble_start_y = thimble_start_y - sleeve_height;
                thimble_start_y = thimble_start_y - 2*sleeve_height;
            }

            ctx.clearRect(0, 0, width, height);
            DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);

            // micrometer_value = Math.round(10000*(sleeve_main_scale_value + thimble_scale_value + sleeve_small_scale_value))/10000;
            DisplayScales();

        } 
        else {
            // x = ev.clientX;
            // y = ev.clientY;
            x = ev.layerX;
            y = ev.layerY;
            // console.log("type is mouse");
        // }
        
            move_x = x - down_x;
            move_y = y - down_y;
            down_x = x;
            down_y = y;

        // if (isMouseDown)
        // {
    
            sleeve_top_right_x = sleeve_top_right_x + move_x;
            sleeve_top_right_y = sleeve_top_right_y;
            sleeve_bottom_right_x = sleeve_bottom_right_x + move_x;
            sleeve_bottom_right_y = sleeve_bottom_right_y;


            thimble_mid_top_x = thimble_mid_top_x + move_x;
            thimble_mid_top_y = thimble_mid_top_y;
            thimble_mid_bottom_x = thimble_mid_bottom_x + move_x;
            thimble_mid_bottom_y = thimble_mid_bottom_y;

            thimble_right_top_x = thimble_right_top_x + move_x;
            thimble_right_top_y = thimble_right_top_y;
            thimble_right_bottom_x = thimble_right_bottom_x + move_x;
            thimble_right_bottom_y = thimble_right_bottom_y;
            thimble_start_y = thimble_start_y + move_y;

            if (sleeve_top_right_x < sleeve_top_left_x)
            {
                sleeve_top_right_x = sleeve_top_left_x;  
                sleeve_bottom_right_x = sleeve_top_left_x;
                thimble_mid_top_x = sleeve_bottom_right_x + 100;
                thimble_mid_bottom_x = thimble_mid_top_x;
                thimble_right_top_x = thimble_mid_top_x + 100;
                thimble_right_bottom_x = thimble_right_top_x;
            }
            else if (sleeve_top_right_x > sleeve_top_left_x + 400)
            {
                sleeve_top_right_x = sleeve_top_left_x + 400;
                sleeve_bottom_right_x = sleeve_bottom_left_x + 400;
                thimble_mid_top_x = sleeve_bottom_right_x + 100;
                thimble_mid_bottom_x = thimble_mid_top_x;
                thimble_right_top_x = thimble_mid_top_x + 100;
                thimble_right_bottom_x = thimble_right_top_x;
            }

            if (thimble_start_y < sleeve_top_right_y)
            {
                // thimble_start_y = thimble_start_y + sleeve_height;
                thimble_start_y = thimble_start_y + 2*sleeve_height;
            }
            else if (thimble_start_y > sleeve_bottom_right_y)
            {
                // thimble_start_y = thimble_start_y - sleeve_height;
                thimble_start_y = thimble_start_y - 2*sleeve_height;
            }

            ctx.clearRect(0, 0, width, height);
            DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);

            // micrometer_value = Math.round(10000*(sleeve_main_scale_value + thimble_scale_value + sleeve_small_scale_value))/10000;
            DisplayScales();
            
        }

    }

    
}


function on_mousedown (ev)
{
    //windowWidth = $(window).width();
    var x, y;

    // console.log(ev.layerX);
    // console.log(ev.layerY);
    // alert("mouse down!!!")   

	if (ev.type == "touchstart") 
    {
        // rect=canvas.getBoundingClientRect();
        
		// x = ev.touches[0].clientX;
		// y = ev.touches[0].clientY;
        
        x = ev.touches[0].pageX;
		y = ev.touches[0].pageY;
        //alert(x);
        //alert(y);
		// console.log(x);
        // console.log(y);
        
		// x = ev.touches[0].layerX;
		// y = ev.touches[0].layerY;

        // alert(ev.touches[0].pageX);
        // alert(ev.touches[0].pageY);

        // alert(canvas.offsetWidth);

        

        ratio_x = canvas.offsetWidth/width;
        ratio_y = canvas.offsetHeight/height;
        // alert(canvas.offsetWidth);
        // alert(canvas.offsetHeight);
        
        //alert(ratio_y);

        x = x - canvas.offsetLeft;
        y = y - canvas.offsetTop;
        // x = x - rect.left;
        // y = y - rect.top;
        // console.log(x);
        // console.log(y);
         

        if ((x > thimble_mid_bottom_x*ratio_x ) && (x < thimble_right_top_x*ratio_x) && (y > thimble_right_top_y*ratio_y) && (y < thimble_right_bottom_y*ratio_y))
        {

            // alert("touch start!!!")   
            // alert(y);
            // alert(thimble_right_top_y*ratio_y);
            // alert(thimble_right_bottom_y*ratio_y);

            // console.log(x);
            // console.log(y);
            // console.log(x);
            
            isMouseDown = true;
            
            // console.log("isMouseDown" + " " + isMouseDown);
            down_x = x //+ canvas.offsetLeft;
            down_y = y //+ canvas.offsetTop;
            // down_x = x + rect.left;
            // down_y = y + rect.top;
            // down_x = x + canvas_offset_left;
            // down_y = y + canvas_offset_top;
            // document.body.style.cursor = "pointer";
        }
	} 

	else  //if(ev.type == "mouse")
    {
		// x = ev.clientX;
		// y = ev.clientY;
		x = ev.layerX;
		y = ev.layerY;
		
		x = x - canvas_offset_left;
        y = y - canvas_offset_top;
    
        
        if ((x > thimble_mid_bottom_x ) && (x < thimble_right_top_x) && (y > thimble_right_top_y) && (y < thimble_right_bottom_y))
        {

            // console.log("Even in touch---");
            isMouseDown = true;
            
            down_x = x + canvas_offset_left;
            down_y = y + canvas_offset_top;
            document.body.style.cursor = "pointer";
        }
	}
  
    //x = x - canvas_offset_left;
    //y = y - canvas_offset_top;

	//alert(x);
    //alert(thimble_mid_bottom_x);
    //alert(thimble_right_top_x);
	
    //if ((x > thimble_mid_bottom_x ) && (x < thimble_right_top_x) && (y > thimble_right_top_y) && (y < thimble_right_bottom_y))
    //{

        
    //    isMouseDown = true;
    //    isMouseUp = false;
    //    down_x = x + canvas_offset_left;
    //    down_y = y + canvas_offset_top;
    //    document.body.style.cursor = "pointer";
    //}

    
}

function on_mouseup (ev)
{
    // if (isMouseDown ==true)
    // {
        // alert("mouse is up!");
        
        isMouseDown = false;
        
        // alert("touchend");
        // allowMovement = false;
        document.body.style.cursor = "";
        
        // sleeve_small_scale_value = (micrometer_value * 1000) % 10;


        // alert("touchend")
    // }
    
    // if ( isMouseDown ==true)
    // {
    //     isMouseUp = true;
    //     isMouseDown = false;
    //     document.body.style.cursor = "";
    //     // checkGuess(micrometer_value);
    // }
    

}

function DisplayScales()
{
    // var sleeve_main_FontSize = "20px";
    // var	sleeve_main_FontStyle = "Times new romans";
    // var sleeve_main_Font = sleeve_main_FontSize + " " + sleeve_main_FontStyle;
    // ctx.font = sleeve_main_Font;

    // ctx.fillText('sleeve main', 10, 420);
    // ctx.fillText(sleeve_main_scale_value, 150, 420);
    // var sleevemain_left = 150;
    $("#sleevemainControl").val(sleeve_main_scale_value);
    // if ($("#sleevemainControl").val() < 0)
    // {
    //     $("#sleevemainControl").val(0);
    // }

    // ctx.fillText('thimble', 10, 450);
    // ctx.fillText(thimble_scale_value, 150, 450);
    $("#thimbleControl").val(thimble_scale_value);
    // if ($("#thimbleControl").val() < 0)
    // {
    //     $("#thimbleControl").val(0);
    // }

    // ctx.fillText('sleeve small', 10, 480);
    // ctx.fillText(sleeve_small_scale_value, 150, 480);
    $("#sleevesmallControl").val(sleeve_small_scale_value);
    // if ($("#sleevesmallControl").val() < 0)
    // {
    //     $("#sleevesmallControl").val(0);
    // }
    
    
    // ctx.fillText('micrometer value', 300, 480);
    // ctx.fillText(micrometer_value, 450, 480);
    
    // ctx.stroke();
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
    ctx.canvas.height = 40;
    ctx.canvas.width = 30;
    ctx.fillStyle = "#339966";
    // if(seconds<6) {ctx.fillStyle = "#ffc107";}
    // if(seconds<3) {ctx.fillStyle = "#f44336";}
    if(seconds<10) {ctx.fillStyle = "#ffc107";}
    if(seconds<6) {ctx.fillStyle = "#f44336";}
    // ctx.fillRect(0, 30-seconds*3, 30, 30);
    ctx.fillRect(0, 40-seconds, 30, 40);
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

function checkGuess(guess) {
    //console.log("Checking guess...");
    //console.log("guess = " + guess);
    allowMovement = false;
    timerRunning = false;
    clearTimeout(gameTimer);
    if (gameover === true) {
        return false;
    }
    if (guess === randomQuestion) {
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
    strikeSound.play();
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
   
	// $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><br><br><span class='questionWrongMeasurement'>" + incorrect + "</span>").fadeIn();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(stgMode == "Find"){
        $("#txtQuestion").hide();

    // if (scale == "cm"){
    //     $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + incorrect / 10 + "cm</span>").fadeIn();
    // } else {
    //     $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + incorrect + "mm</span>").fadeIn();
    // }
	
	/////////////////////////////// modified by RUH on 1st, Sep //////////////////////////////////////////////////
        $("#txtQuestion").html("<span class='questionWrongInstruction'>You selected</span><br><span class='questionWrongMeasurement'>" + incorrect + "</span>").fadeIn();
    }
    else{
        $("#txtQuestion").html("<span><span class='questionWrongInstruction'>Right answer was </span>" +question2HtmlString(correct) + ".").fadeIn();
    }
        
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


function question2HtmlString(val, str_type = 1) {
    var ret = "<span>";

    var cls_msr = str_type == 1 ? "questionWrongMeasurement" : "questionMeasurement";
    var cls_inst = str_type == 1 ? "questionWrongInstruction" : "questionInstruction";
    ret += "<span class='" + cls_msr +"'>" + val + ''+ "</span>";

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
    input_answer = "00000";
    var html = "";
    allowMovement = true;

    if (levelcounter === 0){
        html = "<div class='level'>Level " + level + "</div>";
        showCheerBoard(html,1000);
    }

    previousQuestion = randomQuestion

    while (randomQuestion === previousQuestion) {
        if(stgVernierScale=="On")
        {
            randomQuestion = randomInt(1, 24999) / 1000;
        }
        else
        {
            randomQuestion = randomInt(1, 2499) / 100;
        }
        //randomQuestion = randomInt(1, 24999) / 1000;
    }

    /* */
    // if (randomInt(0,1))
    //     scale = "cm"
    // else
    //     scale = "mm"

    $("#txtQuestion").hide()

    // if (inputType === "Touch"){
    //     html = "<span class='questionInstruction'>Drag to select</span><br>";
    // } else {
    //     html = "<span class='questionInstruction'>Click to select</span><br>";
    // }

	if (stgMode == "Type") {
        html = "<span class='questionInstruction'>Enter the number representing the value shown below.</span>";
        $("#txtQuestion").html(html).fadeIn(); 
    
        ctx.clearRect(0, 0, width, height);
        let tmp = GetMicrometerCoordinates(randomQuestion)
        console.log("tmp", tmp)
        // sleeve_top_right_x, thimble_start_y
        sleeve_top_right_x = tmp.sleeve_top_right_x
        thimble_start_y = tmp.thimble_start_y
        
        sleeve_bottom_right_x = sleeve_top_right_x;
        thimble_mid_top_x = sleeve_top_right_x + 100;
        thimble_mid_bottom_x = thimble_mid_top_x;
        thimble_right_top_x = thimble_mid_top_x + 100;
        thimble_right_bottom_x = thimble_right_top_x;
    
        DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
    }
    else{
    	///////// modified by RUH on 1st ,Sep ////////////////////////////////////////////////////////////
    	html = "<span class='questionInstruction'>Control Micrometer to select</span><br>";
        // html = "<span class='questionInstruction'>Control Micrometer to select</span><br><br><br>";
        //////////////////////////////////////////////////////////////////////////////////////////////////
    
        $("#txtQuestion").html(html + "<span class='questionMeasurement'>" + randomQuestion + "<span></span>" + "mm</span>").fadeIn()
    }
    
    if (stgTimer === "On"){
        
        if( level < 4)
        {
            secs = 40 - 3*(level-1);
        }
        else
        {
            secs = 40 - 3*(level-1) - 1;
        }
        startTimer()
    }
    

}


function newGame() {
    // if (document.domain != "www.rulergame.net") {
    //     alert("The Ruler Game - Touchscreen Edition is not designed to be played offline.\nYou will now be redirected to the online game.");
    //     location.replace("https://www.rulergame.net/");
    // }
    $("#preferencesBox").hide();
    $("#buttonBar").fadeOut();
    // $("#btnStart").hide();
    $("#questionBar").toggle();
    // $("#btnSubmit").fadeIn();
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

    var defaultPrevent = function(e){ e.preventDefault() };
    canvas.addEventListener("touchstart", defaultPrevent);
    canvas.addEventListener("touchmove" , defaultPrevent);
    
    window.addEventListener('keydown', onKeyEvent, false);
    
    var typeCanvas = document.getElementById('typeCanvas');
    typeCanvas.addEventListener('click', getMouseClick, false);
    // clearPlayerCanvas(true);
    showNewQuestion();
    
}


function onKeyEvent(e) {
        // //console.log(e.keycode);
    if (e.keyCode >= 96/*'0'*/ && e.keyCode <= 105/*'9'*/)  // when using numpad...
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
    } else {
        // //console.log(e.keyCode);
        return false;
    }
    e.preventDefault();
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

        var mousePosTmp = getMousePos(canvas, me);
        x = mousePosTmp.x
        y = mousePosTmp.y;
        console.log("x", x,y)
        if (y > (70) && y < (100)) {
            if (x > (16 + 40 * 10) && x < (56 + 40 * 10)) {
                set_input_answer("Back");
            } else {
                for (let i = 0; i <= 9; i++) {
                    if (x > (16 + 40 * i) && x < (56 + 40 * i)) {
                        set_input_answer("" + (i+1)%10);
                        break;
                    }
                }
            }
        }
        drawType()
        return;
    } 

}

function getMousePosWindow(event) {
    return [event.clientX, event.clientY];
}

function getTouchPosWindow(event) {
    return [event.touches[0].pageX, event.touches[0].pageY];
}


function DrawSleeveMainChange()
{
    var sleeve_main_val = $("#sleevemainControl").val();
    // alert(sleeve_main_val);
    sleeve_top_right_x = sleeve_top_left_x + (sleeve_main_val/0.125 + 1)*2;
    sleeve_bottom_right_x = sleeve_top_right_x;
    thimble_mid_top_x = sleeve_top_right_x + 100;
    thimble_mid_bottom_x = thimble_mid_top_x;
    thimble_right_top_x = thimble_mid_top_x + 100;
    thimble_right_bottom_x = thimble_right_top_x;
    

    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
    // DisplayScales();
}

function DrawThimbleChange()
{
    
    var thimble_val = $("#thimbleControl").val();
    
    // thimble_start_y = sleeve_bottom_right_y - (35-thimble_val/0.001)*10;
    thimble_start_y = sleeve_bottom_right_y - (60 - thimble_val / 0.01) * 10;
    // var thimble_interval  = (thimble_val/0.001)*10
    // thimble_start_y = thimble_start_y + thimble_interval;

    if (thimble_start_y < sleeve_top_right_y)
        {
            thimble_start_y = thimble_start_y + 2*sleeve_height;
        }
        else if (thimble_start_y > sleeve_bottom_right_y)
        {
            thimble_start_y = thimble_start_y - 2*sleeve_height;
        }

    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
    // $("#sleevesmallControl").val(sleeve_small_scale_value);
    // thimble_start_y = thimble_start_y - thimble_interval;
}
    
function DrawSleeveSmallChange()
{
    var sleeve_small_val = $("#sleevesmallControl").val();
    
    // console.log(sleeve_small_val)
    // var sleeve_small_val = sleeve_small_scale_value;
    // var thimble_val = $("#thimbleControl").val();
    // thimble_start_y = sleeve_bottom_right_y - (35-thimble_val/0.001)*10;
    // thimble_start_y = sleeve_bottom_right_y - (10-sleeve_small_val/0.0001);

    // if (thimble_start_y < sleeve_top_right_y)
    //     {
    //         thimble_start_y = thimble_start_y + sleeve_height;
    //     }
    //     else if (thimble_start_y > sleeve_bottom_right_y)
    //     {
    //         thimble_start_y = thimble_start_y - sleeve_height;
    //     }
    
    // sleeve_top_right_x = sleeve_top_right_x + move_x;
    // var sleeve_small_interval = sleeve_small_val / 0.001;
    
    // thimble_start_y = thimble_start_y  + sleeve_small_interval;
    thimble_start_y = thimble_start_y  + sleeve_change_value;

    

    if (thimble_start_y < sleeve_top_right_y)
    {
        thimble_start_y = thimble_start_y + 2*sleeve_height;
    }
    else if (thimble_start_y > sleeve_bottom_right_y)
    {
        thimble_start_y = thimble_start_y - 2*sleeve_height;
    }
    
    ctx.clearRect(0, 0, width, height);
    DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);

    // thimble_start_y = thimble_start_y - sleeve_small_interval;
    // ctx.clearRect(0, 0, width, height);
    // DrawMicrometer(sleeve_top_left_x, sleeve_top_left_y, sleeve_bottom_left_x, sleeve_bottom_left_y, sleeve_top_right_x, sleeve_top_right_y, sleeve_bottom_right_x, sleeve_bottom_right_y, thimble_mid_top_x, thimble_mid_top_y, thimble_mid_bottom_x, thimble_mid_bottom_y, thimble_right_top_x, thimble_right_top_y, thimble_right_bottom_x, thimble_right_bottom_y, thimble_start_y);
}

// const input = document.querySelector('input[type=number]')

// const increment = () => {
//   input.value = Number(input.value) + 1
// }
// const decrement = () => {
//   input.value = Number(input.value) - 1
// }

// document.querySelector('.spinner.increment').addEventListener('click', increment)
// document.querySelector('.spinner.decrement').addEventListener('click', decrement)

$("#btnsleevedecrement").click(function(){
    //inputType = "Mouse";
    var sleeve_main_val = $("#sleevemainControl").val();
    sleeve_main_val = Math.round(sleeve_main_val * 100)
    sleeve_main_val -= 50;
    if (sleeve_main_val <= 0)
    {
        sleeve_main_val = 0;
    }
     
    
    $("#sleevemainControl").val(sleeve_main_val/ 100);
    
    DrawSleeveMainChange();
    // newGame();
});

$("#btnsleeveincrement").click(function(){
    //inputType = "Mouse";
    var sleeve_main_val = $("#sleevemainControl").val();
    sleeve_main_val = Math.round(sleeve_main_val * 100)
    sleeve_main_val += 50;
    if (sleeve_main_val >= 2450)
    {
        sleeve_main_val = 2450;
    }
     
    
    $("#sleevemainControl").val(sleeve_main_val/100);
    
    DrawSleeveMainChange();
    // newGame();
});

$("#thimbledecrement").click(function(){
    //inputType = "Mouse";
    sleeve_small_scale_value = 0;
    var thimble_val = $("#thimbleControl").val();
    // console.log(thimble_val);
    thimble_val = Math.round(thimble_val * 100);
    
    thimble_val = thimble_val - 1;
    if (thimble_val <= 0)
    {
        thimble_val = 0;
    }
     
    
    $("#thimbleControl").val(thimble_val/100);
    // thimble_scale_value = thimble_val/100;
    $("#sleevesmallControl").val(sleeve_small_scale_value);

    DrawThimbleChange();
    // CalculateMicroValue();
    // DisplayScales();
    
    // newGame();
});

$("#thimbleincrement").click(function(){
    //inputType = "Mouse";
    sleeve_small_scale_value = 0;
    var thimble_val = $("#thimbleControl").val();
    console.log("increment__1 " + thimble_val);
    thimble_val = Math.round(thimble_val * 100)
	console.log("increment__2 " + thimble_val);
    
    thimble_val = thimble_val + 1;
	console.log("increment__3 " + thimble_val);

    if (thimble_val >= 49)
    {
        thimble_val = 49;
    }
    
    
    $("#thimbleControl").val(thimble_val/100);
	console.log("increment__4 " + thimble_val / 100);
    // thimble_scale_value = thimble_val/100;
    $("#sleevesmallControl").val(sleeve_small_scale_value);

    DrawThimbleChange();
});

$("#vernierdecrement").click(function(){
    //inputType = "Mouse";
    sleeve_change_value = -1;
    var vernier_val = $("#sleevesmallControl").val();
    // sleeve_small_scale_value = ((micrometer_value * 1000) % 10)/1000;
    // var vernier_val = 0;
    

    vernier_val = Math.round(vernier_val * 1000);
    vernier_val -= 1;
    if (vernier_val < 0)
    {
        vernier_val = 0;
        sleeve_change_value = 0;
    }
    
    sleeve_small_scale_value = vernier_val/1000;
    $("#sleevesmallControl").val(vernier_val/1000);
    console.log("sleeve_small_value_decrese = ", sleeve_small_scale_value);
    
    DrawSleeveSmallChange();
    CalculateMicroValue()
    DisplayScales()
    // newGame();
});

$("#vernierincrement").click(function(){
    //inputType = "Mouse";
    sleeve_change_value = 1;
    var vernier_val = $("#sleevesmallControl").val();
    // var vernier_val = 0;
    
    
    vernier_val = Math.round(vernier_val * 1000);
    vernier_val += 1;
    if (vernier_val > 9)
    {
        vernier_val = 9;
        sleeve_change_value = 0;
    }
     
    sleeve_small_scale_value = vernier_val/1000;
    $("#sleevesmallControl").val(vernier_val/1000);
    
    console.log("sleeve_small_value_increase = ", sleeve_small_scale_value);
    
    DrawSleeveSmallChange()
    CalculateMicroValue()
    DisplayScales()
    // newGame();
});


function CalculateMicroValue()
{
	console.log("sleeve_scale=" + sleeve_main_scale_value);
	console.log("thimble_scale=" + thimble_scale_value);
	console.log("sleeve_scale=" + sleeve_small_scale_value);
	
    if(stgVernierScale=="On")
    {
        micrometer_value = Math.round(1000*(Math.round(10 * sleeve_main_scale_value)/10 + Math.round(100*thimble_scale_value)/100 + Math.round(1000*sleeve_small_scale_value)/1000))/1000;
    }
    else
    {
        micrometer_value = Math.round(100*(Math.round(10*sleeve_main_scale_value)/10 + Math.round(100*thimble_scale_value)/100))/100;
    }
}