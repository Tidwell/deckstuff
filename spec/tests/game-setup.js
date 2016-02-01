var GameComponents = require('../../');

var game = new GameComponents.createGame();
var loggedEvents = [];
game.events.on('*', function(data) {
	loggedEvents.push(this.event);
});

var card = {
	name: 'BASIC-GAIN-1'
};
var deck = [];
var i = 0;
while (i < 8) {
	deck.push(card);
	i++;
}

var players = [{
	name: 'p1'
}, {
	name: 'p2'
}];


game.addPhase({
	name: 'start-of-turn',
	priority: false,
	action: function() {
		//placeholder phase
		game.cycleActivePhase();
	}
});
game.addPhase({
	name: 'main',
	priority: 'activePlayer',
	action: function(card, pass) {
		//allow player to play things
		if (card) {

		}
		if (pass) {
			game.cycleActivePhase();
		}
	}
});
game.addPhase({
	name: 'declare-attackers',
	priority: 'activePlayer',
	action: function(attackers, pass) {
		//allow player to declare attacks
		if (attackers) {

		}
		if (pass) {
			game.cycleActivePhase();
		}
	}
});
game.addPhase({
	name: 'declare-defenders',
	priority: 'inactivePlayer',
	action: function(defenders, pass) {
		//allow player to declare blocks
		if (defenders) {

		}
		if (pass) {
			game.cycleActivePhase();
		}
	},
	enter: function(activePlayer) {
		if (!game.zones.getZone('shared').getZone('combat').getCards().length) {
			return game.cycleActivePhase();
		}
		game.events.emit('phase:entered', this);
	}
});
game.addPhase({
	name: 'resolve-damage',
	priority: false,
	action: function() {
		game.cycleActivePhase();
	},
	enter: function() {
		if (!game.zones.getZone('shared').getZone('combat').getCards().length) {
			return game.cycleActivePhase();
		}
		game.events.emit('phase:entered', this);
	}
});
game.addPhase({
	name: 'second-main',
	priority: 'activePlayer',
	action: function(card, pass) {
		//allow player to play things
		if (card) {

		}
		if (pass) {
			game.cycleActivePhase();
		}
	}
});
game.addPhase({
	name: 'end-of-turn',
	priority: false,
	action: function() {
		//placeholder phase
		game.cycleActivePhase();
	}
});
game.addPhase({
	name: 'draw',
	priority: false,
	action: function() {
		//make the active player draw to 4
		
		game.cycleActivePhase();
	}
});

var sharedZones = game.zones.addZone('shared');
var playZone = sharedZones.addZone('play');
var combatZone = sharedZones.addZone('combat');
combatZone.addStack('attackers');
combatZone.addStack('defenders');
var stackZone = sharedZones.addZone('stack');

stackZone.addStack('stack');

players.forEach(function(p, i) {
	game.addPlayer(p);
	var playerZones = game.zones.addZone('player' + i + '-zones');
	playerZones.addStack('hand');
	playerZones.addStack('deck');
	playerZones.addStack('discard');
	playerZones.addStack('currency');
	playerZones.addStack('player' + i + '-stack');
	playZone.addStack('player' + i + '-inplay');
	playZone.addStack('player' + i + '-building1');
	playZone.addStack('player' + i + '-building2');
});

describe('Full game example', function() {
	it('should fire all events during setup', function() {
		
	});
	
	it('should work', function() {
		game.start();

		//pass during main
		expect(game.turn).toBe(1);
		expect(game.started).toBe(true);
		expect(game.players.length).toBe(2);
		expect(game.phases.length).toBe(8);
		expect(game.getActivePhase().name).toBe('main');
		
		//pass during main
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('declare-attackers');
		//pass during attacks
		game.getActivePhase().action(null, true);
		//expect to skip blockers/dmg
		expect(game.getActivePhase().name).toBe('second-main');
		//pass during 2nd main
		game.getActivePhase().action(null, true);

		expect(game.turn).toBe(2);
	});
});