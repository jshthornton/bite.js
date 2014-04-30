(function(win, undefined) {
	'use strict';

	function _do($, _) {
		var $win = $(window),
			bite = {
				_hash: [],
				_idCount: 0,

				register: function(opts, callback) {
/*					if(opts.type === 'absolute') {

					}*/


/*					opts = $.extend(true, {
						reference: null,
						offset: 0
					}, opts);

					var ref = opts.offset;
					if(typeof opts.reference === 'number') {
						ref += opts.reference;
					} else {
						ref += opts.reference.offset().top;
					}*/

					if(typeof callback !== 'function') return false;

					var id = this._idCount++;

					this._hash.push({
						id: id,
						type: opts.type,
						point: opts.point,
						callback: callback,
						once: opts.once
					});

					return id; 
				},

				unregister: function(id) {
					var index = _.findIndex(this._hash, { id: id });

					if(index === -1) {
						return false;
					}

					this._unregisterByIndex(index);
				},

				_unregisterByIndex: function(index) {
					this._hash.splice(index, 1);
				},

				start: function() {
					$win.on('scroll resize', 
						_.bind(
							_.throttle(
								this._onWindowAdjust, 
								100
							), 
							this
						)
					);
					this.check();
				},

				stop: function() {

				},

				_onWindowAdjust: function() {
					this.check();
				},

				check: function() {
					var _this = this,
						scrollTop = $win.scrollTop(),
						scrollLeft = $win.scrollLeft();

					_.each(this._hash, function(value, index) {
						var point = value.point;

						if(typeof point.x === 'number' && typeof point.y === 'number') {
							if(scrollLeft >= point.x && scrollTop >= point.y) {
								value.callback();
							}
						} else if(typeof point.x === 'number') {
							if(scrollLeft >= point.x) {
								value.callback();
							}
						} else if(typeof point.y === 'number') {
							if(scrollTop >= point.y) {
								value.callback();
							}
						}

						if(value.once) {
							_this._unregisterByIndex(index);
						}

					});
				}
			};

		return bite;
	}

	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'underscore'], _do);
	} else {
		win.bite = _do(jQuery, _);
	}
}(window));