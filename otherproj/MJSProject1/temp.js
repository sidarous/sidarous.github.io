var cartTotal = 0;
document.getElementById("cartcount").innerHTML = cartTotal;
var unitPrice = 108.99;
var priceTotal = 108.99;

function cartTotalOne(){
    cartTotal = 1;
    document.getElementById("cartcount").innerHTML = cartTotal;
}


function getQuantity(){
    
    var b = document.getElementById("optionchooser").elements.namedItem("quantity").value;
    var b = parseInt(b);
    return b;
}

function incrementCart(items){
    event.preventDefault();
    cartTotal=cartTotal+items;


    showAddedMessage();

}

function showAddedMessage(){
    setTimeout(function(){
        document.getElementById("addedWindow").style.display = "block";
    }, 100);
    
    setTimeout(function(){
        hideAddedMessage();
    }, 1000);
}

function hideAddedMessage(){
    document.getElementById("addedWindow").style.display = "none";
}



// overlay thing
function overlayAppear() {
    document.getElementById("overlay").style.display = "block";
}

function overlayDisappear() {
    document.getElementById("overlay").style.display = "none";
}


//item manipulation in cart
function removeItem(){
    var itemToRemove = document.getElementById("cartitems");
    itemToRemove.style.display= "none";
    cartTotal=0;
}

function getNewQuantity(){
    var b = document.getElementById("quantitychanger").elements.namedItem("quantity").value;
    var b = parseInt(b);
    return b;
}

function refreshTotal(p){
    event.preventDefault();

    cartTotal=p;
    priceTotal= "$" + (cartTotal * unitPrice).toFixed(2);

    setTimeout(function(){alert("Quantity Updated!")}, 400);

    document.getElementById("cartcount").innerHTML = cartTotal;
    document.getElementById("cartpagetotal").innerHTML =  priceTotal;
    document.getElementById("cartpagetotal2").innerHTML = priceTotal;

}