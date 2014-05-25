var EventEmitter = require('eventemitter2').EventEmitter2;
var Zone = require('./zone');
var Player = require('./player');
var Phase = require('./phase');

function Game() {
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

	this.zones = new Zone('zones', this.events);
}

Game.prototype.addPlayer = function(data) {
	var player = new Player(this.events, data);
	this.players.push(player);
	this.events.emit('game:addedPlayer');
	return player;
};
Game.prototype.addPhase = function(data) {
	var phase = new Phase(this.events, data);
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