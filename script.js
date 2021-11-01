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

// ************************ Functions ************************
// Function to create deck
var createDeck = function () {
  var cardDeck = [];
  var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
  var cardNamesInWords = [
    "", // Empty so that cardRank == index in this array (Ace starts at Index 1)
    "Ace",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Jack",
    "Queen",
    "King",
  ];
  // Create a loop to create cards for each suit
  for (suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    var cardSuit = suits[suitIndex];
    // Create a loop to create each card
    for (cardRank = 1; cardRank <= 13; cardRank += 1) {
      var cardName = cardNamesInWords[cardRank];
      var card = {
        name: cardName,
        suit: cardSuit,
        rank: cardRank,
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

// Function to start game (create and shuffle deck)
var newGame = function () {
  var newDeck = createDeck();
  deck = shuffleCards(newDeck);
};

// Function to draw card
var drawCard = function () {
  var drawnCard = deck.pop();
  return drawnCard;
};

// Function to sum ranks of cards in hand
var sumHand = function (hand) {
  // Dont understand closures for now so this will do
  var reducerFn = function (previousValue, currentValue) {
    return previousValue + currentValue.rank;
  };
  //
  var sum = hand.reduce(reducerFn, 0);
  return sum;
};

// Function to compare sums of hands
var compareHands = function (player, dealer) {
  var playerHand = sumHand(player);
  var dealerHand = sumHand(dealer);
  console.log("Player's hand: ", playerCards, playerHand);
  console.log("Dealer's hand: ", dealerCards, dealerHand);
  var result = `draw`;
  if (playerHand > dealerHand) {
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
  newGame(); // creates deck & shuffles cards
  playerCards.push(drawCard(), drawCard()); // draws 2 cards from top(end) of deck
  dealerCards.push(drawCard(), drawCard()); // draws 2 cards from top(end) of deck
  myOutputValue = compareHands(playerCards, dealerCards); // compares whose hand has bigger sum of ranks
  return myOutputValue;
};
