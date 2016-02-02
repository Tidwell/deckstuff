var GameComponents = require('../');

var phases = require('./phases');
var zonesStacks = require('./zones-stacks');


function onStart() {
	//Flip the top 3 cards of the PURCHASE to stacks BUY1 BUY2 and BUY3
	c1 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy1').add(c1);
	c2 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy2').add(c2);
	c3 = this.zones.getZone('shared:purchase').getStack('packs').draw();
	this.zones.getZone('shared:to-buy').getStack('buy3').add(c3);

	//Each player draws 4 cards
	var toDraw = 4;
	
	var self = this;
	this.players.forEach(function(p,pIndex){
		var i = 0;
		while (i < 4) {
			var card = self.zones.getZone('player-'+pIndex+':deck').getStack('deck').draw();
			self.zones.getZone('player-'+pIndex+':hand').getStack('hand').add(card);
			i++;
		}
	});
}

module.exports = {
	createGame: function(players) {
		var game = new GameComponents.createGame({
			onStart: onStart
		});
		phases(game);
		zonesStacks(game, players);
		return game;
	}
};