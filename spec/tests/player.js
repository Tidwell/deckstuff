var decache = require('decache');

describe('Player', function() {
	var GameComponents;
	var game;
	var player;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();

		player = new GameComponents.components.Player(game.events, {name: 'a'});
		
	});

	it('should set events and name based on the data passed in', function() {
		expect(player.events).toBe(game.events);
		expect(player.name).toBe('a');
	});

	it('should fire player:created when created', function() {
		expect(game.log.indexOf('player:created')).not.toEqual(-1);
	});
});