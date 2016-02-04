var Game = require('../../../game');
var players = [{
	name: 'p1',
	pack: [{
		name: 'c1'
	}, {
		name: 'c2'
	}, {
		name: 'c3'
	}, {
		name: 'c4'
	}, {
		name: 'c5'
	}]
}, {
	name: 'p2',
	pack: [{
		name: 'c6'
	}, {
		name: 'c7'
	}, {
		name: 'c8'
	}, {
		name: 'c9'
	}, {
		name: 'c10'
	}]
}];
var game;
var z;

var createCreatureCard = {
	name: 'Create1powercreature',
	resolve: function(game) {
		//create the creature
		var creature = new game.components.Card({
			name: '1powercreature',
			power: 1
		}, game.events);
		game.zones.getZone('shared:player-' + game.activePlayer + '-inplay').addStack(creature.id).add(creature);
		//move to discard
		game.zones.getZone('player-' + game.activePlayer).getStack('discard').add(this);
	}
};

function playCreatures() {
	var hand = z.getZone('player-' + game.activePlayer).getZone('hand').getStack('hand');
	var c1 = hand.add(createCreatureCard);
	var c2 = hand.add(createCreatureCard);
	game.getActivePhase().action({
		type: 'play',
		id: c1.id
	});
	game.getActivePhase().action({
		type: 'play',
		id: c2.id
	});

	var creatures = z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards();
	expect(creatures.length).toBe(2);
	return creatures;
}

function declareAttacks(creatures) {
	game.getActivePhase().action([{
		id: creatures[0].id,
		target: 'node1'
	}, {
		id: creatures[1].id,
		target: 'node2'
	}]);
}

function declareBlocks(creatures, targets) {
	game.getActivePhase().action([{
		id: creatures[0].id,
		target: targets[0].id
	}, {
		id: creatures[1].id,
		target: targets[1].id
	}]);
}

