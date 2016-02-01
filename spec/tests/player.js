var decache = require('decache');

describe('Player', function() {
	var GameComponents;
	var game;
	var player;
	var loggedEvents;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();
		
		loggedEvents = [];
		
		//track events
		game.events.on('*', function(data) {
			loggedEvents.push(this.event);
		});

		player = new GameComponents.components.Player(game.events, {name: 'a'});
		
	});

	it('should set events and name based on the data passed in', function() {
		expect(player.events).toBe(game.events);
		expect(player.name).toBe('a');
	});

	it('should fire player:created when created', function() {
		expect(loggedEvents).toEqual(['player:created']);
	});
});