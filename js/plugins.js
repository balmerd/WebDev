// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// add extensions here

String.prototype.format = function () {
	// usage: var str = '{0} and {1} and {2}';
	// console.log(str.format(99, 'yes', true));
	var i, re, s = this;
	if (!String.prototype.format.cache) {
		String.prototype.format.cache = {};
	}
	for (i = 0; i < arguments.length; i++) {
		if (!String.prototype.format.cache[i]) {
			String.prototype.format.cache[i] = new RegExp('\\{' + (i) + '\\}', 'g');
		}
		re = String.prototype.format.cache[i];
		s = s.replace(re, arguments[i]);
		re = null;
	}
	return s;
};

String.prototype.isEmpty = function () {
	return ($.trim(this).length <= 0);
};

String.prototype.isNotEmpty = function () {
	return (this.isEmpty() === false);
};

function registerNamespace(ns) {
	var i;
	var root = window;
	var nsParts = ns.split('.');
	for (i = 0; i < nsParts.length; i++) {
		if (typeof root[nsParts[i]] === 'undefined') {
			root[nsParts[i]] = {};
		}
		root = root[nsParts[i]];
	}
}

// place any jQuery/helper plugins in here, instead of separate, slower script files.

