var Game = require('../../../game');
var game;
var z;

describe('declare defenders phase', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});

	// declare-defenders
	it('inactive player declares blocks and attacker and blocker are moved into a SHARED:COMBATS:COMBAT# zone in an ATTACKING & DEFENDING', function() {
		game.start();
		game.phases[4].enter = function() {
			game.cycleActivePhase();
		}; //disable the damage phase

		var creatures = playCreatures(game, z);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //pass attack
		game.getActivePhase().action(null, true); //pass 2nd main
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures(game, z);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var activePlayer = game.activePlayer;
		game.getActivePhase().action(null, true); //pass main
		declareAttacks(game, z, creatures);

		expect(game.activePlayer).not.toEqual(activePlayer);
		expect(game.getActivePhase().name).toBe('declare-defenders');

		declareBlocks(game, z, creatures2, creatures);

		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(4);
		var totalZones = 0;
		z.getZone('shared:combats').forEach(function(zone) {
			expect(zone.getCards().length).toBe(2);
			totalZones++;
		});
		expect(totalZones).toBe(2);

	});

	it('should skip phase if there are nothing in both the shared:battle and shared:combats zones', function() {
		game.start();
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //pass attack
		expect(game.getActivePhase().name).toBe('second-main');
	});
});