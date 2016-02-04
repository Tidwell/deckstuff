var decache = require('decache');

describe('Stack', function() {
	var GameComponents;
	var game;
	var stack;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = GameComponents.createGame();
		stack = game.zones.addStack('test-stack');
	});
	
	it('exports a constructor', function() {
		expect(typeof GameComponents.components.Stack).toBe('function');
	});

	it('should set id, events, and components based on the data passed in', function() {
		expect(stack.id).toBe('test-stack');
		expect(stack.events).toBe(game.events);
		expect(stack.components).toBe(GameComponents.components);
	});

	it('should have an array of cards', function() {
		expect(stack.cards).toEqual([]);
	});
	it('should have it\'s parent zone id', function() {
		expect(stack.zoneId).toBe('zones');
	});

	it('should fire stack:created when instantiated', function() {
		expect(game.log.indexOf('stack:created')).not.toEqual(-1);
	});

	it('should add a card when add() is called', function() {
		stack.add({name: 'test-card-1'});
		stack.add({name: 'test-card-2'});
		expect(stack.cards.length).toBe(2);
	});

	it('should add multiple cards when add() is called with an array', function() {
		stack.add([{name: 'test-card-1'}, {name: 'test-card-2'}]);
		expect(stack.cards.length).toBe(2);
	});

	it('should work when add() is called with an array of one item', function() {
		stack.add([{name: 'test-card-1'}]);
		expect(stack.cards.length).toBe(1);
	});

	it('should accept the bottom position to be add() to and draw() from', function() {
		stack.add({name: 'test-card-1'});
		stack.add({name: 'test-card-2'});
		stack.add({name: 'test-card-3'}, 'bottom');
		expect(stack.draw('bottom').name).toBe('test-card-3');
	});
	it('should accept the top position to be add() to and draw() from', function() {
		stack.add({name: 'test-card-1'});
		stack.add({name: 'test-card-2'});
		stack.add({name: 'test-card-3'}, 'top');
		expect(stack.draw('top').name).toBe('test-card-3');
	});
	it('should accept a random position to be add() to', function() {
		stack.add({name: 'test-card-1'});
		stack.add({name: 'test-card-2'});
		stack.add({name: 'test-card-3'}, 'random');
		expect(stack.cards.length).toBe(3);
	});

	it('should fire stack:addedCard when add is called', function() {
		stack.add({name: 'test-card-1'});
		expect(game.log.indexOf('stack:addedCard')).not.toEqual(-1);
	});

	it('should draw a card when draw() is called', function() {
		stack.add({name: 'test-card-1'});
		var c = stack.draw();
		expect(stack.cards.length).toBe(0);
	});

	it('should fire stack:removedCard when draw is called', function() {
		stack.add({name: 'test-card-1'});
		stack.draw();
		expect(game.log.indexOf('stack:removedCard')).not.toEqual(-1);
	});

	it('should shuffle the stack when shuffle() is called', function() {
		var names = [1,2,3,4,5,6];
		names.forEach(function(n){ stack.add({name: n}); });

		var order = names.join('');

		var stackOrder = '';
		stack.cards.forEach(function(c){ stackOrder += c.name; });
		expect(stackOrder).toEqual(order);

		stack.shuffle();
		stackOrder = '';
		stack.cards.forEach(function(c){ stackOrder += c.name; });
		expect(stackOrder).not.toEqual(order);
	});

	it('should fire stack:shuffledCards when shuffle is called', function() {
		stack.shuffle();
		expect(game.log.indexOf('stack:shuffledCards')).not.toEqual(-1);
	});

	it('should return a card with an id via getCard', function() {
		var c = stack.add({name: 'test-card-1'});
		expect(stack.getCard(stack.cards[0].id)).toBe(c);
	});
	it('should remove the card from the stack when getCard pulls it', function() {
		var c = stack.add({name: 'test-card-1'});
		var c2 = stack.getCard(stack.cards[0].id, true);
		expect(stack.cards.length).toBe(0);
	});
	it('should return the card from the stack when getCard pulls it', function() {
		var c = stack.add({name: 'test-card-1'});
		var c2 = stack.getCard(stack.cards[0].id, true);
		expect(c2).toBe(c);
	});
});