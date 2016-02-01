var decache = require('decache');

describe('Phase', function() {
	var GameComponents;
	var game;
	var phase;
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

		phase = game.addPhase({name: 'testphase'});
	});

	it('should set events and name based on the data passed in', function() {
		expect(phase.events).toBe(game.events);
		expect(phase.name).toBe('testphase');
	});

	it('should fire phase:created when instantiated', function() {
		expect(loggedEvents[0]).toEqual('phase:created');
	});


	it('should fire phase:created when created', function() {
		expect(loggedEvents[loggedEvents.length-1]).toEqual('game:addedPhase');
	});
});