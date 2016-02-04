var Game = require('../../../game');
var game;
var z;

describe('main phase', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});
	
	//main
	it('may play a card from hand', function() {
		game.start();

		var hand = z.getZone('player-' + game.activePlayer + ':hand').getStack('hand');
		//it should move the currency to the currency zone
		var toPlay = hand.cards[0].id;

		game.getActivePhase().action({
			type: 'play',
			id: toPlay
		});

		expect(z.getZone('player-' + game.activePlayer).getStack('currency').cards.length).toBe(1);
		expect(hand.cards.length).toBe(3);
	});
	it('playing a program should be able to create a bot', function() {
		game.start();

		var hand = z.getZone('player-' + game.activePlayer + ':hand').getStack('hand');

		var card = hand.add(createCreatureCard);

		game.getActivePhase().action({
			type: 'play',
			id: card.id
		});

		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(1);
		expect(hand.cards.length).toBe(4);
		expect(z.getZone('player-' + game.activePlayer).getStack('discard').cards.length).toBe(1);

	});
	it('a bot should have an owner id', function() {
		game.start();

		var hand = z.getZone('player-' + game.activePlayer + ':hand').getStack('hand');

		var card = hand.add(createCreatureCard);

		game.getActivePhase().action({
			type: 'play',
			id: card.id
		});
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards()[0].owner).toBe(game.activePlayer);
	});
	it('may buy a card from the buy stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];

		game.getActivePhase().action({
			type: 'buy',
			id: toBuy.id
		});

		expect(z.getZone('player-' + game.activePlayer).getStack('discard').cards.length).toBe(1);

	});
	it('may use an ability on their mainframe', function() {
		game.start();

		//cost is paid
		//resolve()

	});
	it('may advance to the next phase', function() {
		game.start();

		//pass during main
		game.getActivePhase().action(null, true);

		expect(game.getActivePhase().name).toBe('declare-attackers');
	});
});