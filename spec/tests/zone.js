var decache = require('decache');

describe('Zone', function() {
	var GameComponents;
	var game;
	var zone;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();
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
		expect(game.log.indexOf('zone:created')).not.toEqual(-1);
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
		expect(game.log.indexOf('zone:addedZone')).not.toEqual(-1);
	});

	it('should return an added zone by calling getZone', function(){
		var newZone = zone.addZone('test-zone');
		expect(zone.getZone('test-zone')).toEqual(newZone);
	});

	it('should return a deep zone with :', function() {
		var newZone = zone.addZone('test-zone');
		var newZone2 = newZone.addZone('test-zone22');
		var newZone3 = newZone2.addZone('test-zone3');
		expect(zone.getZone('test-zone:test-zone22:test-zone3')).toEqual(newZone3);
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
		expect(game.log.indexOf('zone:addedStack')).not.toEqual(-1);
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

	it('should return all cards in all subzones/stacks when getCards is called', function() {
		var subzones = ['test-zone1', 'test-zone2', 'test-zone3'];
		subzones.forEach(function(z){ zone.addZone(z); });

		zone.forEach(function(z, i){
			var stack = z.addStack('some-stack-'+i);
			stack.add({name: 'somecard'+i});
		});
		
		expect(zone.getCards().length).toBe(3);
	});

	it('should return all cards in no matter how deep', function() {
		var subzones = ['test-zone1', 'test-zone2', 'test-zone3'];
		subzones.forEach(function(z){ zone.addZone(z); });

		var totalCards = 0;
		zone.forEach(function(z, i){
			var stack = z.addStack('some-stack-'+i);
			stack.add({name: 'somecard'+i});
			totalCards++;

			subzones.forEach(function(subsub){ z.addZone(subsub); });
			z.forEach(function(subsub,j){
				var stack = z.addStack('some-stack-'+i+j);
				stack.add({name: 'somecard'+i+j});
				totalCards++;
			});
		});
		
		expect(zone.getCards().length).toBe(totalCards);
	});

	it('should return a card from getCard', function() {
		var stack = zone.addStack('test-stack');
		var c = stack.add({name: 'test-card-1'});
		expect(zone.getCard(stack.cards[0].id)).toBe(c);
	});
	it('should return a card from any nested from getCard', function() {
		var z = zone.addZone('tst');
		var stack = z.addStack('test-stack');
		var c = stack.add({name: 'test-card-1'});
		expect(zone.getCard(stack.cards[0].id)).toBe(c);
	});
	it('should actually remove the card from any nested from getCard', function() {
		var z = zone.addZone('tst');
		var stack = z.addStack('test-stack');
		var c = stack.add({name: 'test-card-1'});
		expect(zone.getCard(stack.cards[0].id, true)).toBe(c);
		expect(zone.getCards().length).toBe(0);
	});

	it('should return null if card is not found', function() {
		expect(zone.getCard('nope')).toBe(null);
	});

		//zone should have an owner (a player or a game)
		
		//zone has an access level
		
		//default is public

		/*
			access
			------
			public - all players can see all cards in all stacks
			private - just the owner can see cards, others can count
			hidden - only can be counted
		 */

});