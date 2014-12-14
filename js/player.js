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
		var _onKeyPress = _.bind(function (event) {
			switch(event.keyCode) {
				case ROT.VK_K:
					this._moveN();
					break;
				case ROT.VK_U:
					this._moveNE();
					break;
				case ROT.VK_L:
					this._moveE();
					break;
				case ROT.VK_N:
					this._moveSE();
					break;
				case ROT.VK_J:
					this._moveS();
					break;
				case ROT.VK_B:
					this._moveSW();
					break;
				case ROT.VK_H:
					this._moveW();
					break;
				case ROT.VK_Y:
					this._moveNW();
					break;
			}
		}, this);
		document.addEventListener('keypress', _onKeyPress);

		_.bindAll(this);

		this.on('move', this._onMove);
	},

	_onMove: function () {
		var visibleCells = this.get('map').getVisibleAt(this.get('x'), this.get('y'));
		visibleCells.forEach(function (cell) {
			cell.setVisibility(true);
		});
	}
});


return Player;

});