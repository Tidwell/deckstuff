var card = {
	name: 'BASIC-GAIN-1',
	resolve: function(game) {
		//adds itself to the currency stack
		game.zones.getZone('player-' + game.activePlayer).getStack('currency').add(this);
	}
};
var deck = [];
var i = 0;
while (i < 8) {
	deck.push(card);
	i++;
}

/*
access is:
	public - all players can see all cards in all stacks
	private - just the owner can see cards, others can count
	hidden - only can be counted
 */

function addZones(game, players) {
	var sharedZones = game.zones.addZone('shared', {
		access: 'public',
		owner: 'game'
	});
	sharedZones.addZone('battle', {
		access: 'public',
		owner: 'game'
	});
	sharedZones.addZone('combats', {
		access: 'public',
		owner: 'game'
	});
	sharedZones.addZone('purchase', {
		access: 'hidden',
		owner: 'game'
	});
	sharedZones.getZone('purchase').addStack('packs');
	
	var toBuyZone = sharedZones.addZone('to-buy', {
		access: 'public',
		owner: 'game'
	});
	toBuyZone.addStack('buy1');
	toBuyZone.addStack('buy2');
	toBuyZone.addStack('buy3');

	players.forEach(function(p, i) {
		game.addPlayer(p);
		var playerZones = game.zones.addZone('player-' + i, {
			access: 'public',
			owner: p
		});

		playerHandZone = playerZones.addZone('hand', {
			access: 'private',
			owner: p
		});
		playerHandZone.addStack('hand');
		playerDeckZone = playerZones.addZone('deck', {
			access: 'hidden',
			owner: p
		});
		playerDeckZone.addStack('deck');

		playerZones.addStack('discard');
		playerZones.addStack('currency');
		playerZones.addStack('mainframe');
		playerZones.addStack('node1');
		playerZones.addStack('node2');


		sharedZones.addZone('player-' + i + '-inplay', {
			access: 'public',
			owner: p
		});

		//construct the players deck
		playerDeckZone.getStack('deck').add(deck);

		sharedZones.getZone('purchase').getStack('packs').add(p.pack);
	});
}

module.exports = function(game, players) {
	addZones(game, players);
};