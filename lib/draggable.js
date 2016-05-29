function Draggable(opt) {
    this.selected = null;
    this.x_elem = 0;
    this.y_elem = 0; // Stores top, left values (edge) of the element;
    var self = this;
    var mouseUp = function(e) {
        if (self.selected) {
            var node = self.selected.node;
            node.style.position = self.selected.initialPosition;
            node.style.top = 0;
            node.style.left = 0;
            self.selected = null;
        }
    };
    var mouseMove = function(e) {
        if (self.selected) {
            if (!opt.axis || opt.axis === 'x')
                self.selected.node.style.left = (e.pageX - self.x_elem) + 'px';
            if (!opt.axis || opt.axis === 'y')
                self.selected.node.style.top = (e.pageY - self.y_elem) + 'px';
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

Draggable.prototype = {
    add: function(node) {
        if (typeof node === 'string')
            node = document.querySelector(node);
        var self = this,
            item = {
                node: node,
                initialPosition: node.style.position || 'static'
            },
            mouseDown = function(e) {
                self.selected = item;
                node.style.position = 'absolute';
                self.x_elem = e.pageX - node.offsetLeft;
                self.y_elem = e.pageY - node.offsetTop;
            };
        node.addEventListener('mousedown', mouseDown);
        this.destroyers.push(function() {
            node.removeEventListener('mousedown', mouseDown);
        });
    },
    destroy: function() {
        this.destroyers.forEach(function(d) { d(); });
    }
};

module.exports = Draggable;
