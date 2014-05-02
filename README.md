bite.js
==========

bite.js is a utility script which helps javascript developer who need to perform a function once the page scroll hits a certain point.

bite.js currently offers two ways in which a threshold can be set, either as an absolute coordinate, or as an element's coordinates.

## Demo
[http://codepen.io/Jshthornton/pen/jAzuG](http://codepen.io/Jshthornton/pen/jAzuG)

## Requirements
* jQuery
* underscore or lodash

Additionally, if using an AMD build underscore needs to be accessibility via the import `underscore`

## Usage
### Type `absolute`
When using this type the callback function is invoked once the user has scrolled to a specific coordindate.
```
bite.register({
	type: 'absolute',
	point: {
		y: 500
	}
}, function() {console.log('Y')});
```
```
bite.register({
	type: 'absolute',
	point: {
		x: 500
	}
}, function() {console.log('X')});
```
```
bite.register({
	type: 'absolute',
	point: {
		x: 700,
		y: 700
	}
}, function() {console.log('X, Y')});
```

### Type `element`
When using this type the callback function is invoked once the user has scrolled to a specific element.
```
bite.register({
	type: 'element',
	$el: $('.test'),
	point: {
		y: true
	}
}, function() {console.log('Y')});
```
```
bite.register({
	type: 'element',
	$el: $('.test'),
	point: {
		x: true
	}
}, function() {console.log('X')});
```
```
bite.register({
	type: 'element',
	$el: $('.test'),
	point: {
		x: true,
		y: true
	}
}, function() {console.log('X, Y')});
```
### Origin
By default bite checks if the coordindates match the 0,0 coordindates of the window, however it might be required that either the element has just come into view, or that the element is close to leaving the screen. This is where the origin can come in useful.

```
bite.register({
	type: 'absolute',
	point: {
		y: 500
	},
	origin: {
		y: 50,
		unitY: '%'
	}
}, function() {console.log('Y 0,50%')});
```

The example code will invoke its callback once the user has scrolled so that `500px` is in the middle of the screen vertically.

If however it is required that the position is just offset by a set amount of pixels then either alter the `point` or if using `type = 'element'` then origin can use pixels.

```
bite.register({
	type: 'absolute',
	point: {
		y: 500
	},
	origin: {
		y: 50,
		unitY: 'px'
	}
}, function() {console.log('Y 0,50px')});
```

### Once
It might be required that you only need to have the callback invoke once. Set this option to true if you do, as bite will then remove it from the registry once it has been invoked once.

### Toggle
By default bite will invoke the callback everytime the user scrolls or resizes their browser if the threshold is met. This is not always required behaviour and it might be required that the callback is only invoked once until they re-enter the threshold after not hitting the threshold.

If this is the case then set `toggle` to `true`.

### Start / Stop
bite will not do anything until it has been started. First `bite.start()` must be called. This will tell bite to listen to all the needed events in the `bite` namespace. `start()` can be called after registering all of the registered items.

If bite is no longer required to function then `stop()` can be called. 

**Note:** this will not clear existing items. If this is required then call `unregisterAll()`.

### Unregister
To unregister a previously registered item `unregister` needs to be called. However, it requires an `id`. This id can be obtained via the return from `register`.
```
var id = bite.register({
	type: 'absolute',
	point: {
		y: 500
	}
}, function() {console.log('Y')});

bite.unregister(id);
```
### Callbacks
For the bite parameters it accepts an in callback and an out callback. The in callback is invoked when the user has hits the threshold. 
Whereas the out callback is invoked when the user is not in the threshold.

When using `toggle = true` the out and in callbacks are only called once upon state change.
When using `toggle = false` the out and in callbacks are constantly called.