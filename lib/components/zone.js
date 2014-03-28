var extend = require('util')._extend;
var Stack = require('./stack');

function Zone(id, events, data) {
	this.events = events;
	this.zones = {};
	this.stacks = {};
	this.id = id;

	this.events.emit('zone:created', this);
}

/* Allow to Iterate over zones but keep them keyed */
Zone.prototype.forEach = function(func) {
	var self = this;
	Object.keys(self.zones).forEach(function(key) {
		func(self.zones[key], key);
	});
};

//adds a zone to this set of zones
Zone.prototype.addZone = function(id, data) {
	//extend with defaults
	var zone = extend({}, data);

	//set options passed in
	zone.id = id;

	//create
	this.zones[id] = new Zone(id, this.events, data);

	//notify and return
	this.events.emit('zone:added', this.zones[id]);
	return this.zones[id];
};

Zone.prototype.getZone = function(id) {
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
	this.stacks[id] = new Stack(id, this.events, stack);
	
	//notify and return
	this.events.emit('zone:stackAdded', this.stacks[id]);
	return this.stacks[id];
};

Zone.prototype.getStack = function(id) {
	return this.stacks[id];
};


module.exports = Zone;