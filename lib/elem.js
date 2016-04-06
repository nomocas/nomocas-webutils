/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * absolutly minimalistic dom element utils.
 * mainly there to have small but useful js-to-dom-element tools.
 */




function elem(name, attrMap, children, eventsHandlers) {
	var el = document.createElement(name);
	if (attrMap)
		for (var i in attrMap)
			if (i === 'class')
				el.classList.add(attrMap[i]);
			else
				el.setAttribute(i, attrMap[i]);
	if (children)
		children.forEach(function(child) {
			child = typeof child === 'string' ? document.createTextNode(child) : child;
			el.appendChild(child);
		});
	if (eventsHandlers)
		for (var i in eventsHandlers)
			el.addEventListener(i, eventsHandlers[i]);
	return el;
}

function show(el) { el.style.display = 'block'; }

function hide(el) { el.style.display = 'none'; }

module.exports = {
	elem: elem,
	show: show,
	hide: hide
};
