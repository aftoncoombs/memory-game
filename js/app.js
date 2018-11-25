/*
 * Create a list that holds all of your cards
 */
 var cardList = document.getElementsByClassName("card");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card"s HTML to the page
 */

// CREDIT: Shuffle function is a Fisher-Yates (Knuth) shuffle based on http://stackoverflow.com/a/2450976
function shuffle(array) {
    var idx = array.length, temp, randomIdx;

    while (idx !== 0) {
        randomIdx = Math.floor(Math.random() * idx);
        idx = idx - 1;
        temp = array[idx];
        array[idx] = array[randomIdx];
        array[randomIdx] = temp;
    }

    return array;
}

function shuffleDeck(){
    var newCardList= shuffle(Array.from(cardList));
    var deck = document.getElementById("deck");

    for (var idx=0; idx < newCardList.length; idx++){
        deck.appendChild(newCardList[idx]);
    }
}

shuffleDeck();



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card"s symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card"s symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
Show the card if clicked, up to two cards at a time.
*/

 // CREDIT : Animations from * animate.css -http://daneden.me/animate. Copyright (c) 2018 Daniel Eden

// Set up variables that will be resused
var cards = document.getElementsByClassName("card");
var flippedCards = [];
var matchedCards = [];
var cardFlips = 0;
var originalCardFlips = 0;
//var hold = false;
var sec = 0;
var min = 0;
var stars = 3;
var keepTiming = true;

var clickable = true;
var twoCardsFlipped = false;

// Set timer
timer = function() {
  setInterval(function() {
    // // Check to see if the game has been won
    win(); 
    // Update timer
    if (keepTiming){
        sec ++; 
        if (sec == 60) {
          min ++;
          sec = 0;
        }
        timeString = min + " Minutes " + sec + " Seconds";
        document.getElementById("timer").innerHTML = timeString;
        // Update stars based on timer and flips
        if ((min > 5 | cardFlips >= 8) & stars > 2){
            stars -- ;
            console.log("lost 1 star!")
            document.getElementById("star1").classList.remove("fa-star");
        }
        if ((min > 10 | cardFlips >= 12) & stars > 1){
            stars -- ;
            console.log("lost 2 stars!")
            document.getElementById("star2").classList.remove("fa-star");
        }
    }
}, 1000)
};

window.onload = timer;

// Flips over a card
function flipCards(cardElement){
    clickable = false;
    if (flippedCards.length > 1) {
        twoCardsFlipped = true;
    } else {
        clickable = true;
    }
    if (clickable){
        this.classList.add("open-show");
        flippedCards.push(this);
        // this.classList.add("animated");
        // this.classList.add("swing");
    } 
}

// Adds to currently flipped cards
// function addToFlippedList(cardElement){
//     if (flippedCards.length < 2) {
//         flippedCards.push(this);
//         this.removeEventListener("click", addToFlippedList);
//     }
// }

// Locks cards because they are a match
function lockCards(){
    for (var i = 0; i < flippedCards.length; i++){
        flippedCards[i].classList.add("match");
        matchedCards.push(flippedCards[i]);
    }
}

// Clears all currently flipped cards back to blank
function clearFlippedCards(){
    while (flippedCards.length > 0){
        flippedCards[flippedCards.length-1].classList.remove("open-show");
        flippedCards[flippedCards.length-1].addEventListener("click", updateMoves);
        // flippedCards[flippedCards.length-1].classList.remove("animated");
        // flippedCards[flippedCards.length-1].classList.remove("swing");
        flippedCards.pop();
    }
    clickable = true;
}

// Clears the list of matches (useful for reset)
function clearMatches(){
    while (matchedCards.length > 0){
        matchedCards[matchedCards.length-1].classList.remove("match");
        matchedCards.pop();
    }
}

// Prevents clicking a new card while current match check in process
function holdClicks(){
    if (flippedCards.length > 1){
        //hold = true;
    }
}

// Updates remaining moves
function updateMoves(){
    if (twoCardsFlipped) {
        cardFlips = cardFlips + 1 ;
        movesMade = document.getElementById("moves");
        movesMade.innerHTML = Math.round(cardFlips/2);
    }
}

// Resets remaining moves
function resetMoves(){
    movesMade = document.getElementById("moves");
    movesMade.innerHTML = 0;
    cardFlips = 0;
    min = 0;
    sec = 0;
}

// Checks for a match. Clears currently flipped cards and locks cards if  they are a match.
function checkMatch(){
    if (flippedCards.length > 1){
        clickable = false;
    }
    setTimeout(check, 1000)
    function check(){
        flippedCards[0].removeEventListener("click", updateMoves);
        flippedCards[1].removeEventListener("click", updateMoves);
        if (flippedCards.length == 2){
            if (flippedCards[0].innerHTML == flippedCards[1].innerHTML){
                lockCards(flippedCards);
                twoCardsFlipped = true;
            }
            // } else {
            //     flippedCards[0].addEventListener("click", addToFlippedList);
            //     flippedCards[1].addEventListener("click", addToFlippedList);
            // }
            clearFlippedCards();
            //hold = false;
            //twoCardsFlipped = false;
        }
    }
}  

// Clears the entire deck of flipped cards and matches. Resets the deck and shuffles it.
function clearAll(){
    var deck = document.getElementById("deck");
    // setTimeout(resetAnim, 1000);
    // deck.classList.remove("animated");
    // deck.classList.remove("shake");
    // function resetAnim(){
    //     deck.classList.add("animated");
    //     deck.classList.add("shake");
    //     clearFlippedCards();
    //     clearMatches();
    //     resetMoves();
    //     shuffleDeck();
    //     cardFlips = originalCardFlips;
    // }
    clearFlippedCards();
    clearMatches();
    resetMoves();
    shuffleDeck();
    document.getElementById("star1").classList.add("fa-star");
    document.getElementById("star2").classList.add("fa-star");
    document.getElementById("star3").classList.add("fa-star");
    stars = 3;
}

// Win the game
var modal = document.getElementById("win-modal");
var modalText = document.getElementById("stats");
var modalButton = document.getElementById("modal-button");

function win(){
    if (matchedCards.length >= 16){
        keepTiming = false;
        var freezeMin = min;
        var freezeSec = sec;
        modalText.innerHTML = cardFlips / 2 + " moves in " + freezeMin + " minutes, " + freezeSec + " seconds. " + "You earned " + stars + " stars!"
        modal.style.display = "block";
    }
}

window.onclick = function(event) {
    if (event.target == modalButton) {
        clearAll()
        modal.style.display = "none";
        min = 0;
        sec = 0;
        keepTiming = true;
    }
}

// Add listeners to cards to flip, hold clicks, update moves, check matches, and clear
for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", flipCards);
    //cards[i].addEventListener("click", addToFlippedList);
    cards[i].addEventListener("click", checkMatch);
    //cards[i].addEventListener("click", updateMoves);
}  

// Restart game
document.getElementById("restart").addEventListener("click", clearAll);


// Useful function for debugging
testWin = function(){
    allCards = document.getElementsByClassName("card");
    for (var i = 0; i < allCards.length; i ++) {
        allCards[i].classList.add("match");
        matchedCards.push(allCards[i]);
    }
}




