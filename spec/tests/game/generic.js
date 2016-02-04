var Game = require('../../../game');
var game;
var z;

describe('generic rules', function() {
	beforeEach(function() {
		game = Game.createGame(players);
		z = game.zones;
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

	function setTarget(creature){
		creature.target = 'mainframe';
	}
	it('A player loses if their mainframe is reduced to 0 health', function() {
		game.start();
		var creatures;
		while (!game.ended) {
			expect(game.getActivePhase().name).toBe('main');
			creatures = playCreatures(game, z); //main
			game.getActivePhase().action(null, true);
			expect(game.getActivePhase().name).toBe('declare-attackers');
			creatures.forEach(setTarget);
			game.getActivePhase().action(creatures);
			expect(game.getActivePhase().name).toBe('declare-defenders');
			game.getActivePhase().action(null,true); //pass block
			if (!game.ended) {
				expect(game.getActivePhase().name).toBe('second-main');
				game.getActivePhase().action(null, true); //second main
			}
		}
		expect(game.ended).toBe(true);
		game.players.forEach(function(p,i){
			if (p.loss) { expect(game.zones.getZone('player-'+i).getStack('mainframe').damage).toBe(20);}
			else { expect(game.zones.getZone('player-'+i).getStack('mainframe').damage).toBe(12);}
		});
		var fs = require('fs');
		fs.writeFileSync('./dump.json', game.serialize());

	});

	it('if a player would draw and it is empty, their discard is shuffled to form a new deck', function() {
		game.start();
		var hand = z.getZone('player-'+game.activePlayer+':hand').getStack('hand');
		hand.cards = [];
		z.getZone('player-'+game.activePlayer+':deck').getStack('deck').cards = [];
		z.getZone('player-'+game.activePlayer).getStack('discard').add({name:'test'});

		expect(hand.cards.length).toBe(0);
		game.activeDraw();
		expect(hand.cards.length).toBe(1);
		expect(hand.cards[0].name).toBe('test');
	});

	it('if a player would draw a card from their deck and there are no cards in discard, shouldnt break', function() {
		game.start();
		playHand(game,z);
		expect(z.getZone('player-'+game.activePlayer+':deck').getCards().length).toBe(4);
		expect(z.getZone('player-'+game.activePlayer+':hand').getCards().length).toBe(0);
		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(4);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main

		expect(game.turn).toBe(2);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main
		
		expect(game.turn).toBe(3);
		expect(z.getZone('player-'+game.activePlayer+':hand').getCards().length).toBe(4);
		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(4);
		playHand(game,z);
		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(8);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main
		
		expect(game.turn).toBe(4);
		game.getActivePhase().action(null, true); //pass main
		game.getActivePhase().action(null, true); //combat
		game.getActivePhase().action(null, true); //second main
		
		expect(game.turn).toBe(5);
		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(8);
		expect(z.getZone('player-'+game.activePlayer+':hand').getCards().length).toBe(0);
		expect(z.getZone('player-'+game.activePlayer+':deck').getCards().length).toBe(0);
		expect(z.getZone('player-'+game.activePlayer).getStack('currency').cards.length).toBe(8);
	});

	it('cards in the to-buy stacks have a MAXBUYS # and when bought reduced by one.  hits zero, removed from buys', function() {

	});
});

//test multi-blocks
//fix to respect priority on phase declaration
//tapped cant attack or block
//summoning sickness

//error detection on all action() entrypoints

//support assigning damage?
// Node is destroyed if reduced to 0 health?
// Mainframe cannot be attacked until Nodes are destroyed?