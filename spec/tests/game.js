var decache = require('decache');

describe('Game', function() {
	var GameComponents;
	var game;
	var loggedEvents;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = new GameComponents.createGame();
		loggedEvents = [];
		
		//track events
		game.events.on('*', function(data) {
			loggedEvents.push(this.event);
		});
	});
	
	it('should have a started and ended boolean that both start false', function() {
		expect(game.started).toBe(false);
		expect(game.ended).toBe(false);
	});

	it('should have an array of phases', function() {
		expect(game.phases).toEqual([]);
	});

	it('should have an event emitter', function() {
		expect(game.events).toBeDefined();
	});

	it('should have an array of players', function() {
		expect(game.players).toEqual([]);
	});

	it('should have a zone called "zones"', function() {
		expect(game.zones instanceof GameComponents.components.Zone).toBeTruthy();
	});

	it('should have an addPlayer method that creates and adds the player', function() {
		expect(typeof game.addPlayer).toBe('function');

		game.addPlayer({name: 'play1'});
		expect(game.players[0].name).toBe('play1');
	});
	it('should fire game:addedPlayer when addPlayer is called', function() {
		game.addPlayer({name: 'play1'});
		expect(loggedEvents[loggedEvents.length-1]).toEqual('game:addedPlayer');
	});

	it('should add players sequentially', function() {
		game.addPlayer({name: 'play1'});
		game.addPlayer({name: 'play2'});
		expect(game.players[1].name).toBe('play2');
	});

	it('should have an addPhase method that creates and adds the phase', function() {
		expect(typeof game.addPhase).toBe('function');

		game.addPhase({name: 'phase1'});
		expect(game.phases[0].name).toBe('phase1');
	});

	it('should fire game:addedPhase when addPhase is called', function() {
		game.addPhase({name: 'phase1'});
		expect(loggedEvents[loggedEvents.length-1]).toEqual('game:addedPhase');
	});

	it('should add phases sequentially', function() {
		game.addPhase({name: 'phase1'});
		game.addPhase({name: 'phase2'});
		expect(game.phases[1].name).toBe('phase2');
	});

	it('should start when start is called', function() {
		game.start();
		expect(game.started).toBe(true);
	});

	it('should fire game:started when start is called', function() {
		game.start();
		expect(loggedEvents).toEqual(['game:started']);
	});

	it('should end when end is called', function() {
		game.start();
		game.end();
		expect(game.ended).toBe(true);
	});

	it('should fire game:ended when start is called', function() {
		game.end();
		expect(loggedEvents).toEqual(['game:ended']);
	});
});
