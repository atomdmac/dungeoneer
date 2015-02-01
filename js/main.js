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
['map', 'renderer', 'player', 'lib/rot', 'lib/backbone'], 
function (Map, Renderer, Player, ROT, Backbone) {

	var map      = new Map;
	var renderer = new Renderer(); 
	var player   = new Player({x: 10, y: 10});

	map.on('add', function (tile, cell) {
		renderer.update(cell);
	});

	map.on('remove', function (tile, cell) {
		renderer.update(cell);
	});

	map.on('change', function (cell) {
		renderer.update(cell);
	});

	renderer.init(map);
	map.generate();

	var playerSpawn = map.getRandomPassable();
	player.set('x', playerSpawn.get('x'));
	player.set('y', playerSpawn.get('y'));

	map.add(player);

	function handleKeyboardInput(event) {
		switch(event.keyCode) {
			case ROT.VK_K:
				player._moveN();
				break;
			case ROT.VK_U:
				player._moveNE();
				break;
			case ROT.VK_L:
				player._moveE();
				break;
			case ROT.VK_N:
				player._moveSE();
				break;
			case ROT.VK_J:
				player._moveS();
				break;
			case ROT.VK_B:
				player._moveSW();
				break;
			case ROT.VK_H:
				player._moveW();
				break;
			case ROT.VK_Y:
				player._moveNW();
				break;
		}
	}
	document.addEventListener('keydown', handleKeyboardInput);

	/*
	console.log('I started and here is my copy of ROT: ', ROT);
'],
	var display = new ROT.Display({width: 40, height: 20});
	document.getElementById('stage').appendChild(display.getContainer());

	display.draw(20, 10, '@', '#00ff00');
	*/
})