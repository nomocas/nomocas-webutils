/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * queryString parser
 */

var queryStringReg1 = /\+/g;

var module.exports = {
	parseQueryString: function(q) {
		var query = q;
		if (q[0] == "?")
			q = q.substring(1);
		q = q.replace(queryStringReg1, ' ');
		var x = q.split('&'),
			i, name, t, value, entry, output = {};
		for (i = 0, len = x.length; i < len; i++) {
			t = x[i].split('=', 2);
			if (t.length > 1)
				value = unescape(t[1]);
			else
				value = true;
			name = unescape(t[0]);
			utils.toPath(output, name, value, ".", true);
		}
		return output;
	},

	toQueryString: function(obj, prefix) {
		var str = [],
			env = null;
		if (obj.forEach)
			for (var i = 0, len = obj.length; i < len; ++i) {
				env = encodeURIComponent(obj[i]);
				str.push(encodeURIComponent(prefix) + ((env == "true") ? "" : ("=" + env)));
			} else
				for (var p in obj) {
					if (p == 'toString')
						continue;
					var k = prefix ? prefix + "." + p : p,
						v = obj[p];
					if (typeof v == "object")
						str.push(utils.toQueryString(v, k));
					else {
						env = encodeURIComponent(v);
						str.push(encodeURIComponent(k) + ((env == "true") ? "" : ("=" + env)));
					}
				}
		return str.join("&");
	}
};
