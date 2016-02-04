module.exports = function(game) {
	function mainPhaseAction(opts, pass) {
		if (opts && opts.type === 'play') {
			//allow player to play things from their hand
			var c = game.zones.getZone('player-' + game.activePlayer + ':hand').getStack('hand').getCard(opts.id, true);
			c.resolve(game);
		}
		if (opts && opts.type === 'buy') {
			game.buy(opts.id);
		}
		if (opts && opts.type === 'mainframe') {
			//do mainframe abilities
			
		}
		if (pass) {
			game.cycleActivePhase();
		}
	}

	var startOfTurn = {
		name: 'start-of-turn',
		priority: false,
		enter: function() {
			//untap
			game.zones.getZone('shared:player-'+game.activePlayer+'-inplay').getCards().forEach(function(c){
				c.tapped = false;
			});
			game.cycleActivePhase();
		}
	};
	var main = {
		name: 'main',
		priority: 'activePlayer',
		action: mainPhaseAction
	};
	var declareAttackers = {
		name: 'declare-attackers',
		priority: 'activePlayer',
		action: function(attackers, pass) {
			if (attackers) {
				//allow player to declare attacks
				attackers.forEach(function(attacker){
					var c = game.zones.getZone('shared:player-' + game.activePlayer + '-inplay').getStack(attacker.id).getCard(attacker.id, true);
					c.target = attacker.target;
					c.tapped = true;
					game.zones.getZone('shared:battle').addStack(attacker.id).add(c);
				});
				//switch so defender can make blocks
				game.cycleActivePlayer();
				game.cycleActivePhase();
			}
			if (pass) {
				//no attackers, so no defender step will happen
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
				defenders.forEach(function(defender){
					var c = game.zones.getZone('shared:player-' + game.activePlayer + '-inplay').getStack(defender.id).getCard(defender.id, true);
					c.target = defender.target;
					var attackingBot = game.zones.getZone('shared:battle').getStack(defender.target).draw();
					var combatZone = game.zones.getZone('shared:combats');
					var combatSubZone = combatZone.addZone('combat'+Object.keys(combatZone.zones).length);
					combatSubZone.addStack('attackers').add(attackingBot);
					combatSubZone.addStack('defenders').add(c);
				});
				//switch back
				game.cycleActivePlayer();
				game.cycleActivePhase();
			}
			if (pass) {
				game.cycleActivePlayer();
				game.cycleActivePhase();
			}
		},
		enter: function(activePlayer) {
			//check to make sure there are attackers
			if (!game.zones.getZone('shared:battle').getCards().length) {
				return game.cycleActivePhase();
			}
			game.events.emit('phase:entered', this);
		}
	};
	var resolveDamage = {
		name: 'resolve-damage',
		priority: false,
		action: function() {
			game.resolveCombatDamage();

			game.resolveInplayDeaths();

			if (!game.ended) { game.cycleActivePhase(); }
		},
		enter: function() {
			//check to make sure there are combats to resolve
			var battleZone = game.zones.getZone('shared:battle');
			var combatsZone = game.zones.getZone('shared:combats');
			if (!battleZone.getCards().length && !combatsZone.getCards().length) {
				return game.cycleActivePhase();
			}
			game.events.emit('phase:entered', this);
			this.action();
		}
	};
	var secondMain = {
		name: 'second-main',
		priority: 'activePlayer',
		action: mainPhaseAction,
		enter: function() {
		
		}
	};
	var endOfTurn = {
		name: 'end-of-turn',
		priority: false,
		action: function() {
			//Replace any bought cards
			game.zones.getZone('shared:to-buy').forEachStack(function(stack){
				if (stack.cards.length === 0) {
					stack.add(game.zones.getZone('shared:purchase').getStack('packs').draw());
				}
			});
			game.cycleActivePhase();
		}
	};
	var draw = {
		name: 'draw',
		priority: false,
		action: function() {
			//make the active player draw to 4
			var hand = game.zones.getZone('player-'+game.activePlayer+':hand').getStack('hand');
			while (hand.cards.length < 4) {
				var canDraw = game.activeDraw();
				if (!canDraw) { break; }
			}
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