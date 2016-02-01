var decache = require('decache');

describe('Zone', function() {
	var GameComponents;
	var game;
	var zone;
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
		zone = new GameComponents.components.Zone('test-zone', game.events, {}, GameComponents.components);
	});
	
	it('exports a constructor', function() {
		expect(typeof GameComponents.components.Zone).toBe('function');
	});

	it('should set id, events, and components based on the data passed in', function() {
		expect(zone.id).toBe('test-zone');
		expect(zone.events).toBe(game.events);
		expect(zone.components).toBe(GameComponents.components);
	});

	it('should have a map of contained zones and stacks', function() {
		expect(zone.zones).toEqual({});
		expect(zone.stacks).toEqual({});
	});

	it('should fire zone:created when created', function() {
		//since constructing the game adds a zone, we dont need to manually make one
		expect(loggedEvents).toEqual(['zone:created']);
	});

	it('shold add a zone when addZone is called', function(){
		zone.addZone('test-zone');
		expect(zone.zones['test-zone']).toBeDefined();
	});

	it('shold return the new zone from addZone', function(){
		var newZone = zone.addZone('test-zone');
		expect(newZone.id).toBe('test-zone');
	});

	it('should fire zone:addedZone when added', function() {
		zone.addZone('new-zone');
		//the first zone is the game's zones created by the game
		expect(loggedEvents[loggedEvents.length-1]).toEqual('zone:addedZone');
	});

	it('should return an added zone by calling getZone', function(){
		var newZone = zone.addZone('test-zone');
		expect(zone.getZone('test-zone')).toEqual(newZone);
	});

	it('shold add a stack when addStack is called', function(){
		zone.addStack('test-stack');
		expect(zone.stacks['test-stack']).toBeDefined();
	});

	it('shold return the new stack from addStack', function(){
		var newStack = zone.addStack('test-stack');
		expect(newStack.id).toBe('test-stack');
	});

	it('should fire zone:addedStack when added', function() {
		zone.addStack('new-stack');
		//the first zone is the game's zones created by the game
		expect(loggedEvents[loggedEvents.length-1]).toEqual('zone:addedStack');
	});

	it('should return an added stack by calling getStack', function(){
		var newStack = zone.addStack('test-stack');
		expect(zone.getStack('test-stack')).toEqual(newStack);
	});

	it('should allow you to itterate over all subzones with forEach', function() {
		var subzones = ['test-zone1', 'test-zone2', 'test-zone3'];
		subzones.forEach(function(z){ zone.addZone(z); });

		zone.forEach(function(z, i){
			expect(z.id).toEqual(subzones[i]);
		});
	});
});