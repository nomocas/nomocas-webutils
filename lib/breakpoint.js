/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * 
 * Media query Breakpoint to js event.
 *
 * You could set it in pure js, or catch breakpoint label from dom element:before.
 * 
 * See : auto catch breakpoint from css
 * https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript
 * or
 * https://github.com/14islands/js-breakpoints/blob/master/breakpoints.js
 *
 *
 * @example
 *
 * var mgr = new BreakpointManager();
 * mgr.add('tablet', 900, 1100);
 * mgr.addFromElement('body'); // will seek in body:before after content value to get current breakpoint label. see doc above.
 *
 *
 * mgr.on('enter:desktop', function(){
 * 	// do something
 * });
 *
 * mgr.on('exit:tablet', function(){ ... })
 *
 * mgr.once('exit:phone', function(){ ... })
 *
 * @licence MIT
 */
var Emitter = require('nomocas-utils/lib/emitter');
var BreakpointManager = function(list, opt) {
	opt = opt || {};
	this.list = list || [];
	this.checkStep = opt.checkStep || 150;
	this.pseudoSelector = opt.pseudoSelector || ':before';
	this.breakpoints = {}; // to keep tracking of current breakpoints;
};

BreakpointManager.prototype = new Emitter();

function getFromElement(el, pseudo) {
	return window.getComputedStyle(el, pseudo).getPropertyValue('content').replace(/\"/g, '');
}

var proto = {
	add: function(label, min, max) {
		this.list.push({ label: label, min: min, max: max });
	},
	addFromElement: function(el) {
		el = typeof el === 'string' ? document.querySelector(el) : el;
		this.list.push({ current: null, el: el });
	},
	removeElement: function(el) {
		this.list = this.list.filter(function(bkp) {
			if (bkp.el)
				return bkp.el != el;
			return true;
		});
	},
	remove: function(label) {
		this.list = this.list.filter(function(bkp) {
			if (bkp.label)
				return bkp.label != label;
			return true;
		});
	},
	startListening: function() {
		// use custom loop to low perf impact (check each 150 ms by default)
		this.interval = setInterval(function() {
			checkAll(window.innerWidth);
		}, this.checkStep);
	},
	stopListening: function() {
		if (this.interval)
			clearInterval(this.interval);
		this.interval = null;
	},
	checkAll: function(width) {
		this.list.forEach(function(bkp) {
			this.check(bkp, width);
		}, this);
	},
	check: function(breakpoint, width) {
		if (breakpoint.el) {
			var current = getFromElement(el, this.pseudoSelector);
			if (!current)
				throw new Error('breakpoint listener from element pseudo : no value returned. please read doc.')
			if (current !== breakpoint.current) {
				this.emit('exit:' + breakpoint.current);
				this.emit('enter:' + current);
				breakpoint.current = current;
			}
			return;
		}

		var minOk = true,
			maxOK = true;
		if (breakpoint.min !== null && breakpoint.min >= width)
			minOk = false;
		if (breakpoint.max && breakpoint.max <= width)
			maxOK = false;
		if (minOK && maxOK) {
			if (!this.breakpoints[breakpoint.label]) // set breakpoint
			{
				this.breakpoints[breakpoint.label] = true;
				this.emit('enter:' + breakpoint.label);
			}
		} else if (this.breakpoints[breakpoint.label]) // exit breakpoint
		{
			this.breakpoints[breakpoint.label] = false;
			this.emit('exit:' + breakpoint.label);
		}
	}
};

for (var i in proto)
	BreakpointManager.prototype[i] = proto[i];

module.exports = BreakpointManager;
