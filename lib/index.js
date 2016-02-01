var gameComponents = {
	createGame: function(data) {
		return new gameComponents.components.Game(data, gameComponents.components);
	},
	components: {
		Game: require('./components/game'),
		Player: require('./components/player'),
		Zone: require('./components/zone'),
		Stack: require('./components/stack'),
		Card: require('./components/card'),
		Phase: require('./components/phase')
	}
};

module.exports = gameComponents;