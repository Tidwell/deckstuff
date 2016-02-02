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

describe('Phases', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});
	it('start-of-turn', function(){
		expect(game.phases[0].name).toBe('start-of-turn');
	});
	

	//main
	it('may play a card from hand', function() {
		game.start();

		var hand = z.getZone('player-'+game.activePlayer+':hand').getStack('hand');
		//it should move the currency to the currency zone
		var toPlay = hand.cards[0].id;

		game.getActivePhase().action({type: 'play', id: toPlay});

		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(1);
		expect(hand.cards.length).toBe(3);
	});
	it('may buy a card from the buy stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];

		game.getActivePhase().action({type: 'buy', id: toBuy.id});

		expect(z.getZone('player-'+game.activePlayer).getStack('discard').cards.length).toBe(1);

	});
	it('may use an ability on their mainframe', function() {
		game.start();

		expect(false).toBe(true)

	});
	it('may advance to the next phase', function() {
		game.start();
		
		//pass during main
		game.getActivePhase().action(null, true);
		
		expect(game.getActivePhase().name).toBe('declare-attackers');
	});

	it('on playing a card', function() {
		// -resolve text
		// -program does as it says and is discard
		// -currency goes to currency zone
		// -check destroyed
	});

	it('on buying a card', function() {
		// 			-cost is paid
		// 			-card created and added to players discard if program, put in a node if a server
		// 			-card removed from buy stack shuffled back into PURCHASE
	});

	// 		-may use an ability on their mainframe
	// 			-cost is paid
	// 			-resolve text
	// 		-may advance to the next phase
	// 	declare-attackers
	// 		-active player can declare which bots are attacking which nodes or mainframe
	// 		-attacking bots are tapped and moved into a SHARED:BATTLE zone
	// 		-may advance to the next phase
	// 	declare-defenders
	// 		-blocking player can declare which bots are blocking which attacking bots
	// 		-on assign, attacker and blocker are moved into a SHARED:COMBATS:COMBAT# zone in an ATTACKING & DEFENDING stack
	// 		-may advance to the next phase
	// 	resolve-damage
	// 		-damage is dealt to each bot in each combat zone equal to their power
	// 		-bots deal damage to nodes/mainframe if unblocked
	// 		-check destroyed
	// 	second-main
	// 		SEE main
	// 	end-of-turn
	// 		-flip new cards from the PURCHASE to the BUY stacks
	// 	draw
	// 		-active player draws till they have 4 cards in hand
});

// Bot is destroyed if reduced to 0 power
// Node is destroyed if reduced to 0 health
// Mainframe cannot be attacked until Nodes are destroyed
// A player loses if their mainframe is reduced to 0 health
// A player wins if they are the last player in the game

// Costs are paid by removing a currency card from a players CURRENCY stack to their DISCARD stack
