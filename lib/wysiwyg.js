// Inspired from http://codepen.io/barney-parker/pen/idjCG
// https://www.barneyparker.com/world-simplest-html5-wysisyg-inline-editor/
// more : https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Introduction


/*
	Todo : 

	- 	add on('setAnchor', function(e){
			e.detail.anchor
		})

		to set clickTo depending on href by example


	- 	Add guard to check when click/doubleclick/... if contentEditable === true
 */

var Emitter = require('nomocas-utils/lib/emitter');

function elem(name) {
	return document.createElement(name);
}

// full info on actions list there : https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
// more : https://w3c.github.io/editing/execCommand.html
var defaultActions = [

	/* those below are tested and ok */

	'undo',
	'redo',
	'bold',
	'italic',
	'insertUnorderedList',
	'insertOrderedList',
	'createLink',
	'unlink'

	/* those below are untested or buggy */
	/* in fact as I just need a minimal wysiwyg : I don't need them. */
	/* if you want to try : simply uncomment. */

	// 'underline',
	// 'strikeThrough',
	// 'justifyLeft',
	// 'justifyCenter',
	// 'justifyRight',
	// 'justifyFull',
	// 'indent',
	// 'outdent',
	// 	'h1',
	// 'h2',
	// 'p',
	// 'subscript',
	// 'superscript',
];

// It uses fontawesome icons by default. could be changed by providing custom iconsSet when producing menu.
// each string value will be outputed as <i class="STRING_VALUE"></i> and each function will provide its output
var defaultIconsSet = {
	undo: 'fa fa-undo',
	redo: 'fa fa-repeat',
	bold: 'fa fa-bold',
	italic: 'fa fa-italic',
	insertUnorderedList: 'fa fa-list-ul',
	insertOrderedList: 'fa fa-list-ol',
	'createLink': 'fa fa-link',
	'unlink': 'fa fa-unlink'


	// underline: 'fa fa-underline',
	// strikeThrough: 'fa fa-strikethrough',
	// justifyLeft: 'fa fa-align-left',
	// justifyCenter: 'fa fa-align-center',
	// justifyRight: 'fa fa-align-right',
	// justifyFull: 'fa fa-align-justify',
	// indent: 'fa fa-indent',
	// outdent: 'fa fa-outdent',

	// h1: function() {
	// 	return 'h<sup>1</sup>';
	// },
	// h2: function() {
	// 	return 'h<sup>2</sup>';
	// },
	// // p: function() {
	// // 	return 'p';
	// // },
	// subscript: 'fa fa-subscript',
	// superscript: 'fa fa-superscript'
};

// var eventsToBind = ['keyup', 'paste', 'cut'];

function moveMenuToSelection() {
	var menu = Wysiwyg.menuInstance;
	if (!menu)
		return;
	var rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
	menu.style.left = (rect.left + rect.width / 2) + 'px';
	menu.style.top = (rect.bottom + 8) + 'px';
	menu.style.display = 'block';
	// console.log('menu moved : ', rect.top, rect.left, menu)
}

