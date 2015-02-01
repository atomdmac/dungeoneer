define(['tile', 'lib/rot'], function (Tile, ROT) {

var Player = Tile.extend({
	defaults: {
		name  : 'Atom',
		type  : 'player',
		ascii : '@',
		zIndex: 1,
		color : '#000',
		backgroundColor: '#fff'
	},

	initialize: function () {
		_.bindAll(this);
		this.on('move', this._onMove);
	},

	_onMove: function () {
		var visibleCells = this.get('map').getVisibleAt(this.get('x'), this.get('y'));
		visibleCells.forEach(function (cell) {
			try {
				cell.setVisibility(true);
			} catch (e) {
				debugger;
			}
		});
	}
});


return Player;

});