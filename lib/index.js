var Game = require('./components/game');

module.exports = {
	createGame: function(data) {
		return new Game(data);
	},
	components: {
		Game: Game,
		Zone: require('./components/zone'),
		Stack: require('./components/stack'),
		Card: require('./components/card')
	}
};