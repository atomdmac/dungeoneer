define(['lib/signals', 'lib/lodash', 'monster'], function (signals, _, Monster) {

var Enemy = Monster.extend({
	defaults: {
		type: 'enemy',
		ascii: 'E',
		color: '#ff0000',
		passable: false,
		transparent: true
	},

	_seekPath: null,

	act: function (player) {
		var coords;

		if(this.canSee(player)) {
			this._seekPath = this.lineOfSight(this, player);
			coords = this._seekPath.shift();

			if(this.canMove(coords.x, coords.y)) {
				this.move(coords.x, coords.y);
			}
		}
		else if (this._seekPath && this._seekPath.length > 0) {
			coords = this._seekPath.shift();
			this.move(coords.x, coords.y);
		}
		else {
			this.moveRandom();
		}
	},

	moveRandom: function() {
		var moved = false,
			func;
		var items = [this._moveN, this._moveS, this._moveE, this._moveW];
		while(!moved) {
			func = items[Math.floor(Math.random()*items.length)];
			moved = func.call(this);
		}
	}
});

return Enemy;

});