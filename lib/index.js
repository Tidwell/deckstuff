var Game = require('./components/game');

var game = new Game();

var eventsToLog = [
	'game:started',

	'zone:created',
	'zone:added',
	
	'stack:created',
	'stack:added',
	'stack:removed',
	'stack:shuffled',
	
	'card:created',
	'card:stackChange',
	'card:zoneChange'
];

game.events.on('*', function(item) {
	if (eventsToLog.indexOf(this.event) !== -1) {
		console.log(this.event);
	}
});



var p1Zones = game.zones.addZone('p1');
var p2Zones = game.zones.addZone('p2');
var sharedZones = game.zones.addZone('shared');

/* Create the zones */
p1Zones.addStack('hand');
p1Zones.addStack('deck');
p1Zones.addStack('discard');

p2Zones.addStack('hand');
p2Zones.addStack('deck');
p2Zones.addStack('discard');

sharedZones.addStack('p1board');
sharedZones.addStack('p2board');
sharedZones.addZone('stack').addStack('stack');

/* Add cards to each deck */
var d = [
	{name: 'card1'},
	{name: 'card2'},
	{name: 'card3'},
	{name: 'card4'},
	{name: 'card5'}
];


p1Zones.getStack('deck').add(d);
p2Zones.getStack('deck').add(d);

/* Shuffle each deck */
p1Zones.getStack('deck').shuffle();
p2Zones.getStack('deck').shuffle();

game.start();

//console.log(JSON.stringify(game, null, '\t'));
