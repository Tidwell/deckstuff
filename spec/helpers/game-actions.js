beforeEach(function() {
	createCreatureCard = {
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
	players = [{
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

	playCreatures = function playCreatures(game, z) {
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
		return creatures;
	};

	declareAttacks = function declareAttacks(game, z, creatures) {
		game.getActivePhase().action([{
			id: creatures[0].id,
			target: 'node1'
		}, {
			id: creatures[1].id,
			target: 'node2'
		}]);
	};

	declareBlocks = function declareBlocks(game, z, creatures, targets) {
		game.getActivePhase().action([{
			id: creatures[0].id,
			target: targets[0].id
		}, {
			id: creatures[1].id,
			target: targets[1].id
		}]);
	};

	playHand = function(game,z) {
		var handId = 'player-' + game.activePlayer + ':hand';
		var hand = z.getZone(handId).getStack('hand');
		var toDo = [];
		hand.cards.forEach(function(card) {
			toDo.push(function() {
				game.getActivePhase().action({
					type: 'play',
					id: card.id
				});
			});
		});
		toDo.forEach(function(func) {
			func();
		});
	}
});