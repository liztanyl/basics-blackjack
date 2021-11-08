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
var inGameInstructions = `Enter 'd' to draw a card or just click submit to play with your current cards.`;

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
      var newCard = {
        name: cardName,
        suit: cardSuit,
        rank: cardRank,
        value: cardValue,
      };
      // Add card to deck
      cardDeck.push(newCard);
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
  var msgWithFormattedCards = "";
  for (var i = 0; i < cardArray.length; i++) {
    msgWithFormattedCards += ` |${cardArray[i].name}${cardArray[i].suit}| `;
  }
  return msgWithFormattedCards;
};

// Function to reset deck and player's & dealer's cards to empty arrays
var resetGame = function () {
  deck = [];
  playerCards = [];
  dealerCards = [];
};

// Function to start game
// Create, shuffle deck, give out 2 cards each & check for blackjack
var newGame = function () {
  resetGame();
  var startMsg = inGameInstructions;
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
    startMsg = whoGotBlackjack(playerCards, dealerCards);
  }
  mode = "play";
  return startMsg;
};

// Function to draw card from deck
var drawCard = function () {
  var card = deck.pop();
  return card;
};

// Function to check if hand is blackjack (Ace & 10/J/Q/K || Ace & Ace)
var checkForBlackjack = function (hand) {
  console.log("Checking if hand is blackjack");
  if (
    ((hand[0].value == 1 || hand[1].value == 1) &&
      (hand[0].value == 10 || hand[1].value == 10)) ||
    (hand[0].value == 1 && hand[1].value == 1)
  ) {
    return true;
  } else {
    return false;
  }
};

// Function to see if either player or dealer has blackjack
var didAnyoneBlackjack = function (player, dealer) {
  // If both not blackjack, return false
  if (!checkForBlackjack(player) && !checkForBlackjack(dealer)) {
    console.log("Nobody got blackjack");
    return false;
  } else {
    return true;
  }
};

// Function to determine who is the one with blackjack
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
  var sum = hand.reduce(reducerFn, 0);

  // Check if there's an Ace in hand
  var haveAceInHand = false;
  for (var i = 0; i < hand.length; i += 1) {
    if (hand[i].name == "A") {
      haveAceInHand = true;
    }
  }
  if (haveAceInHand && sum <= 11) {
    sum += 10;
  }

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
var determineWinner = function (player, dealer) {
  var playerHand = sumHand(player);
  var dealerHand = sumHand(dealer);
  console.log("Player's hand: ", playerCards, "(Sum: ", playerHand, ")");
  console.log("Dealer's hand: ", dealerCards, "(Sum: ", dealerHand, ")");

  var result = `Player's cards: ${formatCards(
    playerCards
  )} ----- Score of ${playerHand}<br>
  Dealer's cards: ${formatCards(
    dealerCards
  )} ----- Score of ${dealerHand}<br><br>`;
  // Tie if both hands bust or if sumOfHands are the same
  if (
    (didHandBust(playerHand) && didHandBust(dealerHand)) ||
    playerHand == dealerHand
  ) {
    result += `<b>It's a draw!</b>`;
  }
  // Player wins if player doesn't bust AND dealer busts or if player's hand is closer to 21
  else if (
    !didHandBust(playerHand) &&
    (playerHand > dealerHand || didHandBust(dealerHand))
  ) {
    result += `<b>Player wins!</b>`;
  }
  // Player loses if dealer doesn't bust AND player busts or if dealer's hand is closer to 21
  else if (
    !didHandBust(dealerHand) &&
    (playerHand < dealerHand || didHandBust(playerHand))
  ) {
    result += `<b>Dealer wins!</b>`;
  }
  return result;
};

// Main function
var main = function (input) {
  var myOutputValue = "";
  if (mode == "start") {
    // start game & check if anyone has blackjack
    var msg = newGame();

    myOutputValue += `
    Player's hand: ${formatCards(playerCards)}<br>
    Dealer's hand: ${formatCards(dealerCards)}<br><br>
    <b>${msg}</b>
    `;
  } else {
    if (input == "d") {
      playerCards.push(drawCard());
      myOutputValue += `
    Player's hand: ${formatCards(playerCards)}<br>
    Dealer's hand: ${formatCards(dealerCards)}<br><br>
    <b>${inGameInstructions}</b>
    `;
    } else {
      // Check if dealer's hand is below 17
      while (doesDealerNeedToDraw(sumHand(dealerCards))) {
        dealerCards.push(drawCard());
      }
      // compare whose hand has bigger sum of ranks
      myOutputValue += `
      ${determineWinner(playerCards, dealerCards)}
      `;
      mode = "start";
    }
  }
  return myOutputValue;
};
