var EventEmitter = require('eventemitter2').EventEmitter2;

function Game(config, components) {
	var self = this;
	this.components = components;
	this.started = false;
	this.ended = false;

	this.phases = [];
	this.log = [];

	this.events = new EventEmitter({
		wildcard: true,
		deliminator: ':',
		newListener: true,
		maxListeners: 200
	});

	this.events.on('*', function(data) {
		self.log.push(this.event);
	});

	this.players = [];
	this.activePlayer = null;
	this.activePhase = 0;
	this.turn = 0;

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

	this.activePlayer = Math.floor(Math.random()*this.players.length);
	this.events.emit('game:started');

	this.newTurn();
};

Game.prototype.end = function() {
	this.ended = true;

	this.events.emit('game:ended');
};

Game.prototype.newTurn = function() {
	this.turn++;
	this.cycleActivePlayer();
	this.events.emit('game:newTurn', this.turn);
	this.enterActivePhase();
};

Game.prototype.getActivePhase = function() {
	return this.phases[this.activePhase];
};

Game.prototype.cycleActivePhase = function() {
	this.activePhase += 1;
	if (this.activePhase > this.phases.length - 1) {
		this.activePhase = 0;
		this.newTurn();
	} else {
		this.enterActivePhase();
	}
};

Game.prototype.enterActivePhase = function() {
	var activePhase = this.phases[this.activePhase];
	this.events.emit('game:activePhaseChange', activePhase);
	if (activePhase) {
		activePhase.enter(this.activePlayer);
	}
};

Game.prototype.cycleActivePlayer = function() {
	this.activePlayer += 1;
	if (this.activePlayer > this.players.length - 1) {
		this.activePlayer = 0;
	}
	this.events.emit('game:activePlayerChange', this.activePlayer);
};

module.exports = Game;