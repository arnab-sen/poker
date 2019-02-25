class Card {
	constructor(rank, suit) {
		this.rank = rank;
		this.suit = suit;
		this.suitSymbols = {
			"spades" : "♠",
			"hearts" : "♥",
			"clubs" : "♣",
			"diamonds" : "♦"
			};
			
		this.nonNumberCards = {
			"1" : "A",
			"11" : "J",
			"12" : "Q",
			"13" : "K"
		};
	}
	
	getName() {
		var specialRanks = [1, 11, 12, 13];
		var rankToShow = this.rank;
		if (specialRanks.includes(this.rank)) {
			rankToShow = this.nonNumberCards[this.rank.toString()];
		}
		return `${rankToShow}${this.suitSymbols[this.suit.toLowerCase()]}`;
	}
}

class Deck {
	constructor() {
		this.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		this.suits = ["spades", "hearts", "clubs", "diamonds"];
		this.cards = [];
		
		for (var i = 0; i < this.ranks.length; i++) {
			for (var j = 0; j < this.suits.length; j++) {
				var card = new Card(this.ranks[i], this.suits[j]);
				this.cards.push(card);
			}
		}
	}
}

class Dealer {
	constructor() {
		this.deck = new Deck();
	}
	
	resetDeck() {
		this.deck = new Deck();
	}
	
	dealCards(numCards, container) {
		/* Randomly selects and moves a given number of cards to the container */
		var cardsDealt = [];
		var index;
		while (cardsDealt.length < numCards) {
			index = this.getRandomInt(0, this.deck.cards.length);
			container.push(this.deck.cards[index]);
			cardsDealt.push(this.deck.cards[index]);
			this.deck.cards.splice(index, 1);
		}
	}
	
	getCardSequenceString(cards) {
		var cardSequenceString = cards[0].getName();
		for (var i = 1; i < cards.length; i++) {
			cardSequenceString += " " + cards[i].getName();
		}
		
		return cardSequenceString;
	}
	
	getRandomInt(low, high) {
		/* Returns a random integer in the interval [low, high) */
		return Math.floor((Math.random() * high) + low);
	}
	
	dealHands(players) {
		for (var i = 0; i < players.length; i++) {
			players[i].hand = [];
			this.dealCards(2, players[i].hand);
		}
	}
	
	dealFlop(communityCards) {
		communityCards = [];
		this.dealCards(3, communityCards);
	}
	
	dealTurn(communityCards) {
		this.dealCards(1, communityCards);
	}
	
	dealRiver(communityCards) {
		this.dealCards(1, communityCards);
	}
	
}

class Player {
	constructor(name, chips, control) {
		this.name = name;
		this.chips = chips;
		this.hand = [];
		this.control = control;
		this.hasFolded = false;
		this.moveDone = false;
	}
	
	collectChips(numChips) {
		this.chips += numChips;
	}
	
	removeChips(numChips) {
		this.chips -= numChips;
		if (this.chips < 0) {
			numChips += this.chips;
			this.chips = 0;
		}
		
		return numChips;
	}
	
	fold() {
		this.hasFolded = true;
		this.moveDone = true;
	}
	
	check() {
		this.moveDone = true;
	}
	
	call(table) {
		this.removeChips(table.currentBet);
		table.pot += table.currentBet;
		this.moveDone = true;
	}
	
	raise(numChips, table) {
		numChips = this.removeChips(numChips);
		table.pot += numChips;
		table.currentBet += numChips;
		this.moveDone = true;
	}
	
	getCPUAction() {
		this.fold();
	}
}

class Table {
	constructor() {
		this.players = [];
		this.dealer = new Dealer();
		this.communityCards = [];
		this.pot = 0;
		this.smallBlind = 50;
		this.bigBlind = 100;
		this.currentBet = 0;
		this.currentActivePlayerIndex = null;
	}
	
	addPlayer(player) {
		this.players.push(player);
	}
	
	setBlinds(smallBlind, bigBlind) {
		this.smallBlind = smallBlind;
		this.bigBlind = bigBlind;
	}
	
	playRound() {
		/* Starts a new round */
		this.currentBet = this.bigBlind;
		this.dealer.resetDeck();
		this.dealer.dealHands(this.players);
		this.startNextPlayerTurn();
	}
	
	getCurrentPlayer() {
		if (this.currentPlayer == null) {
			return null;
		} else { 
			return this.players[this.currentPlayer];
		}
	}
	
	startNextPlayerTurn() {
		if (this.currentPlayer == null) this.currentPlayer = 0;
		var player = this.getCurrentPlayer();
		
		if (player.control == "CPU") player.getCPUAction();
		if (player.moveDone) this.currentPlayer++;
		if (this.currentPlayer >= this.players.length) {
			this.getRoundWinner();
		}
	}
	
	getPlayerActions() {
		/* Asks each player to either check, fold, or raise */
		var action;
		for (var i = 0; i < this.players.length; i++) {
			if (players[i].control == CPU) {
				this.currentActivePlayer = players[i];
				action = this.currentActivePlayer.getCPUAction();
			} else {
				action = players[i].getManualAction();
			}
		}
	}
}

var elements = {
	"foldButton" : getElement("#foldButton"),
	"checkButton" : getElement("#checkButton"),
	"callButton" : getElement("#callButton"),
	"raiseButton" : getElement("#raiseButton"),
	
}

function getElement(name) {
	return document.querySelector(name);
}

function setUpElements() {
	elements.foldButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().fold();
			console.log(table.getCurrentPlayer().name + " has folded");
		}
	}
	
	elements.checkButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().check();
			console.log(table.getCurrentPlayer().name + " has checked");
		}
	}

	elements.callButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().call(table);
			console.log(table.getCurrentPlayer().name + " has called");
		}
	}
	
	elements.raiseButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().raise(100, table);
			console.log(table.getCurrentPlayer().name + " has raised");
		}
	}
}

var dealer = new Dealer();
var p1 = new Player("P1");
var p2 = new Player("P2");
var communityCards = [];
dealer.dealCards(2, p1.hand);
dealer.dealCards(2, p2.hand);
dealer.dealCards(5, communityCards);
console.log("Community Cards: " + dealer.getCardSequenceString(communityCards));
console.log(`${p1.name}'s hand: ` + dealer.getCardSequenceString(p1.hand));
console.log(`${p2.name}'s hand: ` + dealer.getCardSequenceString(p2.hand));
console.log(`Cards left: ${dealer.deck.cards.length}`);

setUpElements();
var table = new Table();
table.addPlayer(new Player("P1", 100, "Manual"));
table.addPlayer(new Player("P2", 100, "CPU"));
table.addPlayer(new Player("P3", 100, "CPU"));
table.playRound();



