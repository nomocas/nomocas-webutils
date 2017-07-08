/*
 * @Author: Gilles Coomans
 */

/**
 * parse and insert html string in node and return created nodes
 * @param  {[type]} content     [description]
 * @param  {[type]} node        [description]
 * @param  {[type]} nextSibling [description]
 * @return {[type]}             [description]
 */
function insertHTML(content, node, nextSibling = null) {
	if (!content)
		return;

	// TODO: use this in place : still to catch iserted elements and manage buggy text nodes (when html start with text node)
	// if(nextSibling)
	// 	nextSibling.insertAdjacentHTML('beforebegin', content);
	// else
	// 	node.insertAdjacentHTML('beforeend', content)

	const div = document.createElement('div'),
		elems = [];
	let wrapped;
	if (content[0] !== '<') { // to avoid bug of text node that disapear
		content = '<p>' + content + '</p>';
		wrapped = true;
	}
	div.innerHTML = content;
	const parent = wrapped ? div.firstChild : div,
		childNodes = [].slice.call(parent.childNodes);
	let frag;
	if (nextSibling)
		frag = document.createDocumentFragment();
	for (let i = 0, len = childNodes.length, el; i < len; ++i) {
		el = childNodes[i];
		elems.push(el);
		(frag || node).appendChild(el);
	}
	if (nextSibling)
		node.insertBefore(frag, nextSibling);
	return elems;
}

/**
 * cast inner nod value depending on node value
 * @param  {DomElement} node [description]
 * @param  {String} type the needed type of the value
 * @return {*}     the casted value
 */
function castNodeValueTo(node, type) {
	switch (type) {
		case 'text':
			return node.textContent;
		case 'integer':
			return parseInt(node.textContent, 10);
		case 'html':
			return node.innerHTML;
		default:
			throw new Error('content editable casting fail : unrecognised rule : ', type);
	}
}

export default {
	insertHTML,
	castNodeValueTo
};

