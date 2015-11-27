require.config({
	baseUrl: 'js',
	map: {
		'lib/backbone': {
			'underscore': 'lib/lodash',
			'jquery'    : 'lib/jquery'
		}
	},
	paths: {
		'lib/rot'     : 'lib/rotjs/rot',
		'lib/backbone': 'lib/backbone-1.1.2',
		'lib/jquery'  : 'lib/jquery-1.11.1',
		'underscore'  : 'lib/lodash'
	},
	shim: {
		'lib/rot': {
			exports: 'ROT'
		},
		'lib/lodash': {
			exports: '_'
		},
		'lib/backbone': {
			exports: 'Backbone',
			deps: ['lib/lodash', 'lib/jquery']
		}
	}
});

require(
['map', 'renderer', 'player', 'enemy', 'log', 'lib/rot', 'lib/backbone'], 
function (Map, Renderer, Player, Enemy, Log, ROT, Backbone) {

	var map      = new Map();
	var renderer = new Renderer();
	var log      = new Log();
	var player   = new Player({x: 10, y: 10});
	var enemy    = new Enemy();

	map.on('add', function (tile, cell) {
		// renderer.update(cell);
	});

	map.on('remove', function (tile, cell) {
		// renderer.update(cell);
	});

	map.on('change', function (cell) {
		// renderer.update(cell);
	});

	player.on('see', function (cell) {
		renderer.update(cell, true);
	});

	player.on('unsee', function (cell) {
		renderer.update(cell, false);
	});

	player.on('move', function (tile) {
		log.addMessage('Player moves to ' + tile.get('x') + ', ' + tile.get('y'));
	});

	enemy.on('move', function (tile) {
		log.addMessage('Enemy moves to ' + tile.get('x') + ', ' + tile.get('y'));
	});

	renderer.init(map);
	map.generate();

	var playerSpawn = map.getRandomPassable();
	player.set('x', playerSpawn.get('x'));
	player.set('y', playerSpawn.get('y'));

	var enemySpawn = map.getRandomPassable();
	enemy.set('x', enemySpawn.get('x'));
	enemy.set('y', enemySpawn.get('y'));

	map.add(player);
	map.add(enemy);

	map.on('change', function(cell) {
		// renderer.update(cell, true);
	});

	// Input
	function onKeyPress (event) {
		var validKey = false;

		switch(event.keyCode) {
			case ROT.VK_K:
				player._moveN();
				break;
			case ROT.VK_U:
				player._moveNE();
				validKey = true;
				break;
			case ROT.VK_L:
				player._moveE();
				validKey = true;
				break;
			case ROT.VK_N:
				player._moveSE();
				validKey = true;
				break;
			case ROT.VK_J:
				player._moveS();
				validKey = true;
				break;
			case ROT.VK_B:
				player._moveSW();
				validKey = true;
				break;
			case ROT.VK_H:
				player._moveW();
				validKey = true;
				break;
			case ROT.VK_Y:
				player._moveNW();
				validKey = true;
				break;
			default:
		}

		// Input wasn't valid.  Abort!
		if(!validKey) return;

		enemy.act(player);

		player.updateVision();
		log.draw();

		// renderer.update(map.get(enemy.get('x'), enemy.get('y')), true);
	}

	document.addEventListener('keydown', onKeyPress);
	
	// Draw player's initial view.
	player.updateVision();

	/*
	console.log('I started and here is my copy of ROT: ', ROT);
'],
	var display = new ROT.Display({width: 40, height: 20});
	document.getElementById('stage').appendChild(display.getContainer());

	display.draw(20, 10, '@', '#00ff00');
	*/
});