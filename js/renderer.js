define(['lib/rot'], function (ROT) {
	
return function () {

	var _display,
		_map,
		_changedCells = [];

	function invalidate(cell) {
		_changedCells.push(cell);
	}

	this.update = function (cell, visible) {
		if(visible) {
			cell.forEach(function (tile, index) {
				_display.draw(
					tile.get('x'), 
					tile.get('y'), 
					tile.get('ascii'),
					tile.get('color'), 
					tile.get('backgroundColor')
				);
			});
		} else {
			// Cells that have been seen previously should be drawn differently
			// than cells that can be seen presently.

			// Previously seen cells.
			if(cell.isDiscovered() && cell.isPassable()){ 
				cell.forEach(function (tile, index) {
					_display.draw(
						tile.get('x'), 
						tile.get('y'), 
						'',
						'#000099', 
						'#000033'
					);
				});
			}

			// Currently seen cells.
			else {
				cell.forEach(function (tile, index) {
					_display.draw(
						tile.get('x'), 
						tile.get('y'), 
						'',
						'#000', 
						'#000'
					);
				});
			}
		}
	};

	this.init = function (map) {
		_display = new ROT.Display({
			width: map.width, 
			height: map.height
		});
		_map = map;
		document.getElementById('stage').appendChild(_display.getContainer());
	};
};

});