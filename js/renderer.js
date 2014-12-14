define(['lib/rot'], function (ROT) {
	
return function () {

	var _display,
		_map,
		_changedCells = [];

	function invalidate(cell) {
		_changedCells.push(cell);
	}

	this.update = function (cell) {
		// if(cell.isVisible()) {
			cell.forEach(function (tile, index) {
				_display.draw(
					tile.get('x'), 
					tile.get('y'), 
					tile.get('ascii'),
					tile.get('color'), 
					tile.get('backgroundColor')
				);
			});
		// }
	}

	this.init = function (map) {
		_display = new ROT.Display({
			width: map.width, 
			height: map.height
		});
		_map = map;
		document.getElementById('stage').appendChild(_display.getContainer());
	};



};

})