var GameComponents = require('../');

GameComponents.components.Stack.prototype.damage = 0;
GameComponents.components.Card.prototype.tapped = false;
GameComponents.components.Card.prototype.owner = null;

GameComponents.components.Game.prototype.getActivePlayerCurrency = function() {
		return this.zones.getZone('player-' + this.activePlayer).getStack('currency').cards.length;
};
GameComponents.components.Game.prototype.spendActivePlayerCurrency = function(amount) {
	while (amount > 0) {
		c = this.zones.getZone('player-' + this.activePlayer).getStack('currency').draw();
		this.zones.getZone('player-' + this.activePlayer).getStack('discard').add(c);
		amount--;
	}
};
GameComponents.components.Game.prototype.buy = function(cardId) {
	if (!cardId) { throw new Error('No card passed to buy'); }

	var toBuy;
	var cards = this.zones.getZone('shared:to-buy').getCards();
	cards.forEach(function(c){
		if (c.id === cardId) {
			toBuy = c;
		}
	});
	if (!toBuy) { throw Error('Not a valid buy'); }
	if (!toBuy.cost) { toBuy.cost = 0; }

	if (toBuy.cost <= this.getActivePlayerCurrency()) {
		var card = this.zones.getZone('shared:to-buy').getStack(toBuy.stack).getCard(toBuy.id, true);
		var copy = new this.components.Card(card, this.events);
		this.zones.getZone('shared:purchase').getStack('packs').add(card);
		this.zones.getZone('shared:purchase').getStack('packs').shuffle();
		this.zones.getZone('player-' + this.activePlayer).getStack('discard').add(copy);
		this.spendActivePlayerCurrency(card.cost);
	} else {
		console.log(toBuy.cost, this.getActivePlayerCurrency());
		throw Error('Invalid currency to perform buy');
	}
	
}

var phases = require('./phases');
var zonesStacks = require('./zones-stacks');


function onStart() {
	var self = this;
	//shuffle the purchase
	this.zones.getZone('shared:purchase').getStack('packs').shuffle();

	//Flip the top 3 cards of the PURCHASE to stacks BUY1 BUY2 and BUY3
	c1 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy1').add(c1);
	c2 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy2').add(c2);
	c3 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy3').add(c3);

	//Each player draws 4 cards
	var toDraw = 4;
	
	var self = this;
	this.players.forEach(function(p,pIndex){
		var i = 0;
		while (i < 4) {
			var card = self.zones.getZone('player-'+pIndex+':deck').getStack('deck').draw();
			self.zones.getZone('player-'+pIndex+':hand').getStack('hand').add(card);
			i++;
		}
	});

	//make sure we give cards an owner
	self.events.on('card:created', function(card){
		card.owner = self.activePlayer;
	});
}

module.exports = {
	createGame: function(players) {
		var game = new GameComponents.createGame({
			onStart: onStart
		});
		phases(game);
		zonesStacks(game, players);
		return game;
	}
};