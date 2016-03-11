if (typeof navigator !== 'undefined')
	module.exports = {
		isMac: navigator.platform.indexOf('Mac') > -1,
		isWin: navigator.platform.indexOf('Win') > -1,
		isMacLike: navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false,
		isIOS: navigator.platform.match(/(iPhone|iPod|iPad)/i) ? true : false,
		isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	};
else module.exports = {};
