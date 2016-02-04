var Game = require('../../../game');
var game;
var z;

describe('EOT and Draw Phases', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});

	it('end of turn flip new cards from the PURCHASE to the BUY stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];

		game.getActivePhase().action({
			type: 'buy',
			id: toBuy.id
		});

		expect(z.getZone('player-' + game.activePlayer).getStack('discard').cards.length).toBe(1);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main

		expect(game.turn).toBe(2);
		expect(z.getZone('shared:to-buy').getCards().length).toBe(3);
	});

	it('draw phase, active player draws till they have 4 cards in hand', function() {
		game.start();
		playHand(game,z);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main
		expect(game.turn).toBe(2);
		expect(z.getZone('player-' + game.activePlayer + ':hand').getCards().length).toBe(4);
	});
});