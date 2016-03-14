var smoothscroll = require('./smoothscroll');

/* inspired from http://codepen.io/zchee/pen/ogzvZZ/ */
function ScrollSpy(sectionsParent, navParent) {
	this.sectionsParent = sectionsParent;
	this.navParent = navParent;
	var self = this;
	this.updateSections();
	this._scrollChange = function() {
		var scrollPosition = self.sectionsParent.scrollTop;
		for (var i in self.sections) {
			if (self.sections[i] <= scrollPosition) {
				var el = self.navParent.querySelector('.active');
				if (el)
					el.classList.remove('active');
				el = self.navParent.querySelector('li[rel*=' + i + ']');
				if (el)
					el.classList.add('active');
			}
		}
	};
}

ScrollSpy.prototype = {
	startListening: function() {
		if (this.listening)
			return;
		this.listening = true;
		this.sectionsParent.addEventListener('scroll', this._scrollChange);
	},
	stopListening: function() {
		if (!this.listening)
			return;
		this.listening = false;
		this.sectionsParent.removeEventListener('scroll', this._scrollChange);
	},
	updateSections: function() {
		var sections = this.sectionsParent.children,
			self = this;
		this.sections = {};
		[].forEach.call(sections, function(e) {
			if (e.tagName.toLowerCase() === 'section')
				self.sections[e.id] = e.offsetTop;
		});
	}
};

module.exports = ScrollSpy;
