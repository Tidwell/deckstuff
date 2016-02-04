function Card(data, events) {
	this.events = events;

	for(var prop in data) {
		this[prop] = data[prop];
	}

	//properties
	this.id = generateUUID();
	this.name = data.name;

	//so it knows where it is
	this.previousZone = null;
	this.previousStack = null;

	this.zone = null;
	this.stack = null;

	this.resolve = data && data.resolve ? data.resolve : function() {};

	this.events.emit('card:created', this);
}

Card.prototype.updateLocation = function(zone, stack) {
	this.previousZone = this.zone;
	this.zone = zone;

	this.previousStack = this.stack;
	this.stack = stack;
	
	if (this.previousZone !== this.zone) {
		this.events.emit('card:zoneChange', this);
	}

	if (this.previousStack !== this.stack) {
		this.events.emit('card:stackChange', this);
	}
};

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

module.exports = Card;