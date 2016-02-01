var decache = require('decache');

describe('General structure', function() {
	var GameComponents;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
	});
	
	it('exports a createGame method and components', function() {
		expect(GameComponents.createGame).toBeDefined();
		expect(GameComponents.components).toBeDefined();
	});

	it('can modify the components and have them used', function() {
		GameComponents.components.Game.prototype.someMethod = function() {};
		var game = new GameComponents.createGame();
		expect(game.someMethod).toBeDefined();
	});
});