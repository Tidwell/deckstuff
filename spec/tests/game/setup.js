var Game = require('../../../game');
var players = [{
	name: 'p1',
	pack: [{name: 'c1'},{name: 'c2'},{name: 'c3'},{name: 'c4'},{name: 'c5'}]
}, {
	name: 'p2',
	pack: [{name: 'c6'},{name: 'c7'},{name: 'c8'},{name: 'c9'},{name: 'c10'}]
}];
var game;
var z;

describe('Game setup', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});

	it('should have all the correct zones', function() {

		expect(z.getZone('shared')).toBeDefined();
		expect(z.getZone('shared:battle')).toBeDefined();
		expect(z.getZone('shared:combats')).toBeDefined();
		expect(z.getZone('shared:purchase')).toBeDefined();
		expect(z.getZone('shared:to-buy')).toBeDefined();
		expect(z.getZone('shared:player-0-inplay')).toBeDefined();
		expect(z.getZone('shared:player-1-inplay')).toBeDefined();

		expect(z.getZone('player-0')).toBeDefined();
		expect(z.getZone('player-0:hand')).toBeDefined();
		expect(z.getZone('player-0:deck')).toBeDefined();

		expect(z.getZone('player-1')).toBeDefined();
		expect(z.getZone('player-1:hand')).toBeDefined();
		expect(z.getZone('player-1:deck')).toBeDefined();

	});
	it('should be setup correctly', function() {
		game.start();
		expect(game.turn).toBe(1);
		expect(game.started).toBe(true);
		expect(game.players.length).toBe(2);
		expect(game.phases.length).toBe(8);
	});


	it('Each player starts the game with 8 BASIC-GAIN-1 cards in their DECK', function() {
		var cards = z.getZone('player-1:deck').getCards();
		expect(cards.length).toBe(8);
		expect(cards[0].name).toBe('BASIC-GAIN-1');
	});

	it('Each player opens a PACK of 5 CARDS and shuffles them together forming a 10 card PURCHASE', function() {
		//check the populate
		var c = z.getZone('shared:purchase').getCards();
		expect(c.length).toBe(10);
	});

	//START OF GAME
	it('Flip the top 3 cards of the PURCHASE to stacks BUY1 BUY2 and BUY3', function() {
		game.start();
		expect(z.getZone('shared:purchase').getStack('packs').cards.length).toBe(7);
		expect(z.getZone('shared:to-buy').getStack('buy1').cards.length).toBe(1);
		expect(z.getZone('shared:to-buy').getStack('buy2').cards.length).toBe(1);
		expect(z.getZone('shared:to-buy').getStack('buy3').cards.length).toBe(1);
	});
	it('Each player draws 4 cards', function() {
		game.start();
		expect(z.getZone('player-0:hand').getCards().length).toBe(4);
		expect(z.getZone('player-1:hand').getCards().length).toBe(4);
	});
	 
	it('Determine the first player randomly', function() {
		game.start();
		expect(typeof game.activePlayer).toBe('number');
	});
	it('Each player performs the phases in their turn in order before play proceeds to the next turn', function() {
		game.start();

		expect(game.turn).toBe(1);
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
		expect(game.getActivePhase().name).toBe('main');
	});
});