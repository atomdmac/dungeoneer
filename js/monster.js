define(['tile', 'lib/rot'], function (Tile, ROT) {

var Monster = Tile.extend({
	defaults: {
		name: 'Generic Monster',
		type: 'monster',
		ascii: 'M',
		zIndex: 1,
		color: '#fff',
		backgroundColor: '#000',
		passable: false,
		transparent: true,

		// Character stats.
		health: 100,
		attack: 20,
		defense: 20
	},

	initialize: function () {
		_.bindAll(this);

		this.on('move', this._onMove);
	},

	// List of currently visible cells.
	_visibleCells: [],

	updateVision: function () {
		var map, visibleCells, self = this;

		if(this._visibleCells.length) {
			this._visibleCells.forEach(this._markUnseen);
		}

		map = this.get('map');
		visibleCells = map.getVisibleAt(
			this.get('x'), 
			this.get('y'),
			this._markSeen
		);

		// Store list of visible cells so we can mark them as unseen later if
		// necessary.
		this._visibleCells = visibleCells;
	},

	launchAttack: function (monster) {
		var myAttack = this.get('attack') * Math.random(),
			theirDefense = this.get('defense') * Math.random();

		if (myAttack > theirDefense) {
			monster.takeDamage(myAttack);

			this.trigger('launchAttack', {
				attacker: this,
				defender: monster
			});
		} 

		else {
			this.trigger('missAttack', {
				attacker: this,
				defender: monster
			});
		}
	},

	takeDamange: function (amount, attacker) {
		this.set('health', this.get('health') - amount);
		this.trigger('takeDamage', {
			amount: amount,
			attacker: attacker
		});

		if(this.get('health') < 0) {
			this.die(attacker);
		}
	},

	die: function (attacker) {
		this.trigger('die', {
			attacker: attacker,
			defender: this
		});
	},

	canAttack: function (x, y) {
		return !!this.get('map').getMonstersAt(x, y).length;
	},

	_onMove: function () {
		this.updateVision();

		/*visibleCells.forEach(function (cell) {
			try {
				cell.setVisibility(true);
			} catch (e) {
				debugger;
			}
		});*/
	},

	_markSeen: function (x, y, r, cell) {
		// Now that this cell has been seen, consider it discovered.
		try {
			cell.isDiscovered(true);
		} catch (e) {
			debugger;
		}

		// Alert listeners that the player has seen this cell.
		this.trigger('see', cell);
	},

	_markUnseen: function (cell) {
		this.trigger('unsee', cell);
	}
});

return Monster;

});