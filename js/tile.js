define(
['lib/backbone', 'lib/lodash'],
function (Backbone, _) {

var Tile = Backbone.Model.extend({
	defaults: {
		x: 0,
		y: 0,
		type: 'wall',
		ascii: '#',
		color: '#000',
		backgroundColor: '#000',
		passable: false,
		transparent: false,
		map: null,
		zIndex: 0
	},

	move: function (x, y) {
		var oldValues = {
			x: this.get('x'),
			y: this.get('y')
		},
		newValues = {
			x: x,
			y: y
		};

		this.set({
			x: x,
			y: y
		});

		this.trigger('move', this, oldValues, newValues);
	},

	canMove: function (x, y) {
		return this.get('map').isPassable(x, y);
	},
	
	_moveN: function () {
		if(!this.canMove(this.get('x'), this.get('y') - 1)) return;
		this.move(this.get('x'), this.get('y') - 1);
	},

	_moveNE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y') - 1)) return;
		this.move(this.get('x') + 1, this.get('y') - 1);
	},

	_moveE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y'))) return;
		this.move(this.get('x') + 1, this.get('y'));
	},
	
	_moveSE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y') + 1)) return;
		this.move(this.get('x') + 1, this.get('y') + 1);
	},

	_moveS: function () {
		if(!this.canMove(this.get('x'), this.get('y') + 1)) return;
		this.move(this.get('x'), this.get('y') + 1);
	},

	_moveSW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y') + 1)) return;
		this.move(this.get('x') - 1, this.get('y') + 1);
	},
	
	_moveW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y'))) return;
		this.move(this.get('x') - 1, this.get('y'));
	},

	_moveNW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y') - 1)) return;
		this.move(this.get('x') - 1, this.get('y') - 1);
	}
});

return Tile;

});