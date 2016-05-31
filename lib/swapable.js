/**
 * Swapable : reorder childNodes with drag
 */

var Draggable = require('./draggable');

function swapGeom(arr, geo1, geo2) {
	// swap in array
	arr[geo1.index] = geo2;
	arr[geo2.index] = geo1;

	// swap indexes
	var tempIndex = geo2.index;
	geo2.index = geo1.index;
	geo1.index = tempIndex;
}

// Events : dragStart, dragStarted, dragMove, dragEnd, nodesSwapped
var Swapable = function(opt) {
	Draggable.call(this, opt);
	var container = opt.container;
	if (typeof opt.container === 'string')
		container = document.querySelector(container);
	this.container = container;
	this.geometry = [];
	this.dragged = null;
	this.offsetTop = 0;
	this.fakeNode = document.createElement('div');
	this.fakeNode.classList.add('swapable-fake-node');
	var self = this;
	this.on('dragStart', this.dragStart);
	this.on('dragMove', this.dragMove);
	this.on('dragEnd', this.dragEnd);
	this.destroyers.push(function() {
		self.geometry = null;
		self.fakeNode = null;
		self.dragged = null;
		self.container = null;
	});
}

Swapable.prototype = new Draggable();
var proto = {
	add: function(node, data) {
		if (typeof node === 'string')
			node = document.querySelector(node);
		Draggable.prototype.add.call(this, node, data);
		this.geometry.push({
			item: node,
			data: data,
			index: this.geometry.length
		});
	},
	dragStart: function(e, itemNode, data) {
		// initGeometry
		this.resetGeometry();
		// console.log('drag start : ', this.geometry);
		// find dragged descriptor
		this.dragged = null;
		var self = this;
		this.geometry.forEach(function(geo) {
			if (geo.item === itemNode)
				self.dragged = geo;
		});
		if (!this.dragged)
			throw new Error('Swapable : dragged element not added before. aborting dragStart.');
		// insert fakeNode with same size than dragged just after dragged
		this.fakeNode.style.height = this.dragged.height + 'px';
		this.container.insertBefore(this.fakeNode, this.dragged.item.nextSibling);
	},
	dragMove: function(e, itemNode, data) {
		var ok = this.checkGeometry(this.dragged, e.pageX, e.pageY);
		if (!ok)
			return;
		if ((this.dragged.index < ok.matched.index && !ok.midMatched) || (this.dragged.index > ok.matched.index && ok.midMatched)) {
			this.swapNodes(this.fakeNode, ok.matched.item);
			swapGeom(this.geometry, this.dragged, ok.matched);
			this.emit('nodesSwapped', this.dragged, ok.matched);
		}
	},
	dragEnd: function(e, itemNode, data) {
		// insert dragged node just after fake one
		this.container.insertBefore(this.dragged.item, this.fakeNode.nextSibling);
		// remove fake
		this.container.removeChild(this.fakeNode);
	},
	resetGeometry: function() {
		var geom = this.geometry;
		this.offsetTop = this.container.getBoundingClientRect().top;
		geom.forEach(function(geo) {
			var top = geo.item.offsetTop,
				height = geo.item.offsetHeight;
			geo.offset = 0;
			geo.height = height;
			geo.top = top;
			geo.mid = top + (height / 2);
			geo.bottom = top + height;
		});
	},
	checkGeometry: function(dragged, pageX, pageY) {
		var matched,
			midMatched,
			self = this,
			y = pageY - (this.offsetTop + window.scrollY),
			ok = this.geometry.some(function(geo) {
				if (geo === dragged || y < geo.top)
					return false;
				matched = geo;
				if (y < geo.mid) {
					midMatched = true;
					return true;
				}
				if (y < geo.bottom)
					return true
				return false;
			});
		if (ok)
			return { matched: matched, midMatched: midMatched };
		return null;
	},
	swapNodes: function(a, b) {
		// swap dom nodes in DOM tree
		var nextSibling = a.nextSibling;
		this.container.insertBefore(a, b.nextSibling);
		this.container.insertBefore(b, nextSibling);
	}
};
for (var i in proto)
	Swapable.prototype[i] = proto[i];
module.exports = Swapable;

/*
Usage :

<div class="your-container-class">
    <div class="your-swapable-item-class">hello world a</div>
    <div class="your-swapable-item-class">hello world b</div>
    <div class="your-swapable-item-class">hello world c</div>
    <div class="your-swapable-item-class">hello world d</div>
</div>


var swapable = new Swapable({
    axis: 'y', // optional. x| y
    container:'.your-container-class'
});

swapable.addAll('.your-swapable-item-class');

// late addition of unique node : 
swapable.add(node | selector);

swapable.on('nodesSwapped', function(descriptor1, descriptor2){
	// descriptor.item is DOMElement
})

 */