function Wysiwyg(editedNode) {
	this.editedNode = (typeof editedNode === 'string') ? document.querySelector(editedNode) : editedNode;
	this._value = this.editedNode.innerHTML;
	var self = this,
		willBlur = null,
		willHideMenu = null,
		blur = function(e) {
			willBlur = setTimeout(function() {
				// console.log('blur', Wysiwyg.fromFormat, window.getSelection().toString())
				if (Wysiwyg.currentlyFocused === self)
					Wysiwyg.currentlyFocused = null;
				self.clean();
				self.update();
			}, 10);
		},
		focus = function(e) {
			// console.log('focus', Wysiwyg.fromFormat, window.getSelection().toString())
			Wysiwyg.currentlyFocused = self;
			clearTimeout(willBlur);
		},
		// double click on editedNode : center menu on selection
		dblclick = function(e) {
			// console.log('dblclick : ', Wysiwyg.fromFormat, window.getSelection().toString())
			clearTimeout(willHideMenu);
			moveMenuToSelection();
		},
		mouseUp = function() {
			// console.log('mouseUp', sel.toString())
			if (window.getSelection().toString()) {
				clearTimeout(willHideMenu);
				moveMenuToSelection();
			}
		},
		click = function() {
			// console.log('mouse down', Wysiwyg.menuInstance.style.display, window.getSelection().toString())
			if (Wysiwyg.menuInstance.style.display !== 'none' && !window.getSelection().toString())
				willHideMenu = setTimeout(function() {
					Wysiwyg.menuInstance.style.display = 'none';
				}, 300)
		};
	// eventsToBind.forEach(function(e) {
	// 	self.editedNode.addEventListener(e, update);
	// });
	// editedNode.addEventListener('focus', focus);
	editedNode.addEventListener('blur', blur);
	editedNode.addEventListener('focus', focus);
	editedNode.addEventListener('dblclick', dblclick);
	editedNode.addEventListener('mouseup', mouseUp);
	editedNode.addEventListener('click', click);

	this._destroyer = function() {
		// eventsToBind.forEach(function(e) {
		// 	self.editedNode.removeEventListener(e, update);
		// });
		editedNode.removeEventListener('focus', focus);
		editedNode.removeEventListener('blur', blur);
		editedNode.removeEventListener('dblclick', dblclick);
		editedNode.removeEventListener('mouseup', mouseUp);
		editedNode.removeEventListener('click', click);
	};
}

Wysiwyg.prototype = new Emitter();
// check value change : dispatch event
Wysiwyg.prototype.update = function() {
	var val = this.editedNode.innerHTML;
	if (val === this._value)
		return;
	this._value = val;
	var evt = new CustomEvent('update', {
		detail: {
			value: val,
			node: this.editedNode,
			wysiwyg: this
		}
	});
	this.emit('update', evt);
};
// get or update html content. do not dispatch event
Wysiwyg.prototype.html = function(value) {
	if (!arguments.length)
		return this.editedNode.innerHTML;
	this.editedNode.innerHTML = value;
};
Wysiwyg.prototype.destroy = function(value) {
	if (this._destroyer)
		this._destroyer();
	this._destroyer = this._value = this.editedNode = null;
	if (Wysiwyg.currentlyFocused === this)
		Wysiwyg.currentlyFocused = null;
};
Wysiwyg.prototype.clean = function() {
	Wysiwyg.cleanHTML(this.editedNode);
	return this;
};

function refocus() {
	if (Wysiwyg.currentlyFocused && Wysiwyg.currentlyFocused.editedNode !== document.activeElement)
		Wysiwyg.currentlyFocused.editedNode.focus();
}

/**
 * apply specified action  (bold, italic, ...) to current selection in any contentEditable node.
 * @param  {String} action the action to apply
 * @return {Void}        
 */
Wysiwyg.format = function(action) {
	switch (action) {
		case 'h1':
		case 'h2':
		case 'p':
			document.execCommand('formatBlock', false, action);
			break;
		case 'createLink':
			document.execCommand('createLink', false, null); // providing url here doesn't work
			// We need a hack to force the href.
			// It seems that focus node (correctly wrapped with anchor with href at this point) 
			// will be rewrapped with another anchor (without href) somehow after.
			// Wait one ms to get final wrapping anchor.
			var sel = window.getSelection(),
				focus = sel.focusNode;
			setTimeout(function() {
				var parent = focus;
				// catch 'a' before (should be an ancestor)
				while (parent && parent.tagName !== 'A')
					parent = parent.parentNode;
				if (parent)
					parent.setAttribute('href', '/bloupi/goldberg');
				refocus();
			}, 1);
			return;
		default:
			document.execCommand(action, false, null);
			break;
	}
	refocus();
};

Wysiwyg.currentlyFocused = null;

/*
 * Wysiwyg.menu : by default : Produce and return a tools menu as : <ul class="wysiwyg-menu"><li><button><i class="fa fa-xxx"></i></button></li>...</ul>.
 * Each 'button' tag will have its 'click' handler binded to associated action.
 * Still just to append returned 'ul' somewhere.
 * (it uses iconsSet map above to produce icons or custom output)
 *
 *
 * Placement bug : for the moment
 */
