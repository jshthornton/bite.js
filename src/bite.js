(function(win, undefined) {
	'use strict';

	function _do($, _) {
		var $win = $(window),
			bite = {
				_hash: [],
				_idCount: 0,

				register: function(opts, callback) {
					opts = $.extend(true, {
						reference: null,
						offset: 0
					}, opts);

					var ref = opts.offset;
					if(typeof opts.reference === 'number') {
						ref += opts.reference;
					} else {
						ref += opts.reference.offset().top;
					}

					var id = this._idCount++;

					this._hash.push({
						id: id,
						point: ref,
						callback: callback
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
						$.proxy(
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
						scrollTop = $win.scrollTop();

					$.each(this._hash, function(index, value) {
						if(scrollTop >= value.point) {
							if(typeof value.callback === 'function') {
								value.callback();
							}

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