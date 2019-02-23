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
}

class Player {
	constructor(name, chips) {
		this.name = name;
		this.chips = chips;
		this.hand = [];
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



