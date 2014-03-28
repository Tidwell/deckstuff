function Card(data, events) {
	this.events = events;

	//properties
	this.id = generateUUID();
	this.name = data.name;

	//so it knows where it is
	this.zone = null;
	this.stack = null;

	this.events.emit('card:created', this);
}

Card.prototype.changeStack = function(newStack) {
	this.fromStack = this.stack;
	this.stack = newStack;
	this.events.emit('card:stackChange', this);
	delete this.fromStack;
};

Card.prototype.changeZone = function(newZone) {
	this.fromZone = this.zone;
	this.zone = newZone;
	this.events.emit('card:zoneChange', this);
	delete this.fromZone;
};

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

module.exports = Card;