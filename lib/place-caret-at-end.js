// from : http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser/4238971#4238971
// IE9+ compliant.
// works on contentEditable and inputs and text areas.
module.exports = function placeCaretAtEnd(el) {
	el.focus();
	var range = document.createRange();
	range.selectNodeContents(el);
	range.collapse(false);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
};
