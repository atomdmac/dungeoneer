define(
['lib/backbone', 'lib/lodash', 'tile'], 
function (Backbone, _, Tile) {

var Cell = Backbone.Collection.extend({

	defaults: {
		x: 0,
		y: 0,
		// Whether or not the player has seen this area.
		seen: true
	},

	attributes: null,

	initialize: function (attributes) {
		// Merge defaults with provided attributes.
		this.attributes = {};
		_.extend(this.attributes, attributes, this.defaults);
	},

	/*
	set: function (key, value) {
		if(this.attributes[key]) {
			this.attributes[key] = value;
			this.trigger('change', this);
		}
	},

	get: function (key) {
		return this.attributes[key];
	},
	*/

	/*add: function (tile) {
		return Backbone.Collection.prototype.add.call(this, tile);
	},*/

	comparator: function (a, b) {
		if (a.zIndex < b.zIndex) return  1;
		if (a.zIndex > b.zIndex) return -1;
		return 0;
	},

	setVisibility: function (flag) {
		this.attributes.seen = _.isBoolean(flag) ? flag : true;
	},

	isVisible: function () {
		return this.attributes.seen;
	},

	isPassable: function () {
		return !this.where({passable: false}).length;
	},

	isTransparent: function () {
		return !this.where({transparent:false}).length;
	}
});

return Cell;
	
});