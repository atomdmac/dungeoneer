define(['lib/lodash'], function (_) {

var FONT_SIZE = 12,
	LINE_HEIGHT = 12,
	MAX_LINES = 15;

var Log = function () {

	// Create a layer to draw the log on.
	var canvas = document.createElement('canvas'),
		ctx    = canvas.getContext('2d');

	// TODO: Don't hardcode Log canvas dimensions.
	canvas.width = 720;
	canvas.height = 600;
	canvas.style.position = 'absolute';
	canvas.style.top      = 0;
	canvas.style.left     = 0;

	document.getElementById('stage').appendChild(canvas);

	var messages = [],
		x = 10,
		y = 20;

	this.addMessage = function (message) {
		messages.unshift(message);
	};

	this.move = function (newX, newY) {
		x = newX;
		y = newY;
	};

	this.draw = function () {

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(x, y);
		ctx.textBaseline = 'top';
		ctx.font = FONT_SIZE + 'px Arial';
		ctx.textAlign = 'left';
		ctx.fillStyle = '#fff';

		var max = messages.length > MAX_LINES ? MAX_LINES : messages.length - 1;

		for(var i=0; i<max; i++) {
			ctx.fillText(messages[i], x, y + (FONT_SIZE * i));
			if(i>0) ctx.globalAlpha = 1 - (1 / (max / (i-1)));	
		}

		ctx.restore();
	};
};

return Log;

});