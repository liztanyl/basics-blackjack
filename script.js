// *******************************************
// --------------- Game Rules ----------------
// Players: 2 (User, Computer)
// Computer is always Dealer
//
// Each player is dealt 2 cards
// Sum of card ranks (Hand) must equal 21 or less
// Player with Hand nearer to 21 wins
// If both Hands are above 21, draw
//
// On turn, players can choose to Hit (draw card) or Stand (end turn)
//
// Ace = 1 or 11; Jack, Queen & King = 10
// Dealer must Hit if hand is below 17
//
// *******************************************

// ******************** Global Variables ********************
var deck = [];
var playerCards = [];
var dealerCards = [];

var mode = "start";

// ************************ Functions ************************
// Function to create deck
var createDeck = function () {
  var cardDeck = [];
  // var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
  var suitsFormatted = ["♦", "♣", "❤", "♠"];
  var cardNamesInWords = [
    "", // Empty so that cardRank == index in this array (Ace starts at Index 1)
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  var cardValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  // Create a loop to create cards for each suit
  for (suitIndex = 0; suitIndex < suitsFormatted.length; suitIndex += 1) {
    var cardSuit = suitsFormatted[suitIndex];
    // Create a loop to create each card
    for (cardRank = 1; cardRank <= 13; cardRank += 1) {
      var cardName = cardNamesInWords[cardRank];
      var cardValue = cardValues[cardRank];
      var card = {
        name: cardName,
        suit: cardSuit,
        rank: cardRank,
        value: cardValue,
      };
      // Add card to deck
      cardDeck.push(card);
    }
  }
  return cardDeck;
};

// Function to get random number
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Function to shuffle deck
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  for (var currentIndex = 0; currentIndex < cardDeck.length; currentIndex++) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cardDeck;
};

// Function to format cards in hand
var formatCards = function (cardArray) {
  // Create a loop to add each card name and card suit to the return value
  var msg = "";
  for (var i = 0; i < cardArray.length; i++) {
    msg += ` |${cardArray[i].name}${cardArray[i].suit}| `;
  }
  return msg;
};

// Function to start game (create and shuffle deck)
var newGame = function () {
  var newDeck = createDeck();
  deck = shuffleCards(newDeck);
  // give PLAYER 1 card from top of deck (end of array)
  playerCards.push(drawCard());
  // give DEALER 1 card
  dealerCards.push(drawCard());
  // give PLAYER 1 card
  playerCards.push(drawCard());
  // give DEALER 1 card
  dealerCards.push(drawCard());
  // Should already check for blackjack here!
  if (didAnyoneBlackjack(playerCards, dealerCards)) {
    return whoGotBlackjack(playerCards, dealerCards);
  }
  return "";
};

// Function to draw card
var drawCard = function () {
  var card = deck.pop();
  return card;
};

// Function to check if hand is blackjack (Ace & 10/J/Q/K)
var checkForBlackjack = function (hand) {
  console.log("Checking if hand is blackjack");
  if (
    (hand[0].value == 1 || hand[1].value == 1) &&
    (hand[0].value == 10 || hand[1].value == 10)
  ) {
    return true;
  } else {
    return false;
  }
};

// Function to see if either hand has blackjack
var didAnyoneBlackjack = function (player, dealer) {
  // If both not blackjack, return false
  if (!checkForBlackjack(player) && !checkForBlackjack(dealer)) {
    console.log("Nobody got blackjack");
    return false;
  } else {
    return true;
  }
};

var whoGotBlackjack = function (player, dealer) {
  console.log("Someone got blackjack");
  // If player got blackjack, and dealer also blackjack - tie
  if (checkForBlackjack(player) && checkForBlackjack(dealer)) {
    console.log("Both players got blackjack");
    return `It's a tie! Both player and dealer had blackjack.`;
  }
  // If player has blackjack but dealer doesn't
  else if (checkForBlackjack(player)) {
    console.log("Player's hand is blackjack");
    return `Player has blackjack. Player wins!`;
  }
  // If dealer has blackjack but player doesn't
  else {
    console.log("Dealer's hand is blackjack");
    return `Dealer has blackjack. Player loses!`;
  }
};

// Function to sum ranks of cards in hand
var sumHand = function (hand) {
  // Dont understand closures for now so this will do
  var reducerFn = function (previousCard, currentCard) {
    return previousCard + currentCard.value;
  };
  //
  var sum = hand.reduce(reducerFn, 0);
  return sum;
};

// Function to check if hand busts
var didHandBust = function (sumOfHand) {
  if (sumOfHand > 21) {
    return true;
  } else {
    return false;
  }
};

// Function to check if dealer's hand is less than 17 & needs to draw a card
var doesDealerNeedToDraw = function (sumOfDealersHand) {
  if (sumOfDealersHand < 17) {
    return true;
  } else {
    return false;
  }
};

// Function to compare sums of hands
var compareHands = function (player, dealer) {
  var playerHand = sumHand(player);
  var dealerHand = sumHand(dealer);
  console.log("Player's hand: ", playerCards, playerHand);
  console.log("Dealer's hand: ", dealerCards, dealerHand);

  var result = `draw`;
  if (playerHand > dealerHand && !didHandBust(playerHand)) {
    result = `player wins`;
    return result;
  } else {
    result = `dealer wins`;
    return result;
  }
};

// Main function
var main = function (input) {
  var myOutputValue = "";
  if (mode == "start") {
    var msg = newGame(); // creates deck & shuffles cards

    myOutputValue += `
    Player's hand: ${formatCards(playerCards)}<br>
    Dealer's hand: ${formatCards(dealerCards)}<br><br>
    ${msg}
    `;

    mode = "play";
  } else if (mode == "play") {
    if (input == "hit") {
      playerCards.push(drawCard());
      myOutputValue += `
    Player's hand: ${formatCards(playerCards)}<br>
    Dealer's hand: ${formatCards(dealerCards)}<br><br>
    `;
    } else {
      myOutputValue += compareHands(playerCards, dealerCards);
    }
    // compare whose hand has bigger sum of ranks
  }
  return myOutputValue;
};
