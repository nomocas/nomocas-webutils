var map;
if (typeof navigator !== 'undefined')
	map = {
		isServer: false,
		isBrowser: true,
		isMac: navigator.platform.indexOf('Mac') > -1,
		isWin: navigator.platform.indexOf('Win') > -1,
		isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
		isIOS: navigator.platform.match(/(iPhone|iPod|iPad)/i) ? true : false,
		isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	};
else map = {
	isServer: true,
	isBrowser: false
};

module.exports = map;

