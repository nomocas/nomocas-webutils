/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * I do not find anymore from where I took this code. If you recognize your code, I apologize... 
 * let me know... ;)
 */

var _uaMatch = function(ua) {
	ua = ua.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
	return {
		browser: match[1] || '',
		version: match[2] || '0'
	};
};

module.exports = function() {
	var browser = {},
		matched = _uaMatch(navigator.userAgent);
	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}
	if (browser.chrome)
		browser.webkit = true;
	else if (browser.webkit)
		browser.safari = true;
	return browser;
};
