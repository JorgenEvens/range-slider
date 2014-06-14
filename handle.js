var Handle = function( self ){
	this.previous_position = 0;
	this.mousedown = false;
	this.validators = [];
	this.self = self;

	var me = this;

	self.mousedown(function(e){me._mousedown(e);});
	$(document).mousemove(function(e){me._mousemove(e);});					
	$(document).mouseup(function(e){me._mouseup(e);});
};

Handle.prototype = {
	validators: [],

	listeners: [],

	validate: function(v) { this.validators.push(v); return this; },

	change: function(v) { this.listeners.push(v); return this; },

	value: function(v) {
		if( typeof v != 'undefined' ) {
			v = Math.round(v);
			var x = parseInt(this.self.css('left'));
			x = this.previous_position + ( v - x );
			this._setNewPosition( x, v );
			return this;
		}
		return parseInt(this.self.css('left'));
	},

	_notifyChange: function() {
		var i = null;

		for( i in this.listeners )
			this.listeners[i]();
	},

	_setNewPosition: function( x, newPos ) {
		var i = null,
			old = this.value();

		for( i in this.validators ) {
			i = this.validators[i](newPos,old);
			if( typeof i != 'undefined' && i != newPos ) {
				newPos = i;
				i = false;
				break;
			}
		}
		
		if( i !== false )
			this.previous_position = x;

		if( newPos === false )
			return;
		
		this.self.css('left', newPos );
		this._notifyChange();
	},

	_mousedown: function(e){
		this.mousedown = true;
		this.previous_position = e.pageX || e.clientX || e.x;
	},

	_mousemove: function(e){
		if( !this.mousedown ) return;

		var x = e.pageX || e.clientX || e.x,
			offset = x - this.previous_position,
			old = this.value(),
			newPos = old + offset;

		this._setNewPosition( x, newPos );
	},

	_mouseup: function(e){
		this.mousedown = false;
	}
};