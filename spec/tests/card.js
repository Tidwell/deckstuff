var decache = require('decache');

describe('Card', function() {
	var GameComponents;
	var game;
	var card;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();
		game.zones.addStack('test-stack');

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
		expect(game.log.indexOf('card:created')).not.toEqual(-1);
	});

	it('should update its location properties when updateLocation() is called', function() {
		card.updateLocation('newzone', 'newstack');
		expect(card.zone).toBe('newzone');
		expect(card.previousZone).toBe('zones');
		expect(card.stack).toBe('newstack');
		expect(card.previousStack).toBe('test-stack');
	});

	it('should fire card:stackChange when moving', function() {
		card.updateLocation('newzone', 'newstack');
		expect(game.log.indexOf('card:stackChange')).not.toEqual(-1);
	});
	it('should fire card:zoneChange when moving', function() {
		card.updateLocation('newzone', 'newstack');
		expect(game.log.indexOf('card:zoneChange')).not.toEqual(-1);
	});
});