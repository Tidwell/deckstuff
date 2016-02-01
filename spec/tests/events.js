var decache = require('decache');

describe('General structure', function() {
	var GameComponents;
	var game;
	var loggedEvents;

	beforeEach(function() {
		decache('../../');
		GameComponents = require('../../');
		game = new GameComponents.createGame();
		loggedEvents = [];
	});
});