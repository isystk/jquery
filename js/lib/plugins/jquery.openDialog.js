(function($){
/*
 * openDialog
 *
 * Options:
 * url - URL
 * name - window名
 * style - ポップアップスタイル（例："width=700,height=450,resizable=no,scrollbars=no,status=no,toolbar=no"）
 *
 * Description:
 * window.openのラッパー
 * 戻り値に開いたwindowを返します
 */
$.openDialog = function(options) {
	var p = new Dialog();
	jQuery.extend(p.options, options);
	p.window = window.open(p.options.url, p.options.name, p.options.style);
	return p;
};

var Dialog = function() {};
Dialog.prototype = {
	window: null,
	options: {
		url: null,
		name: null,
		style: null
	},
	close: function() {
		this.window.close();
	}
}

})(jQuery);
