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

var createCreatureCard = {
	name: 'Create1powercreature',
	resolve: function(game) {
		//create the creature
		var creature = new game.components.Card({name: '1powercreature', power: 1}, game.events);
		game.zones.getZone('shared:player-' + game.activePlayer+'-inplay').addStack(creature.id).add(creature);
		//move to discard
		game.zones.getZone('player-' + game.activePlayer).getStack('discard').add(this);
	}
};

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
	it('playing a program should be able to create a bot', function() {
		game.start();

		var hand = z.getZone('player-'+game.activePlayer+':hand').getStack('hand');
		
		var card = hand.add(createCreatureCard);

		game.getActivePhase().action({type: 'play', id: card.id});

		expect(z.getZone('shared:player-'+game.activePlayer+'-inplay').getCards().length).toBe(1);
		expect(hand.cards.length).toBe(4);
		expect(z.getZone('player-'+game.activePlayer).getStack('discard').cards.length).toBe(1);

	});
	it('may buy a card from the buy stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];

		game.getActivePhase().action({type: 'buy', id: toBuy.id});

		expect(z.getZone('player-'+game.activePlayer).getStack('discard').cards.length).toBe(1);

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

	it('Costs are paid by removing a currency card from a players CURRENCY stack to their DISCARD stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];
		toBuy.cost = 3;

		var cZone = z.getZone('player-'+game.activePlayer).getStack('currency');
		cZone.add({name: 'dummy currency'});
		cZone.add({name: 'dummy currency'});
		cZone.add({name: 'dummy currency'});

		game.spendActivePlayerCurrency(3);
		expect(z.getZone('player-'+game.activePlayer).getStack('discard').cards.length).toBe(3);
	});

	it('should copy the card from the buy pile to put in the players deck and shuffle the bought back in', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];
		toBuy.cost = 0;

		game.getActivePhase().action({type: 'buy', id: toBuy.id});

		expect(z.getZone('shared:purchase').getStack('packs').cards.length).toBe(8);
		expect(z.getZone('player-'+game.activePlayer).getStack('discard').cards.length).toBe(1);
		expect(z.getZone('shared:purchase').getCards().indexOf(toBuy)).not.toBe(-1);
		expect(z.getZone('player-'+game.activePlayer).getStack('discard').getCard(toBuy.id)).toBe(undefined);
	});


	it('should be declare-attackers after main', function() {
		game.start();
		game.getActivePhase().action(null, true);
		
		expect(game.getActivePhase().name).toBe('declare-attackers');
	});
	it('active player can declare which bots are attacking and they should be moved to the shared:battle zone', function() {
		game.start();
		var hand = z.getZone('player-'+game.activePlayer).getZone('hand').getStack('hand');
		var c1 = hand.add(createCreatureCard);
		var c2 = hand.add(createCreatureCard);
		game.getActivePhase().action({type: 'play', id: c1.id});
		game.getActivePhase().action({type: 'play', id: c2.id});

		game.getActivePhase().action(null, true);
		var creatures = z.getZone('shared:player-'+game.activePlayer+'-inplay').getCards();
		expect(creatures.length).toBe(2);

		game.getActivePhase().action([{
			id: creatures[0].id,
			target: 'node1'
		},
		{
			id: creatures[1].id,
			target: 'node2'
		}]);

		expect(z.getZone('shared:battle').getCards().length).toBe(2);
		expect(z.getZone('shared:player-'+game.activePlayer+'-inplay').getCards().length).toBe(0);
		game.serialize();
	});

	// 		-active player can declare which bots are attacking which nodes or mainframe
	// 		-attacking bots are tapped

	// 	declare-defenders
	// 		-blocking player can declare which bots are blocking which attacking bots
	// 		-on assign, attacker and blocker are moved into a SHARED:COMBATS:COMBAT# zone in an ATTACKING & DEFENDING stack

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
// if a player would draw a card from their deck and it is empty, their discard is shuffled to form a new deck, if still cant draw - no card is drawn

// cards in the to-buy stacks have a MAXBUYS # and when bought reduced by one.  hits zero, removed from buys