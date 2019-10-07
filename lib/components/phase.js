module.exports = class Phase {
	constructor(events, data) {
		this.name = data.name;
		this.events = events;
		//if the phase gives priority to the player
		this.priority = data.priority;
		this.action = data.action || function() {};

		if (data.enter) { this.enter = data.enter; }

		this.events.emit('phase:created', this);
		return this;
	}
	enter(activePlayer) {
		this.events.emit('phase:entered', this);
		if (!this.priority) { return this.action(); }
	}
};
