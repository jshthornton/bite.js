(function(win, undefined) {
	'use strict';

	function _do($, _) {
		var $win = $(window);
		/*
		A utility script which helps developers who need to perform a function once the page scroll hits a certain point.

		@class bite
		@static
		@requires jQuery, underscore
		*/
		var bite = {
				/*
				A hash to hold all of the registered items.
				Formatted as:
					[{
						id: Number,
						type: String,
						$el: jQuery,
						point: {
							x: Bool|Number,
							y: Bool|Number
						},
						inCallback: Function,
						outCallback: Function,
						once: Boolm
						origin: {
							x: Number,
							y: Number,
							unitX: String,
							unitY: String
						},
						toggle: Bool,
						active: Bool
					}]
				
				@property _hash
				@type Array
				@default []
				@protected
				*/
				_hash: [],
				/*
				Counter for hash ids.

				@property _idCount
				@type Integer
				@default 0
				@protected
				*/
				_idCount: 0,
				/*
				Window's scrolltop.

				@property _scrollTop
				@type Integer
				@default 0
				@protected
				*/
				_scrollTop: 0,
				/*
				Window's scrollleft.

				@property _scrollLeft
				@type Integer
				@default 0
				@protected
				*/
				_scrollLeft: 0,
				/*
				Window's width.

				@property _winWidth
				@type Integer
				@default 0
				@protected
				*/
				_winWidth: 0,
				/*
				Window's height.

				@property _winHeight
				@type Integer
				@default 0
				@protected
				*/
				_winHeight: 0,
				/*
				Registers a new item to watch.

				@method register
				@param {Object} opts Options to alter how the watching operates.
				@param {String} opts.type The type of watching. Either `absolute` or `element`.
				`absolute` uses a raw X,Y coordinate. Whereas `element` uses an element's X,Y coordindates.
				@param {Bool|Number} opts.point.x
				@param {jQuery} [opts.$el] Which element to watch. Required if `opts.type = 'element'`.
				@param {Bool|Number} [opts.point.x] 
				When using `opts.type = 'absolute'` setting this param to any number will set the X threshold to the number.
				Whereas using `opts.type = 'element'` setting this param should be a Bool. `false` will not include the X coordinate. `true` will use the element's left offset.
				X and Y operate in an AND capacity. Therefore `inCallback` will not invoke unless both meet the threshold.
				@param {Bool|Number} [opts.point.y] 
				See `opts.point.x`. Just apply Y and top offset.
				@param {Bool} [opts.once] If `true` then the item unregisters once the threshold has been met once. `false` will cause the item to be constantly rechecked.
				@param {Object} [opts.origin] Informs bite where the threshold should be calculated from. Not on the element but the window.
				@param {Number} [opts.origin.x] 
				If `opts.origin.unitX = 'px'` then the X coordindate of the window which will trigger the threshold. 0 = Left.
				However, `opts.origin.unitX = '%'` will inform bite to calculate window's dimensions and use a percentage for comparison. 
				This method is useful for items coming onto the screen (100) or half way on the screen (50).
				@param {Number} [opts.origin.y] If `opts.origin.unitY = 'px'` then the Y coordindate of the window which will trigger the threshold. 0 = Top.
				However, `opts.origin.unitY = '%'` will inform bite to calculate window's dimensions and use a percentage for comparison. 
				This method is useful for items coming onto the screen (100) or half way on the screen (50).
				@param {String} [opts.origin.unitX] `px` or `%`, offsets the threshold calculation point. 
				`px` will use literal pixel distance, whereas `%` will use the window's dimensions as a reference.
				@param {String} [opts.origin.unitY] `px` or `%`, offsets the threshold calculation point. 
				`px` will use literal pixel distance, whereas `%` will use the window's dimensions as a reference.

				@return {Integer} Unique id to use for unregistering.
				*/
				register: function(opts, inCallback, outCallback) {
					if(typeof inCallback !== 'function') return false;
					if(typeof outCallback !== 'function') outCallback = $.noop;

					opts = $.extend(true, {
						type: 'absolute',
						point: {
							x: false,
							y: false
						},
						once: false,
						origin: {
							x: 0,
							y: 0,
							unitX: 'px',
							unitY: 'px'
						},
						toggle: false
					}, opts);

					var id = this._idCount++;

					this._hash.push({
						id: id,
						type: opts.type,
						$el: opts.$el,
						point: opts.point,
						inCallback: inCallback,
						outCallback: outCallback,
						once: opts.once,
						origin: opts.origin,
						toggle: opts.toggle,
						active: true
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

				unregisterAll: function() {
					this._hash.length = 0;
				},

				_unregisterByIndex: function(index) {
					this._hash.splice(index, 1);
				},

				start: function() {
					$win.on('scroll.bite resize.bite', 
						_.bind(
							_.throttle(
								this._onWindowAdjust, 
								100
							), 
							this
						)
					);

					this._updateDimensions('scroll');
					this._updateDimensions('resize');

					this.check();
				},

				stop: function() {
					$win.off('scroll.bite resize.bite');
				},

				_onWindowAdjust: function(e) {
					this._updateDimensions(e.type);

					this.check();
				},

				_updateDimensions: function(type) {
					if(type === 'scroll') {
						this._scrollLeft = $win.scrollLeft();
						this._scrollTop = $win.scrollTop();
					} else if(type === 'resize') {
						this._winWidth = $win.width();
						this._winHeight = $win.height();
					}
				},

				_check: function(data) {
					var thresholdX = this._scrollLeft,
						thresholdY = this._scrollTop,
						originX,
						originY;

					if(data.origin.unitX === '%') {
						originX = this._winWidth * (data.origin.x / 100);
					} else {
						originX = data.origin.x;
					}

					if(data.origin.unitY === '%') {
						originY = this._winHeight * (data.origin.y / 100);
					} else {
						originY = data.origin.y;
					}

					thresholdX += originX;
					thresholdY += originY;

					if(data.doX && data.doY) {
						if(thresholdX >= data.x && thresholdY >= data.y) {
							return true;
						}
					} else if(data.doX) {
						if(thresholdX >= data.x) {
							return true;
						}
					} else if(data.doY) {
						if(thresholdY >= data.y) {
							return true;
						}
					}

					return false;
				},

				check: function() {
					var toUnregister = [];

					_.each(this._hash, function(value, index) {
						var point = value.point,
							result;

						if(value.type === 'absolute') {
							result = this._check({
								doX: typeof point.x === 'number',
								doY: typeof point.y === 'number',
								x: point.x,
								y: point.y,
								origin: value.origin
							});

						} else if(value.type === 'element') {
							var offset = value.$el.offset();

							result = this._check({
								doX: point.x,
								doY: point.y,
								x: offset.left,
								y: offset.top,
								origin: value.origin
							});
						}

						if(result) {
							if(value.active) {
								value.inCallback();

								if(value.once) {
									toUnregister.push(value.id);
								}
							}

							if(value.toggle) {
								value.active = false;
							}
						} else {
							if((value.toggle && !value.active) || (!value.toggle)) {
								value.outCallback();
							}

							if(value.toggle) {
								value.active = true;
							}
						}

					}, this);

					_.each(toUnregister, function(id) {
						this.unregister(id);
					}, this);
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