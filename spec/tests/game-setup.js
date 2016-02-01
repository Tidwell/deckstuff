var GameComponents = require('../../');

var game = new GameComponents.createGame();

var card = {
	name: 'BASIC-GAIN-1'
};
var deck = [];
var i = 0;
while (i < 8) {
	deck.push(card);
	i++;
}

var players = [{
	name: 'p1'
}, {
	name: 'p2'
}];


var sharedZones = game.zones.addZone('shared');
var playZone = sharedZones.addZone('play');
var stackZone = sharedZones.addZone('stack');

stackZone.addStack('stack');

players.forEach(function(p, i) {
	game.addPlayer(p);
	var playerZones = game.zones.addZone('player' + i + '-zones');
	playerZones.addStack('hand');
	playerZones.addStack('deck');
	playerZones.addStack('discard');
	playerZones.addStack('currency');
	playerZones.addStack('player' + i + '-stack');
	playZone.addStack('player' + i + '-inplay');
	playZone.addStack('player' + i + '-building1');
	playZone.addStack('player' + i + '-building2');
});