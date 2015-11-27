define(
['lib/backbone', 'lib/lodash', 'tile'], 
function (Backbone, _, Tile) {

var Cell = Backbone.Collection.extend({

	defaults: {
		// Whether or not the player has discovered this area.
		discovered: false
	},

	attributes: null,

	initialize: function () {
		// Merge defaults with provided attributes.
		this.attributes = {};
		_.extend(this.attributes, this.defaults);
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

	isDiscovered: function (discovered) {
		if(typeof discovered === 'boolean') this.attributes.discovered = discovered;
		return this.attributes.discovered;
	},

	isPassable: function () {
		return !this.where({passable: false}).length;
	},

	isTransparent: function () {
		return !this.where({transparent:false}).length;
	},

	getMonsters: function () {
		return this.where({type:'monster'});
	}
});

return Cell;
	
});