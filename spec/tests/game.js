var decache = require('decache');

describe('Game', function() {
	var GameComponents;
	var game;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = new GameComponents.createGame();
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
		expect(game.log.indexOf('game:addedPlayer')).not.toEqual(-1);
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
		expect(game.log.indexOf('game:addedPhase')).not.toEqual(-1);
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
		expect(game.log.indexOf('game:started')).not.toEqual(-1);
	});

	it('should set the active player randomly when start is called', function() {
		game.start();
		expect(typeof game.activePlayer).toBe('number');
		expect(game.activePlayer).not.toBeLessThan(0);
	});

	it('should end when end is called', function() {
		game.start();
		game.end();
		expect(game.ended).toBe(true);
	});

	it('should fire game:ended when start is called', function() {
		game.end();
		expect(game.log.indexOf('game:ended')).not.toEqual(-1);
	});

	it('should advance the turn when newTurn is called', function() {
		game.start();
		var turn = game.turn;
		game.newTurn();
		expect(turn+1).toEqual(game.turn);
	});
	it('should fire game:newTurn when newTurn is called', function() {
		game.newTurn();
		expect(game.log.indexOf('game:newTurn')).not.toEqual(-1);
	});
	it('should fire game:activePlayerChange when cycleActivePlayer is called', function() {
		game.cycleActivePlayer();
		expect(game.log.indexOf('game:activePlayerChange')).not.toEqual(-1);
	});

	it('cycleplayer should advance the active player and loop back', function() {
		game.addPlayer({name: 'p1'});
		game.addPlayer({name: 'p2'});
		game.addPlayer({name: 'p3'});

		game.start();
		var ap1 = game.activePlayer;
		game.cycleActivePlayer();
		expect(ap1).not.toEqual(game.activePlayer);
		var ap2 = game.activePlayer;
		game.cycleActivePlayer();
		expect(ap2).not.toEqual(game.activePlayer);
		var ap3 = game.activePlayer;
		game.cycleActivePlayer();
		
		//cycle back around
		expect(ap1).toEqual(game.activePlayer);
	});

	it('cyclephase should advance the active phase and loop back', function() {
		game.addPhase({name: 'phase1'});
		game.addPhase({name: 'phase2'});
		game.addPhase({name: 'phase3'});

		game.start();
		var ap1 = game.activePhase;
		game.cycleActivePhase();
		expect(ap1).not.toEqual(game.activePhase);
		var ap2 = game.activePhase;
		game.cycleActivePhase();
		expect(ap2).not.toEqual(game.activePhase);
		var ap3 = game.activePhase;
		game.cycleActivePhase();
		
		//cycle back around
		expect(ap1).toEqual(game.activePhase);
	});
	it('cyclephase should advance the turn if it has reached the end of all phases', function() {
		game.start();
		game.cycleActivePhase();
		expect(game.turn).toBe(2);
	});
});