Wysiwyg.menu = function(options) {
	options = options || {};
	var ul = elem('ul'),
		actions = options.actions || defaultActions;

	ul.classList.add(options.menuClass ||  'wysiwyg-menu');
	actions.forEach(function(action) {
		var li = elem('li'),
			button = elem('button'),
			icon = options.iconsSet || defaultIconsSet[action];
		if (typeof icon === 'function')
			button.innerHTML = icon(action);
		else {
			var i = elem('i'),
				splitted = icon.split(/\s+/);
			splitted.forEach(function(cl) {
				i.classList.add(cl);
			});
			button.appendChild(i);
		}
		button.addEventListener('click', function(e) {
			Wysiwyg.format(action);
		});
		li.appendChild(button);
		ul.appendChild(li);
	});

	document.body.addEventListener('click', function(e) {
		var menu = e.target;
		while (menu && menu !== ul && menu !== (Wysiwyg.currentlyFocused && Wysiwyg.currentlyFocused.editedNode))
			menu = menu.parentNode;
		if (!menu)
			ul.style.display = 'none';
	});

	Wysiwyg.menuInstance = ul;
	return ul;
};

/*
 * Clean produced HTML (to avoid differences from browsers implementations).
 * Provide minimal html. (no p, div or span. no empty node or node that only contain <br>. no styles.)
 * Still a (unresolved) bug : sometimes an additional <br> is added.
 */
var replacedByContent = /^(?:SPAN|P|DIV)$/,
	needBR = /^(?:P|DIV)$/;

Wysiwyg.cleanHTML = function(node) {
	// copy childNodes because original will be modified through procedure below
	var childNodes = [].slice.call(node.childNodes);
	for (var i = 0, len = childNodes.length; i < len; ++i) {
		var child = childNodes[i];

		// not for text nodes or br
		if (!child.tagName || child.tagName === 'BR')
			continue;

		// if tag should be replaced by its content (if any). 
		if (replacedByContent.test(child.tagName)) {

			if (needBR.test(child.tagName)) // for div and  p : insert br before child (as div and p effect).
				node.insertBefore(elem('br'), child);

			// if there is something interesting in child
			if (child.textContent) {
				// recursion to clean sub contents before
				Wysiwyg.cleanHTML(child);

				// insert child's children before child.
				// copy childNodes because it will be emptied child by child
				var children = [].slice.call(child.childNodes);
				for (var j = 0, lenj = children.length; j < lenj; ++j)
					node.insertBefore(children[j], child);
			}

			// remove div or p or span
			node.removeChild(child);
		}
		// for any other tag (but BR) :
		// if it has no text children ==> it contains a br somewhere (rule tested from FF, Chrome & Safari)
		// simply replace it with a br
		else if (!child.textContent) {
			if (child.childNodes.length)
				node.insertBefore(elem('br'), child);
			else
				console.warn('wysiwyg : child with no childNodes !!!!');
			node.removeChild(child);
		}
		// or clean inner html and remove style attribute
		else {
			Wysiwyg.cleanHTML(child);
			// remove any style attribute
			if (child.getAttribute('style'))
				child.removeAttribute('style');
		}
	}
	return node;
};

module.exports = Wysiwyg;



/*
	YAMVISH example :

	document.getElementById('app').innerHTML = '';


y()
    .newContext()
    .dom(function(context, node) {
        node.appendChild(y.Wysiwyg.menu());
    })
    .button('toggle edit', y().click(function(e){ this.toggle('edit'); }))
    .div(
        y().attr('contenteditable', '{{ !!edit }}')
        .html('hello world</i> <b>bloupi</b>')
        .dom(function(context, node) {
            var wysiwyg = new y.Wysiwyg(node);
            wysiwyg.on('update', function(e) {
                console.log('wysiwyg update : ', e.detail.value);
            });
        })
    )
    .div(
        y().attr('contenteditable', '{{ !!edit }}')
        //.cl('editor')
        .text('hello world')
        .dom(function(context, node) {
            var wysiwyg = new y.Wysiwyg(node);
            wysiwyg.on('update', function(e) {
                console.log('wysiwyg update 2 : ', e.detail.value)
            });
        })
    )
    .toContainer()
    .mount('#app');



 */
