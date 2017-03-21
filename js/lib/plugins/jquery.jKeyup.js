
(function($) {
/*
 * jKeyup
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Options:
 * 　callback
 *
 * Description:
 * 　Windows:Operaは全角文字入力時にkeyup、keydown、keypressが発生しないので
 * 　その差分を吸収します。
 * 　callbackの第1引数にtextのvalue、第2引数にOpera以外の場合はeventを渡します。
 */

$.fn.jKeyup = function(fn) {
	init($(this), fn);
};

function init(elem, fn) {
	var jkeyup = new jKeyup();
	jkeyup.callback = fn ? fn : function() {};
	jkeyup.elem = elem;

	prevent(jkeyup);
}

function prevent(s) {
	var elem = s.elem;

	// Operaの場合はTimerで監視
	if ($.browser.opera) {
		elem.focus(function(event) {
				var val = "";
				s.interval = setInterval(function() {
					if (val != elem.val()) {
						val = elem.val();
						s.callback.call(elem, val);
					}
				}, 100);
			})
		.blur(function(event) {
				clearInterval(s.interval);
			});
	} else {
		elem.keyup(function(event) {
			s.callback.call(elem, elem.val(), event);
		});
	}
}

function jKeyup() {}
jKeyup.prototype = {
	elem: null, callback: null, interval: null
}

})(jQuery);
