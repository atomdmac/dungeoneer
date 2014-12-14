define(['lib/signals', 'lib/lodash'], function (signals, _) {

return function (options) {
	var _options = {
		id         : new Date().getTime(),
		position   : {
			x: 0,
			y: 0
		},
		type       : 'wall',
		tile       : '#',
		name       : '',
		passable   : true,
		transparent: true
	};

	// Apply config to this instance.
	_.extend(this, _options, options);

	// Events
	this.signals = {
		move: new signals.Signal()
	};

	this.map = null;
	this.setMap = function (map) {
		this._map = map;
	};

	this.move = function (x, y) {
		var signalData = {
			entity: this,
			newPosition: {
				x: x,
				y: y
			},
			oldPosition: {
				x: this.position.x,
				y: this.position.y
			}
		};

		// Update my position.
		this.position.x = x;
		this.position.y = y;

		// If I've been added to a map, I'll tell the map about my move.
		if (this._map) {
			this._map.moveEntity(
				this, 
				signalData.oldPosition, 
				signalData.newPosition
			);
		}

		// Tell anyone else that cares that I've moved.
		this.signals.move.dispatch(signalData);
	};
};

});