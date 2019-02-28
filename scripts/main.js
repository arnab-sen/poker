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
		this.currentBet = 0;
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
	
	fold(table) {
		this.hasFolded = true;
		this.moveDone = true;
		console.log(table.getCurrentPlayer().name + " has folded");
		if (table.getCurrentPlayer().control != "CPU") table.startNextPlayerTurn();
	}
	
	call(table) {
		/* Call or check (call 0 chips) */
		this.removeChips(table.currentBet);
		if (this.currentBet != table.currentBet) {
			table.pot += table.currentBet;
			this.currentBet = table.currentBet;
			console.log(table.getCurrentPlayer().name + " has called");
		} else {
			console.log(table.getCurrentPlayer().name + " has checked");
		}
		this.moveDone = true;
		if (table.getCurrentPlayer().control != "CPU") table.startNextPlayerTurn();
	}
	
	raise(table, numChips) {
		numChips = this.removeChips(numChips);
		table.pot += numChips;
		table.currentBet += numChips;
		this.moveDone = true;
		console.log(table.getCurrentPlayer().name + " has raised " + numChips);
		if (table.getCurrentPlayer().control != "CPU") table.startNextPlayerTurn();
	}
	
	getCPUAction(table) {
		this.call(table);
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
		console.log("Turn done");
	}
	
	getCurrentPlayer() {
		if (this.currentPlayer == null) {
			return null;
		} else if (this.currentPlayer >= this.players.length) { 
			return this.players[0];
		} else { 
			return this.players[this.currentPlayer];
		}
		
	}
	
	startNextPlayerTurn() {
		console.log("startNextPlayerTurn() has been called");
		if (this.currentPlayer == null) this.currentPlayer = -1;
		this.currentPlayer++;
		var player = this.getCurrentPlayer();
		console.log(player.name + "'s turn");
		console.log(player.control);
		console.log(player.control == "CPU");
		
		var loopCount = 0;
		while ((player.control == "CPU") && (!player.moveDone)) {
			console.log(player.name, "auto");
			player.getCPUAction(this);
			this.currentPlayer++;
			player = this.getCurrentPlayer();
			console.log("Changed players to", player.name)
			loopCount++;
			if (loopCount > 1000) {
				console.log("Infinite loop detected");
				return;
			}
		}
		
		if (player.currentBet == table.currentBet) {
			elements.callButton.textContent = "Check";
		} else {
			elements.callButton.textContent = "Call " + this.currentBet;
		}
		if (player.control == "Manual") {
			console.log("Returning");
			return;
		}
		if (player.moveDone) {
			console.log(player.name, "move done")
			this.currentPlayer++;
		}
		if (this.roundComplete()) this.getRoundWinner();
	}
	
	roundComplete() {
		/* Check if all players have completed thir moves */
		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i].hasFolded) continue;
			if (!(this.players[i].moveDone) || 
			(this.players[i].currentBet != this.currentBet)) { 
				console.log(this.players[i].name, this.players[i].currentBet, this.currentBet);
				return false;
			}
		}
		
		console.log("Round complete");
		return true;
	}
	
	getRoundWinner() {
		return;
	}
}

var elements = {
	"foldButton" : getElement("#foldButton"),
	"callButton" : getElement("#callButton"),
	"raiseButton" : getElement("#raiseButton")
}

function getElement(name) {
	return document.querySelector(name);
}

function setUpElements() {
	elements.foldButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().fold(table);
		}
	}

	elements.callButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().call(table);
		}
	}
	
	elements.raiseButton.onclick = e => {
		if (table.getCurrentPlayer() != null) {
			table.getCurrentPlayer().raise(table, 100);
		}
	}
}

setUpElements();
var table = new Table();
table.addPlayer(new Player("P0", 100, "CPU"));
table.addPlayer(new Player("P1", 100, "Manual"));
table.addPlayer(new Player("P2", 100, "CPU"));
table.addPlayer(new Player("P3", 100, "CPU"));
table.playRound();