describe('Phases', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
	});
	it('start-of-turn', function() {
		expect(game.phases[0].name).toBe('start-of-turn');
	});
	it('should untap all creatures at the start of turn', function() {
		game.start();

		var creatures = playCreatures();
		game.getActivePhase().action(null, true);

		declareAttacks(creatures);
		//pass blocks
		game.getActivePhase().action(null, true);
		//pass 2nd main
		game.getActivePhase().action(null, true);

		expect(game.getActivePhase().name).toBe('main');
		
		var inactivePlayer = game.activePlayer ? 0 : 1;
		var c = z.getZone('shared:player-'+inactivePlayer+'-inplay').getCards();
		c.forEach(function(card){
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

		c = z.getZone('shared:player-'+game.activePlayer+'-inplay').getCards();
		c.forEach(function(card){
			expect(card.tapped).toBe(false);
		});
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

	it('Costs are paid by removing a currency card from a players CURRENCY stack to their DISCARD stack', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];
		toBuy.cost = 3;

		var cZone = z.getZone('player-' + game.activePlayer).getStack('currency');
		cZone.add({
			name: 'dummy currency'
		});
		cZone.add({
			name: 'dummy currency'
		});
		cZone.add({
			name: 'dummy currency'
		});

		game.spendActivePlayerCurrency(3);
		expect(z.getZone('player-' + game.activePlayer).getStack('discard').cards.length).toBe(3);
	});

	it('should copy the card from the buy pile to put in the players deck and shuffle the bought back in', function() {
		game.start();
		var toBuy = z.getZone('shared:to-buy').getStack('buy1').cards[0];
		toBuy.cost = 0;

		game.getActivePhase().action({
			type: 'buy',
			id: toBuy.id
		});

		expect(z.getZone('shared:purchase').getStack('packs').cards.length).toBe(8);
		expect(z.getZone('player-' + game.activePlayer).getStack('discard').cards.length).toBe(1);
		expect(z.getZone('shared:purchase').getCards().indexOf(toBuy)).not.toBe(-1);
		expect(z.getZone('player-' + game.activePlayer).getStack('discard').getCard(toBuy.id)).toBe(undefined);
	});


	it('should be declare-attackers after main', function() {
		game.start();
		game.getActivePhase().action(null, true);

		expect(game.getActivePhase().name).toBe('declare-attackers');
	});
	it('active player can declare which bots are attacking and they should be moved to the shared:battle zone', function() {
		game.start();
		var creatures = playCreatures();
		game.getActivePhase().action(null, true);

		declareAttacks(creatures);

		expect(z.getZone('shared:battle').getCards().length).toBe(2);
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(0);
	});

	it('active player can declare which bots are attacking which nodes or mainframe', function() {
		game.start();
		var creatures = playCreatures();
		game.getActivePhase().action(null, true);

		declareAttacks(creatures);
		expect(z.getZone('shared:battle').getCards()[0].target).toBe('node1');
		expect(z.getZone('shared:battle').getCards()[1].target).toBe('node2');
	});

	it('attacking bots are tapped', function() {
		game.start();
		var creatures = playCreatures();
		game.getActivePhase().action(null, true);

		declareAttacks(creatures);
		expect(z.getZone('shared:battle').getCards()[0].tapped).toBe(true);
		expect(z.getZone('shared:battle').getCards()[1].tapped).toBe(true);
	});

	// declare-defenders
	it('inactive player declares blocks and attacker and blocker are moved into a SHARED:COMBATS:COMBAT# zone in an ATTACKING & DEFENDING', function() {
		game.start();
		game.phases[4].enter = function() { game.cycleActivePhase(); }; //disable the damage phase

		var creatures = playCreatures();
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //pass attack
		game.getActivePhase().action(null, true); //pass 2nd main
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures();
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var activePlayer = game.activePlayer;
		game.getActivePhase().action(null, true); //pass main
		declareAttacks(creatures);

		expect(game.activePlayer).not.toEqual(activePlayer);
		expect(game.getActivePhase().name).toBe('declare-defenders');
		
		declareBlocks(creatures2, creatures);

		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(4);
		var totalZones = 0;
		z.getZone('shared:combats').forEach(function(zone){
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

	it('should deal damage to each bot in each combat zone equal to their opposing power', function() {
		game.start();
		var creatures = playCreatures();
		creatures[0].power = 2;
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures();
		creatures2[1].power = 2;
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //attack
		game.getActivePhase().action(null, true); //2nd main
		expect(game.turn).toBe(3);
		game.getActivePhase().action(null, true); //main
		expect(game.getActivePhase().name).toBe('declare-attackers');
		declareAttacks(creatures);
		declareBlocks(creatures2, creatures);

		expect(game.getActivePhase().name).toBe('second-main');
		expect(z.getZone('shared:player-'+(game.activePlayer ? 0 : 1)+'-inplay').getCards()[0].power).toBe(0);
		expect(z.getZone('shared:player-'+(game.activePlayer ? 0 : 1)+'-inplay').getCards()[1].power).toBe(1);
		expect(z.getZone('shared:player-'+(game.activePlayer)+'-inplay').getCards()[0].power).toBe(1);
		expect(z.getZone('shared:player-'+(game.activePlayer)+'-inplay').getCards()[1].power).toBe(0);
	});
	
	it('bots deal damage to nodes/mainframe if unblocked', function() {
		game.start();
		var creatures = playCreatures();
		game.getActivePhase().action(null, true);
		declareAttacks(creatures);
		game.getActivePhase().action(null, true);
		
		expect(game.getActivePhase().name).toBe('second-main');
		expect(game.zones.getZone('player-'+(game.activePlayer ? 0 : 1)).getStack('node1').damage).toBe(1);
		expect(game.zones.getZone('player-'+(game.activePlayer ? 0 : 1)).getStack('node2').damage).toBe(1);
	});
	// 		-
	// 		-check destroyed

	it('should move all undead units back to inplay zones after combat', function() {
		game.start();
		var creatures = playCreatures();
		game.getActivePhase().action(null, true); //pass main

		declareAttacks(creatures);
		game.getActivePhase().action(null, true); //pass blcks

		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(0);
		expect(z.getZone('shared:player-' + game.activePlayer + '-inplay').getCards().length).toBe(2);
	});
	it('should move the units back to their owners inplay', function() {
		game.start();
		var creatures = playCreatures();
		creatures[0].power = 2;
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		game.getActivePhase().action(null, true);
		expect(game.getActivePhase().name).toBe('main');
		var creatures2 = playCreatures();
		creatures2[1].power = 2;
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //attack
		game.getActivePhase().action(null, true); //2nd main
		expect(game.turn).toBe(3);
		game.getActivePhase().action(null, true); //main
		expect(game.getActivePhase().name).toBe('declare-attackers');
		declareAttacks(creatures);
		declareBlocks(creatures2, creatures);

		expect(game.getActivePhase().name).toBe('second-main');
		expect(z.getZone('shared:battle').getCards().length).toBe(0);
		expect(z.getZone('shared:combats').getCards().length).toBe(0);
		expect(z.getZone('shared:player-0-inplay').getCards().length).toBe(2);
		expect(z.getZone('shared:player-1-inplay').getCards().length).toBe(2);

	});
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
//support multi-blocks
//support assigning damage?

//fix to respect priority on phase declaration