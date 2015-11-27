define(['monster', 'lib/rot'], function (Monster, ROT) {

var Player = Monster.extend({
	defaults: {
		name  : 'Atom',
		type  : 'player',
		ascii : '@',
		zIndex: 1,
		color : '#000',
		backgroundColor: '#fff',
		passable: false,
		transparent: true
	}
});

return Player;

});