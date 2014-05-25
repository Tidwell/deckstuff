var GameComponents = require('../');

var game = new GameComponents.createGame();

var eventsToLog = [
	'game:started',
	'game:ended',
	'game:addedPlayer',
	'game:addedPhase',

	'phase:created',

	'player:created',

	'zone:created',
	'zone:addedZone',
	'zone:addedStack',
	
	'stack:created',
	'stack:addedCard',
	'stack:removedCard',
	'stack:shuffledCards',
	
	'card:created',
	'card:stackChange',
	'card:zoneChange'
];

game.events.on('*', function(item) {
	if (eventsToLog.indexOf(this.event) !== -1) {
		console.log(this.event);
	}
});

var p1 = game.addPlayer({name: 'p1'});
game.addPlayer({name: 'p2'});

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

var playZone = sharedZones.addZone('play');
playZone.addStack('p1');
playZone.addStack('p2');

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


/*have the player draw a card*/
function draw() {
	p1Zones.getStack('hand').add(p1Zones.getStack('deck').draw());
}

/*have them play that card to the top of the stack, (make it FILO) */
function play() {
	sharedZones.getZone('stack').getStack('stack').add(p1Zones.getStack('hand').draw(), 'top');
}

/**/
function resolve() {
	if (sharedZones.getZone('stack').getStack('stack').cards.length) {
		playZone.getStack('p1').add(sharedZones.getZone('stack').getStack('stack').draw());
		resolve();
	}
}

draw();
draw();
play();
play();
resolve();

game.start();
game.end();
console.log(p1)
//console.log(JSON.stringify(game, null, '\t'));
