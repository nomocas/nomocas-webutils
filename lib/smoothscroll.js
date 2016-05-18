/*!
 * smooth-scroll v9.1.1: Animate scrolling to anchor links
 * (c) 2016 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/smooth-scroll
 *
 * Gilles Coomans : remove a lot. clean. work now on any cscrollable container.
 */


// Default settings
var defaults = {
	duration: 500,
	easing: 'easeInOutCubic',
	offset: 0,
	animationTimeStep: 20
};


/**
 * Calculate the easing pattern
 * @link https://gist.github.com/gre/1650294
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
var easingPattern = function(type, time) {
	switch (type) {
		case 'easeInQuad':
			return time * time; // accelerating from zero velocity
		case 'easeOutQuad':
			return time * (2 - time); // decelerating to zero velocity
		case 'easeInOutQuad':
			return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		case 'easeInCubic':
			return time * time * time; // accelerating from zero velocity
		case 'easeOutCubic':
			return (--time) * time * time + 1; // decelerating to zero velocity
		case 'easeInOutCubic':
			return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		case 'easeInQuart':
			return time * time * time * time; // accelerating from zero velocity
		case 'easeOutQuart':
			return 1 - (--time) * time * time * time; // decelerating to zero velocity
		case 'easeInOutQuart':
			return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		case 'easeInQuint':
			return time * time * time * time * time; // accelerating from zero velocity
		case 'easeOutQuint':
			return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		case 'easeInOutQuint':
			return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		default:
			return time; // no easing, no acceleration
	}
};

/**
 * Calculate how far to scroll
 * @private
 * @param {Element} anchor The anchor element to scroll to
 * @param {Number} offset Number of pixels by which to offset scroll
 * @returns {Number}
 */
var getEndLocation = function(anchor, offset) {
	var location = 0;
	if (anchor.offsetParent) {
		do {
			location += anchor.offsetTop;
			anchor = anchor.offsetParent;
		} while (anchor);
	}
	location = location - offset;
	return location >= 0 ? location : 0;
};

/**
 * Determine the document's height
 * @returns {Number}
 */
var getDocumentHeight = function() {
	return Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	);
};
/**
 * Get the height of an element.
 * @param  {Node} elem The element to get the height of
 * @return {Number}    The element's height in pixels
 */
var getElementHeight = function(elem) {
	return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
};


function merge(obj1, obj2) {
	var output = {},
		i;
	for (i in obj1)
		output[i] = obj1[i];
	for (i in obj2)
		output[i] = obj2[i];
	return output;
}


function query(string) {
	if (string[0] === '#')
		return document.getElementById(string.substring(1));
	return document.querySelector(string);
}

var animationInterval;

/**
 * Scroll to target
 * @param {Element|String} anchor The element to scroll to (or it hash)
 * @param {Object} options
 */
module.exports = function(container, target, options, callback) {
	options = merge(defaults, options);
	target = typeof target === 'string' ? query(target) : target;
	var targetIsNum = typeof target === 'number';
	// console.log('animate scroll : ', target, container);
	if (!target && target !== 0) {
		console.log('smoothscroll hasn\'t found target. aborting scroll. id : ' + target);
		return;
	}
	var startLocation = container.scrollTop, // Current location on the page
		endLocation = targetIsNum ? target : getEndLocation(target, options.offset), // Location to scroll to
		distance = endLocation - startLocation, // distance to travel
		documentHeight = getDocumentHeight(),
		timeLapsed = 0,
		position;

	/**
	 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
	 * @param {Number} position Current position on the page
	 * @param {Number} endLocation Scroll to location
	 * @param {Number} animationInterval How much to scroll on this loop
	 */
	var stopAnimateScroll = function(position, endLocation, animationInterval) {
		var currentLocation = container.scrollTop;
		if (position == endLocation || currentLocation == endLocation || ((container.innerHeight + currentLocation) >= documentHeight)) {
			clearInterval(animationInterval);
			if (!targetIsNum)
				target.focus();
			if (callback)
				callback(target);
		}
	};

	/**
	 * Loop scrolling animation
	 */
	var loopAnimateScroll = function() {
		timeLapsed += options.animationTimeStep;
		var percentage = (timeLapsed / options.duration);
		percentage = (percentage > 1) ? 1 : percentage;
		position = startLocation + (distance * easingPattern(options.easing, percentage));
		container.scrollTop = Math.floor(position);
		stopAnimateScroll(position, endLocation, animationInterval);
	};

	/**
	 * Reset position to fix weird iOS bug
	 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
	 */
	if (container === window && window.pageYOffset === 0)
		window.scrollTo(0, 0);

	clearInterval(animationInterval);
	animationInterval = setInterval(loopAnimateScroll, options.animationTimeStep);
};

// @usage : smoothScroll.animateScroll("#myanchor", settings); // Animate scroll
