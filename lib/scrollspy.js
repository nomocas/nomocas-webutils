var smoothscroll = require('./smoothscroll'),
	Emitter = require('nomocas-utils/lib/emitter');



/*
	sections = [nodes]
	currentIndex = 0;

	next : bullets[currenIndex].active = false; currentIndex++;  bullets[currenIndex].active = true; scrollTo(sections[currentIndex])
	previous : bullets[currenIndex].active = false; currentIndex--; if(currentIndex < 0) currentIndex = sections.length; sections[currenIndex].active = true;
	goTo : if(currentIndex === index) return; bullets[currentIndex].active = false; currentIndex = index; sections[currenIndex].active = false; 
 */




/* inspired from http://codepen.io/zchee/pen/ogzvZZ/ */
function ScrollSpy(sectionsParent, navParent) {
	// console.log('scroll spy : ', navParent, sectionsParent)
	this.sectionsParent = sectionsParent;
	this.navParent = navParent;
	this.currentIndex = 0;
	this.bullets = navParent.querySelectorAll('li');
	this.updateSections();
	var self = this;
	this._scrollChange = function() {
		var scrollPosition = self.sectionsParent.scrollTop;
		var index = -1;
		self.sections.some(function(section) {
			if (section.offset > scrollPosition)
				return true; // stop loop
			index++;
		});
		if (index === -1 || index === this.currentSection)
			return;
		self.goTo(index);
		self.emit('anchorChange');
	};
}

ScrollSpy.prototype = {
	startListening: function() {
		if (this.listening)
			return this;
		this.listening = true;
		this.sectionsParent.addEventListener('scroll', this._scrollChange);
		return this;
	},
	stopListening: function() {
		if (!this.listening)
			return this;
		this.listening = false;
		this.sectionsParent.removeEventListener('scroll', this._scrollChange);
		return this;
	},
	updateSections: function() {
		this.bullets = this.navParent.querySelectorAll('li');
		var sections = this.sections = [];
		[].forEach.call(this.sectionsParent.children, function(e) {
			if (e.tagName.toLowerCase() === 'section')
				sections.push({ anchor: e.id, offset: e.offsetTop });
		});
		// this.clearBullets();
		// this.selectFirst();
		return this;
	},
	clearBullets: function() {
		var active = this.navParent.querySelector('li.active');
		if (active)
			active.classList.remove('active');
	},
	selectFirst: function() {
		if (this.bullets[this.currentIndex])
			this.bullets[this.currentIndex].classList.remove('active');
		this.currentIndex = 0;
		if (this.bullets[0])
			this.bullets[0].classList.add('active');
		return this;
	},
	next: function() {
		this.bullets[this.currentIndex].classList.remove('active');
		this.currentIndex++;
		if (this.currentIndex >= this.bullets.length)
			this.currentIndex = 0;
		this.bullets[this.currentIndex].classList.add('active');
		return this;
	},
	previous: function() {
		this.bullets[this.currentIndex].classList.remove('active');
		this.currentIndex--;
		if (this.currentIndex < 0)
			this.currentIndex = this.bullets.length - 1;
		this.bullets[this.currentIndex].classList.add('active');
		return this;
	},
	goTo: function(index) {
		if (index === this.currentIndex)
			return this;
		if (this.bullets[this.currentIndex])
			this.bullets[this.currentIndex].classList.remove('active');
		this.currentIndex = index;
		this.bullets[this.currentIndex].classList.add('active');
		return this;
	}
};

for (var i in Emitter.prototype)
	ScrollSpy.prototype[i] = Emitter.prototype[i];

module.exports = ScrollSpy;
