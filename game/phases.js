module.exports = function(game) {
	var startOfTurn = {
		name: 'start-of-turn',
		priority: false,
		action: function() {
			//placeholder phase
			game.cycleActivePhase();
		}
	};
	var main = {
		name: 'main',
		priority: 'activePlayer',
		action: function(opts, pass) {
			if (opts && opts.type === 'play') {
				//allow player to play things from their hand
				var c = game.zones.getZone('player-' + game.activePlayer + ':hand').getStack('hand').getCard(opts.id, true);
				c.resolve(game);
			}
			if (opts && opts.type === 'buy') {
				var toBuy;
				var cards = game.zones.getZone('shared:to-buy').getCards();
				cards.forEach(function(c){
					if (c.id === opts.id) {
						toBuy = c;
					}
				});
				var card = game.zones.getZone('shared:to-buy').getStack(toBuy.stack).getCard(toBuy.id, true);
				game.zones.getZone('player-' + game.activePlayer).getStack('discard').add(card);
			}
			if (pass) {
				game.cycleActivePhase();
			}
		}
	};
	var declareAttackers = {
		name: 'declare-attackers',
		priority: 'activePlayer',
		action: function(attackers, pass) {
			if (attackers) {
				//allow player to declare attacks
			}
			if (pass) {
				game.cycleActivePhase();
			}
		}
	};
	var declareDefenders = {
		name: 'declare-defenders',
		priority: 'inactivePlayer',
		action: function(defenders, pass) {
			if (defenders) {
				//allow player to declare blocks
			}
			if (pass) {
				game.cycleActivePhase();
			}
		},
		enter: function(activePlayer) {
			if (!game.zones.getZone('shared').getZone('battle').getCards().length) {
				return game.cycleActivePhase();
			}
			game.events.emit('phase:entered', this);
		}
	};
	var resolveDamage = {
		name: 'resolve-damage',
		priority: false,
		action: function() {
			//resolve damage
			game.cycleActivePhase();
		},
		enter: function() {
			if (!game.zones.getZone('shared').getZone('battle').getCards().length) {
				return game.cycleActivePhase();
			}
			game.events.emit('phase:entered', this);
		}
	};
	var secondMain = {
		name: 'second-main',
		priority: 'activePlayer',
		action: function(card, pass) {
			if (card) {
				//allow player to play things
			}
			if (pass) {
				game.cycleActivePhase();
			}
		}
	};
	var endOfTurn = {
		name: 'end-of-turn',
		priority: false,
		action: function() {
			//placeholder phase
			game.cycleActivePhase();
		}
	};
	var draw = {
		name: 'draw',
		priority: false,
		action: function() {
			//make the active player draw to 4

			game.cycleActivePhase();
		}
	};
	game.addPhase(startOfTurn);
	game.addPhase(main);
	game.addPhase(declareAttackers);
	game.addPhase(declareDefenders);
	game.addPhase(resolveDamage);
	game.addPhase(secondMain);
	game.addPhase(endOfTurn);
	game.addPhase(draw);
};