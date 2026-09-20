$(document).ready(function(){
    var a;
 });



function openTheCard(){
    var b;
    b=2;

}













 var xo = false;
 var p1s = 0;
 var p2s = 0;
 var draws = 0;
 var winner = 0; 
 
 var val= [1,0,0,0,0,0,0,0,0,0]


 function doSomething(b){
    b = parseInt(b);
    a = 'b' + b;
    
    if(val[b] != 0){
        setOverlay("Try another spot!");
        setTimeout(function(){
            overlayDisappear(0);
        }, 1000);
        
        return;
        
    }
    
    if (xo===false){
        $('#'+a).text("X");
        $("#turn").text("Player 2's Turn (O)");
        val[b]=parseInt(1);
    } else{
        $('#'+a).text("O");
        $("#turn").text("Player 1's Turn (X)");
        val[b]=parseInt(-1);
    } 
    // awards( checkForWinner(b, 2) );
    awards( checkForWinner() );
    xo=!xo;
}

// function checkForWinner(whoWon){
function checkForWinner(){
    // wincase0 = 1, 2, 3
    // wincase1 = 4, 5, 6
    // wincase2 = 7, 8, 9
    // wincase3 = 1, 4, 7
    // wincase4 = 2, 5, 8
    // wincase5 = 3, 6, 9
    // wincase6 = 1, 5, 9
    // wincase7 = 3, 5, 7
    var wincase=[0,0,0,0,0,0,0,0];
    wincase[0]= val[1]+val[2]+val[3];
    wincase[1]= val[4]+val[5]+val[6];
    wincase[2]= val[7]+val[8]+val[9];
    wincase[3]= val[1]+val[4]+val[7];
    wincase[4]= val[2]+val[5]+val[8];
    wincase[5]= val[3]+val[6]+val[9];
    wincase[6]= val[1]+val[5]+val[9];
    wincase[7]= val[3]+val[5]+val[7];
        
    var draw = 0;
    val.forEach(function(currentValue,index, arr){
        if(val[index] != 0){
            draw++;   
        }
    });

    wincase.forEach(function(currentValue, index, arr){
        if(wincase[index]===3){
            winner = 1;
            
        } else if (wincase[index]===-3){
            winner=-1;
            
        } 
    });

    if ((winner===0) && (draw===10)){
        winner=10;
        
    }
    return winner;
}

function awards(){
    if(winner===1){
        p1s++;
        $("#p1score").text(p1s);
        debugger;
        setOverlay("Player 1 (X) Wins!");
        resetGame();
    } else if(winner===-1){
        p2s++;
        $("#p2score").text(p2s);
        setOverlay("Player 2 (O) Wins!");
        resetGame();
    } else if(winner===10){
        draws++;
        $("#drawscore").text(draws);
        setOverlay("It's a draw!");
        resetGame();
    }
}

function setOverlay(messagey){
    $("#overlay").text(messagey);   
    overlayAppear();
}

function overlayAppear() {
    document.getElementById("overlay").style.display = "block";

}


function overlayDisappear(resetIt) {
    document.getElementById("overlay").style.display = "none";
    if( (winner!=0) || (resetIt===1) ){
        resetGame();
    }
    
}

function resetGame(){
    
    xo = false;
    winner=0;
    wincase=[0,0,0,0,0,0,0,0];
    draw = 0;
    val= [1,0,0,0,0,0,0,0,0,0]    
    
    val.forEach(function(currentValue,index, arr){
        if (index>0){
            val[index]=0;
            $('#b'+index).text("");
        }
    });
    
    
    // location.reload();
}

