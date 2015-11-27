define(
['lib/rot', 'lib/signals', 'lib/backbone', 'lib/lodash', 'cell', 'tile', 'lib/math-utils'], 
function (ROT, signals, Backbone, _, Cell, Tile, MathUtils) {

return function (options) {

	var _defaults = {
			width : 80,
			height: 40
		}, self = this;
	_.extend(this, _defaults, options);

	_.extend(this, Backbone.Events);

	this.signals = {
		// When a cell needs to be redrawn due to change of contents (entity 
		// leaves/enters, light change etc.)
		invalidated: new signals.Signal(),

		// When an entity moves from one cell to another.
		move: new signals.Signal(),

		// When an entity is added to the map.
		added: new signals.Signal(),

		// When an entity is removed from the map.
		removed: new signals.Signal()
	};

	this.cells = (function () {
		var x = 0, y = 0, cells = [];
		for(; x<self.width; x++) {
			cells[x] = [];
			y = 0;
			for(; y<self.height; y++) {
				cells[x][y] = [];
			}
		}
		return cells;
	})();

	this.passableCells = [];

	this.generate = function () {
		var options = {
			roomWidth: [9, 20],
			roomHeight: [9, 16],
			timeLimit: 2000
		};
		var self = this,
			generator = new ROT.Map.Digger(this.width, this.height),
			cell, terrain;


		generator.create(function (x, y, type) {
			cell = new Cell();

			cell.on('add'   , self._onAddToCell     );
			cell.on('remove', self._onRemoveFromCell);
			cell.on('change', self._onTileChange    );

			if (type) {
				terrain = new Tile({
					x          : x,
					y          : y,
					type       : 'wall', 
					ascii      : '#',
					passable   : false, 
					transparent: false,
					seen       : false
				});
			} else {
				terrain = new Tile({
					x          : x,
					y          : y,
					type       : 'floor',
					ascii      : ' ',
					passable   : true,
					transparent: true,
					backgroundColor: '#333',
					seen       : false
				});
				self.passableCells.push(terrain);
			}

			self.cells[x][y] = cell;
			self.add(terrain);
		});
	};

	this.getVisibleAt = function (x, y, callback) {
		/* input callback */
		var self = this,
			visibleCells = [];

		function lightPasses (x, y) {
		    var cell = self.get(x, y);
		    try {
		    	return cell ? cell.isTransparent() : false;
			} catch (e) {
				debugger;
			}
		}

		var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

		/* output callback */
		fov.compute(x, y, 10, function(x, y, r, visibility) {
		    if(visibility) {
		    	var cell = self.get(x, y);
		    	if(cell) {
			    	visibleCells.push(cell);
					if(typeof callback === 'function') callback(x, y, r, cell);
		    	}
		    }
		});

		return visibleCells;
	};

	this.getRandomPassable = function () {
		return this.passableCells[ROT.RNG.getUniformInt(0, this.passableCells.length)];
	};

	/**
	 * Return an Array containing the contents of the given cell.
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Object}
	 */
	this.get = function (x, y) {
		if(x < 0 || x > this.cells.length) return false;
		if(y < 0 || y > this.cells[0].length) return false;
		try {
			return this.cells[x][y];
		} catch (e) {
			return false;
		}
	};

	this.isTransparent = function (x, y) {
		var cell = this.get(x, y);
		if(cell) return cell.isTransparent();
		return false;
	};

	this.isPassable = function (x, y) {
		var cell = this.get(x, y);
		if(cell) return cell.isPassable();
		return false;
	};

	this.getMonstersAt = function (x, y) {
		var cell = this.get(x, y);
		if(cell) return cell.getMonsters();
		return false;
	};

	/**
	 * Return all entities in cells visible from the given point.
	 * @param x {Number}
	 * @param y {Number}
	 * @return {Array} 
	 */
	this.getVisible = function (x, y) {
		var cell = this.get(x, y);
		if(cell) return cell.getVisible(x, y);
		return false;
	};

	this.getAdjacent = function (x, y) {
		// TODO
	};

	/**
	 * Get the tile in the given direction.  If the 'direction' parameter is not
	 * given, the adjacent tile in the given direction will be returned.
	 * @param direction {String} A string value of N, NE, E, SE, S, SW, W, NW.
	 * @param distance  {Number} The distance from the given position.
	 * @return Cell;
	 */
	this.getDirection = function (x, y, direction, distance) {
		// TODO: implement distance in getDirection.
		switch(direction) {
			case 'N':
				return this.get(x, y-1);
			case 'E':
				return this.get(x+1, y);
			case 'S':
				return this.get(x, y+1);
			case 'W':
				return this.get(x-1, y);
			default:
				return false;
		}
	};

	this.move = function (tile, x, y) {
		var oldCell = this.get(tile.get('x'), tile.get('y'));
		oldCell.remove(tile);

		var newCell = this.get(x, y);
		newCell.add(tile);
	};

	/**
	 * Add the given entity to the map.  The entity's location will be 
	 * determined by it's x/y properties.
	 * @param {Object} entity
	 * @return {Void}
	 */
	this.add = function (tile) {
		try{

		if(this.cells[tile.get('x')][tile.get('y')]) {

			if(_.size(tile.attributes) === 0) console.log (tile);

			// Add to spacial map.
			this.cells[tile.get('x')][tile.get('y')].add(tile);

			// Allow the tile to query this map.
			tile.set({map: this});

			tile.on('move', this._onTileMove);

			// Listen for events.
			// tile.signals.move.add(this._onMove);
		}

	} catch (e) {
		debugger;
	}

	};

	/**
	 * Remove the given entity from the map.
	 * @param {Object} entity
	 */
	this.remove = function (entity) {
		var cells = this.get(entity.position.x, entity.position.y);
		if(cells) {
			_.remove(cells, function (item) {
				if(item === entity) return true;
				return false;
			});
		}
	};

	// Does this make sense?  If you move the entity, it can just 
	/*
	this.moveEntity = function (entity, oldPosition, newPosition) {
		// TODO: Make sure move is legal.
		var cells = this.get(entity.x, entity.y),
			self  = this;

		// Remove entity from current position.
		_.remove(cells, function (item) {
			if(item === entity) {
				entity.move()
				return true;
			}
			return false;
		});

		entity.move(newPosition);

		// Add entity to new position.
		this.cells[newPosition.x][newPosition.y].push(entity);
	};
	*/

	// Called when an entity is moved.
	this._onTileMove = _.bind(function (tile, oldValues, newValues) {
		var oldCell = this.get(oldValues.x, oldValues.y);
		oldCell.remove(tile);

		var newCell = this.get(newValues.x, newValues.y);
		newCell.add(tile);
	}, this);

	this._onAddToCell = _.bind(function (tile, cell) {
		this.trigger('add', tile, cell);
	}, this);

	this._onRemoveFromCell = _.bind(function (tile, cell) {
		this.trigger('remove', tile, cell);
	}, this);

	this._onTileChange = _.bind(function (source) {
		if(source instanceof Cell) {
			this.trigger('change', source);
		} else {
			var cell = this.get(
				source.get('x'),
				source.get('y')
			);
			this.trigger('change', cell);
		}
	}, this);
};

});