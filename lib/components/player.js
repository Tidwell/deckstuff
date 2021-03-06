module.exports = class Player {
	constructor(events, data) {
		for (var prop in data) {
			this[prop] = data[prop];
		}
		this.name = data.name;
		this.events = events;

		this.events.emit('player:created', this);
		return this;
	}
};
