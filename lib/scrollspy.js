/* inspired from http://codepen.io/zchee/pen/ogzvZZ/ */
function ScrollSpy(sectionsParent, navParent) {
	this.sectionsParent = sectionsParent;
	var self = this;
	this.update();
	navParent.firstChild.nextSibling.classList.add('active');
	sectionsParent.addEventListener('scroll', function() {
		var scrollPosition = sectionsParent.scrollTop;
		for (var i in self.sections) {
			if (self.sections[i] <= scrollPosition) {
				var el = navParent.querySelector('.active');
				if (el)
					el.classList.remove('active');
				el = navParent.querySelector('li[rel*=' + i + ']');
				if (el)
					el.classList.add('active');
			}
		}
	});

	this._hashChange = function(e) {
		self.scrollTo(window.location.hash.substring(1));
	};

}

ScrollSpy.prototype = {
	scrollTo: function(id) {
		var self = this;
		setTimeout(function() {
			console.log('scrollspy timeoyut : ', self.sectionsParent.scrollTop)
			self.sectionsParent.scrollTop = self.sections[id];
		}, 1);
	},
	startListening: function() {
		if (this.listening)
			return;
		this.listening = true;
		window.addEventListener('hashchange', this._hashChange);
	},
	stopListening: function() {
		if (!this.listening)
			return;
		this.listening = false;
		window.removeEventListener('hashchange', this._hashChange);
	},
	update: function() {
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
