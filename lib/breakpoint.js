/**
 * Media query Breakpoint to js event.
 * @param {[type]} lists    [description]
 * @param {[type]} onChange [description]
 */
var Emitter = require('nomocas-utils/lib/emitter');
var BreakpointManager = function(lists, onChange) {
	this.lists = lists || [];
	this.breakpoints = {};
	this.onChange = onChange;
};

BreakpointManager.prototype = {
	add: function(label, min, max) {
		this.lists.push({ label: label, min: min, max: max });
	},
	remove: function(label) {
		this.lists = this.lists.filter(function(bkp) {
			return bkp.label != label;
		});
	},
	startListening: function() {
		this.interval = setInterval(function() {
			checkAll(window.innerWidth);
		}, 150);
	},
	stopListening: function() {
		if (this.interval)
			clearInterval(this.interval);
		this.interval = null;
	},
	checkAll: function(width) {
		this.lists.forEach(function(bkp) {
			this.check(bkp, width);
		}, this);
	},
	check: function(breakpoint, width) {
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
				this.onChange(breakpoint.label, true);
			}
		} else if (this.breakpoints[breakpoint.label]) // exit breakpoint
		{
			this.breakpoints[breakpoint.label] = false;
			this.onChange(breakpoint.label, false);
		}
	}
};
