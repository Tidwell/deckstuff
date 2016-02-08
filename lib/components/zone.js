var extend = require('util')._extend;

function Zone(id, events, data, components) {
	/*
		access
		------
		public - all players can see all cards in all stacks
		private - just the owner can see cards, others can count
		hidden - only can be counted
	 */
	this.access = 'public';

	for (var prop in data) {
		this[prop] = data[prop];
	}
	this.components = components;
	this.events = events;
	this.zones = {};
	this.stacks = {};
	this.id = id;

	this.events.emit('zone:created', this);
}

/* Allow to Iterate over zones but keep them keyed */
Zone.prototype.forEach = function(func) {
	var self = this;
	Object.keys(self.zones).forEach(function(key, i) {
		func(self.zones[key], i, key);
	});
};

Zone.prototype.forEachStack = function(func) {
	var self = this;
	Object.keys(self.stacks).forEach(function(key, i) {
		func(self.stacks[key], i, key);
	});
};

//adds a zone to this set of zones
Zone.prototype.addZone = function(id, data) {
	//extend with defaults
	var zone = extend({}, data);

	//set options passed in
	zone.id = id;

	//create
	this.zones[id] = new Zone(id, this.events, data, this.components);

	//notify and return
	this.events.emit('zone:addedZone', this.zones[id]);
	return this.zones[id];
};

Zone.prototype.getZone = function(id) {
	if (id.indexOf(':') !== -1) {
		var activeZone = this;

		var ids = id.split(':');
	
		ids.forEach(function(id) {
			activeZone = activeZone.getZone(id);
			if (!activeZone) {
				throw new Error('no zone found for ' + id);
			}
		});

		return activeZone;
	}

	return this.zones[id];
};

//add a stack to this zone
Zone.prototype.addStack = function(id, data) {
	//extend with defaults
	var stack = extend({}, data);

	//set options passed in
	stack.id = id;
	stack.zoneId = this.id;

	//create
	this.stacks[id] = new this.components.Stack(id, this.events, stack, this.components);

	//notify and return
	this.events.emit('zone:addedStack', this.stacks[id]);
	return this.stacks[id];
};

Zone.prototype.getStack = function(id) {
	return this.stacks[id];
};

Zone.prototype.getCards = function() {
	var allCards = [];
	this.forEach(function(z, i, key) {
		allCards = allCards.concat(z.getCards());
	});
	this.forEachStack(function(s, i, key) {
		allCards = allCards.concat(s.cards);
	});
	return allCards;
};

Zone.prototype.getCard = function(id, removeFromStack) {
	var self = this;
	var toReturn = null;
	this.forEachStack(function(s, i, key) {
		if (toReturn) { return; }
		var card = s.getCard(id,removeFromStack);
		if (card) { toReturn = card; }
	});
	
	this.forEach(function(z){
		if (toReturn) { return; }
		var card = z.getCard(id,removeFromStack);
		if (card) { toReturn = card; }
	});
	return toReturn;
};

Zone.prototype.serialize = function(role) {
	if ((this.access === 'public') ||
		(this.access === 'private' && role === this.owner)) {

		return this;
	}
	else {
		return { cards: this.getCards().length };
	}
};

module.exports = Zone;