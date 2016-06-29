/**
 * Simple DOM Elements dragger
 */

var Emitter = require('nomocas-utils/lib/emitter');

/*
Events : dragStart, dragStarted, dragMove, dragEnd
 */
function totalScrollTop(node) {
    var total = 0;
    while (node) {
        if (node.scrollTop)
            total += node.scrollTop;
        node = node.parentNode;
    }
    return total;
}

function Draggable(opt) {
    this.draggedElem = null;
    this.x_elem = 0;
    this.y_elem = 0; // Stores top, left values (edge) of the element;
    var self = this;
    var mouseUp = function(e) {
        if (self.draggedElem) {
            var node = self.draggedElem.node;
            node.style.position = self.draggedElem.initialPosition;
            node.style.top = 0;
            node.style.left = 0;
            self.emit('dragEnd', e, node, self.draggedElem.data);
            node.classList.remove('is-dragging');
            self.draggedElem = null;
        }
    };
    var mouseMove = function(e) {
        if (self.draggedElem) {
            var draggedElem = self.draggedElem;
            var node = draggedElem.node;
            if (!opt.axis || opt.axis === 'x')
                node.style.left = (e.pageX /*- node.parentNode.parentNode.scrollLeft*/ - self.x_elem) + 'px';
            if (!opt.axis || opt.axis === 'y')
                node.style.top = (e.pageY - self.y_elem) + 'px'; // + totalScrollTop(node)
            self.emit('dragMove', e, node, draggedElem.data);
        }
    }
    document.body.addEventListener('mouseup', mouseUp);
    document.body.addEventListener('mousemove', mouseMove);
    this.destroyers = [
        function() {
            document.body.removeEventListener('mouseup', mouseUp);
            document.body.removeEventListener('mousemove', mouseMove);
        }
    ];
}

Draggable.prototype = new Emitter();

var proto = {
    addAll: function(nodes) {
        if (typeof nodes === 'string')
            nodes = document.querySelectorAll(nodes);
        [].forEach.call(nodes, this.add, this);
    },
    add: function(node, data) {
        if (typeof node === 'string')
            node = document.querySelector(node);
        var self = this,
            item = {
                node: node,
                data: data,
                initialPosition: node.style.position || 'relative'
            },
            timeout,
            mouseDown = function(e) {
                if (!!self.enabled)
                    timeout = setTimeout(function() {
                        if (self.upper !== node) {
                            if (self.upper)
                                self.upper.style.zIndex = 0;
                            self.upper = node;
                            self.upper.style.zIndex = 150;
                        }
                        if (document.selection)
                            document.selection.empty();
                        else if (window.getSelection)
                            window.getSelection().removeAllRanges();
                        node.classList.add('is-dragging');
                        self.emit('dragStart', e, node, data);
                        self.draggedElem = item;
                        // console.log('mouse down : ', node.offsetTop, node.offsetParent.offsetTop, node.getBoundingClientRect());
                        self.x_elem = e.pageX - (node.offsetLeft); // + node.parentNode.offsetLeft);
                        self.y_elem = e.pageY - (node.offsetTop); // + node.parentNode.offsetTop);
                        // console.log('start drag : ', node.parentNode.parentNode.scrollTop, e.pageY, node.parentNode.offsetTop, node.offsetTop, self.y_elem)
                        node.style.left = (e.pageX /*- node.parentNode.parentNode.scrollLeft */ - self.x_elem) + 'px';
                        node.style.top = (e.pageY /*-node.parentNode.parentNode.scrollTop */ - self.y_elem) + 'px';
                        node.style.position = 'absolute';
                        self.emit('dragStarted', e, node, data);
                    }, 500);
            },
            mouseUp = function(e) {
                clearTimeout(timeout);
            };
        node.addEventListener('mousedown', mouseDown);
        node.addEventListener('mouseup', mouseUp);
        node.addEventListener('mousemove', mouseUp);
        this.destroyers.push({
            node: node,
            destroyer: function() {
                node.removeEventListener('mousedown', mouseDown);
                node.removeEventListener('mouseup', mouseUp);
                node.removeEventListener('mousemove', mouseUp);
                self.emit('dragDestroy', node, data);
            }
        });
    },
    remove: function(node) {

        for (var i = 0, len = this.destroyers.length, d; i < len; ++i) {
            d = this.destroyers[i];
            if (d.node === node) {
                d.destroyer();
                this.destroyers.splice(i, 1);
                break;
            }
        }
    },
    destroy: function() {
        this.destroyers.forEach(function(d) {
            if (d.node) d.destroyer();
            else d();
        });
    }
};

for (var i in proto)
    Draggable.prototype[i] = proto[i];
module.exports = Draggable;


/*
Usage :

<div>
    <div class="your-draggable-item-class">hello world a</div>
    <div class="your-draggable-item-class">hello world b</div>
    <div class="your-draggable-item-class">hello world c</div>
    <div class="your-draggable-item-class">hello world d</div>
</div>


var draggable = new Draggable({
    axis: 'y' // optional. x| y
});

draggable.addAll('.your-draggable-item-class');

// late addition of unique node : 
draggable.add(node | selector, ?associatedData);

 */
