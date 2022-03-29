// initially, an object is defined with name 'blackJack' using object oriented programming. Object literal syntax is used.
// Nested object data structure is used here.
let blackJack = {
  // object within object
  you: {
    scoreSpan: "#playerResult",
    div: "#playerBox",
    score: 0,
  },
  // object within object
  dealer: {
    scoreSpan: "#dealerResult",
    div: "#dealerBox",
    score: 0,
  },
  // array within object to store different cards
  cards: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  // object within object to store values corresponding to different cards
  cardMap: {
    A: [1, 11],
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
  },
  // array within object to store different suits
  suits: ["♦", "♥", "♣", "♠"],
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};
const YOU = blackJack["you"];
const DEALER = blackJack["dealer"];
$("#hitButton").click(() => blackjackHit());
$("#standButton").click(() => dealerLogic());
$("#dealButton").click(() => blackjackDeal());
// define a function blackjackHit to pass a card when the button HIT is clicked
function blackjackHit() {
  if (blackJack["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}
// define a function randonCard to shuffle all the deck.
function randomCard() {
  // Math.floor will give the largest integer less than or equal to given value.
  // Math.random will randomize the cards
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJack["cards"][randomIndex];
}
// define a function showCard to display the cards in webpage.
function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("div");
    let randomIndexSuit = Math.floor(Math.random() * 4);
    let singleSuit = blackJack["suits"][randomIndexSuit];
    cardImage.className = "card";
    let objKeys = Object.keys(blackJack["cardMap"]);
    for (let i = 0; i < objKeys.length; i++) {
      if (objKeys[i] == card) {
        if (randomIndexSuit === 0 || randomIndexSuit === 1) {
          cardImage.innerHTML =
            card + `<div id=suites style="color:red"> ${singleSuit}</div>`;
        } else {
          cardImage.innerHTML =
            card + `<div id=suites style="color:black"> ${singleSuit}</div>`;
        }
      }
    }
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
  }
}

function blackjackDeal() {
  // function to start next set of the game (resets everthing except points)
  if (blackJack["turnsOver"] === true) {
    blackJack["isStand"] = false;

    let yourImages = document
      .querySelector("#playerBox")
      .querySelectorAll("div");
    let dealerImages = document
      .querySelector("#dealerBox")
      .querySelectorAll("div");

    for (var i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    for (var i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    $("#playerResult").html("0");
    $("#dealerResult").html("0");
    $("#message").html("");
    blackJack["turnsOver"] = false;
  }
}

function updateScore(card, activePlayer) {
  // function to add the score of cards displayed.
  // If adding 11 keeps me below 21 then add 11. Otherwise, add 1.
  if (card === "A") {
    if (activePlayer["score"] + blackJack["cardMap"][card][1] <= 21) {
      activePlayer["score"] += blackJack["cardMap"][card][1];
    } else {
      activePlayer["score"] += blackJack["cardMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackJack["cardMap"][card];
  }
}

function showScore(activePlayer) {
  // function to display the score
  if (activePlayer["score"] > 21) {
    $(activePlayer["scoreSpan"]).html("Ooops..!");
    $(activePlayer["scoreSpan"]).css("color", "yellow");
  } else {
    $(activePlayer["scoreSpan"]).html(activePlayer["score"]);
  }
}

function sleep(ms) {
  // function for setting the timer of dealer game
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  // function for the dealer game
  blackJack["isStand"] = true;

  while (DEALER["score"] < 16 && blackJack["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(800);
  }
  // BOT LOGIC: Automate such that it shows cards untill score > 15
  blackJack["turnsOver"] = true;
  showResult(computeWinner());
}
// compute winner
// Update wins, losses, and draws
function computeWinner() {
  // display points after each game
  let winner;

  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackJack["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackJack["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackJack["draws"]++;
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackJack["losses"]++;
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackJack["draws"]++;
  }

  return winner;
}

function showResult(winner) {
  // display the result of Game
  let message;

  if (blackJack["turnsOver"] === true) {
    if (winner === YOU) {
      $("#wins").html(blackJack["wins"]);
      message = "You won..!";
    } else if (winner === DEALER) {
      $("#losses").html(blackJack["losses"]);
      message = "You lost..!";
    } else {
      $("#draws").html(blackJack["draws"]);
      message = "Its a draw..!";
    }

    $("#message").html(message);
    $("#message").css("color", "yellow");
  }
}
let alertOnce = false;
let limitFunc = function () {
  // function to alert rotate device when the webpage is opened in smaller devices
  if (window.innerWidth <= 1000 && alertOnce === false) {
    alert("Rotate Device.");
    alertOnce = true;
  }
};

window.addEventListener("resize", limitFunc);
window.addEventListener("onload", limitFunc);
