var Game = require('../../../game');
var game;
var z;

describe('start of turn phase', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});
	it('start-of-turn', function() {
		expect(game.phases[0].name).toBe('start-of-turn');
	});
	it('should untap all creatures at the start of turn', function() {
		game.start();

		var creatures = playCreatures(game, z);
		game.getActivePhase().action(null, true);

		declareAttacks(game, z, creatures);
		//pass blocks
		game.getActivePhase().action(null, true);
		//pass 2nd main
		game.getActivePhase().action(null, true);

		expect(game.getActivePhase().name).toBe('main');

		var inactivePlayer = game.activePlayer ? 0 : 1;
		var c = z.getZone('shared:player-' + inactivePlayer + '-inplay').getCards();
		c.forEach(function(card) {
			expect(card.tapped).toBe(true);
		});

		//pass during main
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('declare-attackers');

		//pass during attacks
		game.getActivePhase().action(null, true);

		//expect to skip blockers/dmg
		expect(game.getActivePhase().name).toBe('second-main');

		//pass during 2nd main
		game.getActivePhase().action(null, true);

		expect(game.turn).toBe(3);
		expect(game.getActivePhase().name).toBe('main');

		c = z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards();
		c.forEach(function(card) {
			expect(card.tapped).toBe(false);
		});
	});
});