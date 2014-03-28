function Player(events, data) {
	this.name = data.name;
	this.events = events;

	this.events.emit('player:created', this);
	return this;
}

module.exports = Player;