var decache = require('decache');

describe('Card', function() {
	var GameComponents;
	var game;
	var card;
	var loggedEvents;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();
		game.zones.addStack('test-stack');
		loggedEvents = [];
		
		//track events
		game.events.on('*', function(data) {
			loggedEvents.push(this.event);
		});
		card = game.zones.getStack('test-stack').add({name: 'test-card'});
	});

	it('should set events based on the data passed in', function() {
		expect(card.events).toBe(game.events);
	});

	it('should have a generated uuid', function() {
		expect(card.id).toBeDefined();
	});
	it('should have the zone and stack id', function() {
		expect(card.zone).toBe('zones');
	});
	it('should have the zone and stack id', function() {
		expect(card.stack).toBe('test-stack');
	});

	it('should fire card:created when instantiated', function() {
		expect(loggedEvents[0]).toEqual('card:created');
	});

	it('should update its location properties when updateLocation() is called', function() {
		card.updateLocation('newzone', 'newstack');
		expect(card.zone).toBe('newzone');
		expect(card.previousZone).toBe('zones');
		expect(card.stack).toBe('newstack');
		expect(card.previousStack).toBe('test-stack');
	});

	it('should fire card:stackChanged when moving', function() {
		card.updateLocation('newzone', 'newstack');
		expect(loggedEvents[loggedEvents.length-1]).toEqual('card:stackChange');
	});
	it('should fire card:zoneChanged when moving', function() {
		card.updateLocation('newzone', 'newstack');
		expect(loggedEvents[1]).toEqual('card:zoneChange');
	});
});