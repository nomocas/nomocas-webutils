/**
 * User agent parser.
 * I do not find anymore from where I found on the web this (clean) code. If you recognize yours, I apologize...
 * let me know... ;)
 */

module.exports = function(ua) {
	ua = ua.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [],
		browser = match[1] || null,
		matched = {
			browser: browser,
			version: match[2] || '0'
		};

	if (matched.browser)
		matched[matched.browser] = true;
	if (matched.chrome)
		matched.webkit = true;
	else if (matched.webkit)
		matched.safari = true;
	return matched;
};
