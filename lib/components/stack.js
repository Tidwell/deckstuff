var Card = require('./card');

function Stack(id, events, data) {
	this.id = id;
	this.zoneId = data.zoneId;
	this.events = events;
	//for a stack of cards, [0] is the "top" of the stack and [length-1] is the "bottom"
	this.cards = [];

	this.events.emit('stack:created', this);
}
/*
	card can be an array or array of cards
*/
Stack.prototype.add = function(card, position) {
	var self = this;

	if (card.length > 1) {
		card.forEach(function(c, i) {
			var cardObj = self.add(c, position);
			card[i] = cardObj;
		});
		return card;
	}
	//if its not a prebuilt card, we need to create it
	if (!(card instanceof Card)) {
		card = new Card(card, this.events);
	}
	switch(position) {
		case 'top':
			this.cards.unshift(card);
		break;

		case 'random':
			self.cards.splice(Math.floor(Math.random()*self.cards.length), 0, card);
		break;

		case 'bottom':
		default:
			this.cards.push(card);
		break;
	}
	card.updateLocation(this.zoneId, this.id);
	this.events.emit('stack:addedCard', card);

	return card;
};

Stack.prototype.draw = function(position) {
	var card = this.drawCard(position);
	this.events.emit('stack:removedCard', card);
	return card;
}

Stack.prototype.drawCard = function(position) {
	var self = this;
	if (!self.cards.length) { return null; }
	switch(position) {
		case 'bottom':
			return self.cards.pop();
		case 'random':
			return self.cards.splice(Math.floor(Math.random()*self.cards.length), 1)[0];
		case 'top':
		default:
			return self.cards.shift();
	}

	return;
};

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
Stack.prototype.shuffle = function() {
    for (var i = this.cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
    }
    this.events.emit('stack:shuffledCards', this);
    return this.cards;
};

module.exports = Stack;