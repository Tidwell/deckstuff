function Phase(events, data) {
	this.name = data.name;
	this.events = events;

	this.events.emit('phase:created', this);
	return this;
}

module.exports = Phase;