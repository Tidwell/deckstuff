var EventEmitter = require('eventemitter2').EventEmitter2;
var Zone = require('./zone');

function Game() {
	this.started = false;

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

module.exports = Game;