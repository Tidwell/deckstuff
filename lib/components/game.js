var EventEmitter = require('eventemitter2').EventEmitter2;

function Game(config, components) {
	this.components = components;
	this.started = false;
	this.ended = false;

	this.phases = [];

	this.events = new EventEmitter({
		wildcard: true,
		deliminator: ':',
		newListener: true,
		maxListeners: 200
	});

	this.players = [];

	this.zones = new this.components.Zone('zones', this.events, {}, this.components);
}

Game.prototype.addPlayer = function(data) {
	var player = new this.components.Player(this.events, data);
	this.players.push(player);
	this.events.emit('game:addedPlayer');
	return player;
};
Game.prototype.addPhase = function(data) {
	var phase = new this.components.Phase(this.events, data);
	this.phases.push(phase);
	this.events.emit('game:addedPhase');
	return phase;
};

Game.prototype.start = function() {
	this.started = true;

	this.events.emit('game:started');
};

Game.prototype.end = function() {
	this.ended = true;

	this.events.emit('game:ended');
};

module.exports = Game;