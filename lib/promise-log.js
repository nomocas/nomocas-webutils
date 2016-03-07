/**
 * Promise API extension with .log and .logError. Usefull for debuging.
 * @return {[type]} [description]
 */
Promise.prototype.log = function() {
	var args = [].slice.call(arguments);
	return this.then(function(s) {
		args.push(s);
		console.log.apply(console, args);
		return s;
	}, function(e) {
		args.push(e);
		console.error.apply(console, args);
		throw e;
	});
};
Promise.prototype.logError = function() {
	var args = [].slice.call(arguments);
	return this.catch(function(e) {
		args.push(e);
		console.error.apply(console, args);
		throw e;
	});
};
