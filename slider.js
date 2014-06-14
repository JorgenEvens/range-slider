
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

	this.hMin.value(0);
	this.hMax.value(this.slider.width());
}

Slider.prototype = {

	listeners: null,

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

	initMax: function() {
		var me = this,
			maxWidth = this.slider.width(),

			hMax = this.hMax = new Handle(this.max)
			.validate(function(newPos,orig){
				if( newPos > maxWidth ) return maxWidth;
				if( newPos < me.hMin.value() ) {
					hMax.previous_position = me.hMin.previous_position;
					return me.hMin.value();
				}
			})
			.change(function(){me.change()});

		hMax.previous_position = 999999;
	},

	initClick: function() {
		var me = this;

		this.slider.click(function(e){
			var x = e.pageX || e.clientX || e.x,
				min = me.hMin.previous_position,
				max = me.hMax.previous_position,
				target = me.hMin;

			if( x == min || x == max )
				return;

			if( x > min && x < max )
				return;

			if( x > max )
				target = me.hMax;

			target.mousedown = true;
			target._mousemove(e);
			target.mousedown = false;
		})
	},

	change: function( v ) {
		if( typeof v == 'function' )
			return this.listeners.push(v);

		var min = this.hMin.value() / this.slider.width(),
			max = this.hMax.value() / this.slider.width();

		min = { percentage: min, value: min*this.maxValue };
		max = { percentage: max, value: max*this.maxValue };

		this.range.css({
			left: this.hMin.value(),
			width: this.hMax.value() - this.hMin.value()
		});

		for( i in this.listeners )
			this.listeners[i](min, max);
	},

	_getValue: function( handle ) {
		var v = handle.value();
		return ( v / this.slider.width() ) * this.maxValue;
	},

	_setValue: function( handle, v ) {
		v /= this.maxValue;
		v *= this.slider.width();

		handle.value( v );
		return this;
	},

	getMin: function() {
		return this._getValue( this.hMin );
	},

	setMin: function( v ) {
		return this._setValue( this.hMin, v );
	},

	getMax: function() {
		return this._getValue( this.hMax );
	},

	setMax: function( v ) {
		return this._setValue( this.hMax, v );
	}
};