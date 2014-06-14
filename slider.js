/**
 * @constructor
 * @export
 */
var Slider = function( slider, range, min, max ) {
	this.slider = slider;
	this.min = min;
	this.max = max;
	this.range = range;
	this.maxValue = 100;
	this.listeners = [];

	this.initMin();
	this.initMax();
	this.initClick();

	// jQuery compatibility
	if( !this.slider.innerWidth )
		this.slider.innerWidth = this.slider.width;

	this.hMin.value(0);
	this.hMin.previous_position = max.offset().left;
	this.hMax.value(this.slider.innerWidth());
	this.hMax.previous_position = max.offset().left;
}

Slider.prototype = {

	/** @private */
	listeners: null,

	/** @private */
	initMin: function() {
		var me = this,
			hMin = this.hMin = new Handle(this.min)
			.validate(function(newPos, orig){
				if( newPos < 0 ) return 0;
				if( newPos > me.hMax.value() ) {
					hMin.previous_position = me.hMax.previous_position;
					return me.hMax.value();
				}
			})
			.change(function(){me.change()});
	},

	/** @private */
	initMax: function() {
		var me = this,
			maxWidth = this.slider.innerWidth(),

			hMax = this.hMax = new Handle(this.max)
			.validate(function(newPos,orig){
				if( newPos > maxWidth ) return maxWidth;
				if( newPos < me.hMin.value() ) {
					hMax.previous_position = me.hMin.previous_position;
					return me.hMin.value();
				}
			})
			.change(function(){me.change()});		
	},

	/** @private */
	initClick: function() {
		var me = this;

		this.slider.click(function(e){
			var x = e.pageX || e.clientX || e.x,
				min = me.hMin.previous_position,
				max = me.hMax.previous_position,
				target = me.hMin;

			if( x == min || x == max )
				return;
			else if( x > max )
				target = me.hMax;
			else if( x > min && x < max && Math.abs( x - min ) > Math.abs( x - max ) )
					target = me.hMax;

			target.mousedown = true;
			target._mousemove(e);
			target.mousedown = false;
		})
	},

	/** @export */
	change: function( v ) {
		if( typeof v == 'function' )
			return this.listeners.push(v);

		var min = this.hMin.value() / this.slider.innerWidth(),
			max = this.hMax.value() / this.slider.innerWidth();

		min = { percentage: min, value: min*this.maxValue };
		max = { percentage: max, value: max*this.maxValue };

		this.range.css({
			left: this.hMin.value(),
			width: this.hMax.value() - this.hMin.value()
		});

		for( i in this.listeners )
			this.listeners[i](min, max);
	},

	/** @private */
	_getValue: function( handle ) {
		var v = handle.value();
		return ( v / this.slider.innerWidth() ) * this.maxValue;
	},

	/** @private */
	_setValue: function( handle, v ) {
		v /= this.maxValue;
		v *= this.slider.innerWidth();

		handle.value( v );
		return this;
	},

	/** @export */
	getMin: function() {
		return this._getValue( this.hMin );
	},

	/** @export */
	setMin: function( v ) {
		return this._setValue( this.hMin, v );
	},

	/** @export */
	getMax: function() {
		return this._getValue( this.hMax );
	},

	/** @export */
	setMax: function( v ) {
		return this._setValue( this.hMax, v );
	}
};