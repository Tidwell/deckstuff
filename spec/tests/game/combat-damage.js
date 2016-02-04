var Game = require('../../../game');
var game;
var z;

describe('combat damage phase', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});


	it('should deal damage to each bot in each combat zone equal to their opposing power', function() {
		game.start();
		var creatures = playCreatures(game, z);
		creatures[0].power = 2;
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures(game, z);
		creatures2[1].power = 2;
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //attack
		game.getActivePhase().action(null, true); //2nd main
		expect(game.turn).toBe(3);
		game.getActivePhase().action(null, true); //main
		expect(game.getActivePhase().name).toBe('declare-attackers');
		declareAttacks(game, z, creatures);
		declareBlocks(game, z, creatures2, creatures);

		expect(game.getActivePhase().name).toBe('second-main');
		expect(z.getZone('shared:player-' + (game.activePlayer ? 0 : 1) + '-inplay').getCards()[0].power).toBe(1);
		expect(z.getZone('shared:player-' + (game.activePlayer) + '-inplay').getCards()[0].power).toBe(1);
	});

	it('bots deal damage to nodes/mainframe if unblocked', function() {
		game.start();
		var creatures = playCreatures(game, z);
		game.getActivePhase().action(null, true);
		declareAttacks(game, z, creatures);
		game.getActivePhase().action(null, true);

		expect(game.getActivePhase().name).toBe('second-main');
		expect(game.zones.getZone('player-' + (game.activePlayer ? 0 : 1)).getStack('node1').damage).toBe(1);
		expect(game.zones.getZone('player-' + (game.activePlayer ? 0 : 1)).getStack('node2').damage).toBe(1);
	});

	it('game.resolveInplayDeaths() should destroy all 0 power bots in play', function() {
		game.start();
		var creatures = playCreatures(game, z);
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(2);
		creatures[0].power = 0;
		game.resolveInplayDeaths();
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(1);
	});

	it('should move all undead units back to inplay zones after combat', function() {
		game.start();
		var creatures = playCreatures(game, z);
		game.getActivePhase().action(null, true); //pass main

		declareAttacks(game, z, creatures);
		game.getActivePhase().action(null, true); //pass blcks

		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(0);
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(2);
	});
	it('should move the units back to their owners inplay', function() {
		game.start();
		var creatures = playCreatures(game, z);
		creatures[0].power = 2;
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures(game, z);
		creatures2[1].power = 2;
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //attack
		game.getActivePhase().action(null, true); //2nd main
		expect(game.turn).toBe(3);
		game.getActivePhase().action(null, true); //main
		expect(game.getActivePhase().name).toBe('declare-attackers');
		declareAttacks(game, z, creatures);
		declareBlocks(game, z, creatures2, creatures);

		expect(game.getActivePhase().name).toBe('second-main');
		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(0);
		expect(z.getZone('shared:player-0-inplay').getCards().length).toBe(1);
		expect(z.getZone('shared:player-1-inplay').getCards().length).toBe(1);

	});
});