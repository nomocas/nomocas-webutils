/**
 * ReachEndistener
 *
 * Simply Listen to scroll-to-end on provided DomElem (simulated by js scroll-position computing) and emit "reachEnd" event.
 *
 * @usage
 *
 * // default delayBeforeReact = 300
 * var reachEndListener = new ReachEndListener({ scrollerElement:$elem, delayBeforeReact:700 });
 *
 * reachEndListener.on('reachEnd', function(){})
 * reachEndListener.on('destroyed', function(){})
 * reachEndListener.destroy();
 */


var Emitter = require('nomocas-utils/lib/emitter');

function ReachEndListener(opt) {
	var scroller = this.scrollerElement = opt.scrollerElement;
	this.delayBeforeReact = opt.delayBeforeReact ||  300;
	var self = this,
		timeout;
	$(scroller).scroll(function() { // todo : use Vanilla
		if (scroller.offsetHeight + scroller.scrollTop == scroller.scrollHeight) {
			if (timeout)
				clearTimeout(timeout);
			timeout = setTimeout(function() {
				self.emit('reachEnd');
			}, self.delayBeforeReact);
		}
	});
}
ReachEndListener.prototype = new Emitter();

ReachEndListener.prototype.destroy = function() {
	$(this.scrollerElement).off('scroll'); // todo : use Vanilla
	this.emit('destroyed');
};

module.exports = ReachEndListener;
