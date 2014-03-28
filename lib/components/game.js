var EventEmitter = require('eventemitter2').EventEmitter2;
var Zone = require('./zone');

function Game() {
	this.started = false;
	this.ended = false;

	this.events = new EventEmitter({
		wildcard: true,
		deliminator: ':',
		newListener: true,
		maxListeners: 200
	});

	this.zones = new Zone('zones', this.events);
}

Game.prototype.start = function() {
	this.started = true;

	this.events.emit('game:started');
};

Game.prototype.end = function() {
	this.ended = true;

	this.events.emit('game:ended');
};

module.exports = Game;