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
		if(!this.canMove(this.get('x'), this.get('y') - 1)) return false;
		this.move(this.get('x'), this.get('y') - 1);
		return true;
	},

	_moveNE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y') - 1)) return false;
		this.move(this.get('x') + 1, this.get('y') - 1);
		return true;
	},

	_moveE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y'))) return false;
		this.move(this.get('x') + 1, this.get('y'));
		return true;
	},
	
	_moveSE: function () {
		if(!this.canMove(this.get('x') + 1, this.get('y') + 1)) return false;
		this.move(this.get('x') + 1, this.get('y') + 1);
		return true;
	},

	_moveS: function () {
		if(!this.canMove(this.get('x'), this.get('y') + 1)) return false;
		this.move(this.get('x'), this.get('y') + 1);
		return true;
	},

	_moveSW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y') + 1)) return false;
		this.move(this.get('x') - 1, this.get('y') + 1);
		return true;
	},
	
	_moveW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y'))) return false;
		this.move(this.get('x') - 1, this.get('y'));
		return true;
	},

	_moveNW: function () {
		if(!this.canMove(this.get('x') - 1, this.get('y') - 1)) return false;
		this.move(this.get('x') - 1, this.get('y') - 1);
		return true;
	},

	lineOfSight: function (startCoordinates, endCoordinates, options) {
		options = options || {
			collision: false
		};

		var coordinatesArray = [];
		var currentCell;
		// Translate coordinates
		var x1 = startCoordinates.get('x');
		var y1 = startCoordinates.get('y');
		var x2 = endCoordinates.get('x');
		var y2 = endCoordinates.get('y');
		// Define differences and error check
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);
		var sx = (x1 < x2) ? 1 : -1;
		var sy = (y1 < y2) ? 1 : -1;
		var err = dx - dy;
		// Set first coordinates
		coordinatesArray.push({y:y1, x:x1});
		// Main loop
		while (!((x1 == x2) && (y1 == y2))) {
			var e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				x1 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y1 += sy;
			}
			// Set coordinates
			if(options.collision && this.get('map')) {
				currentCell = this.get('map').get(x1, y1);
				if(currentCell.isTransparent()) {
					coordinatesArray.push({y: y1, x: x1});
				} else {
					return [];
				}
			} else {
				coordinatesArray.push({y: y1, x: x1});
			}
		}

		// TODO: Is this the best place to modify the coords array?
		coordinatesArray.shift();

		// Return the result
		return coordinatesArray;
	},

	canSee: function (endCoordinates) {
		return (
			this.lineOfSight(
				this, 
				endCoordinates, 
				{collision: true}
			).length > 0);
	}
});

return Tile;

});