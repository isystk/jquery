(function($){
	/**
	 * Jquery プラグイン プレビュー表示
	 * 
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 */
	$.showPreview = function(callback){

		// すべてのリンクを無効にする。
		$('a').attr('href', '#');
		
		// 透明なフィルター
		var winDimension = ___getPageSize();
		var blockView = $('<div id="blockView"></div>')
			.addClass('dispOnly')
			.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});
		blockView.appendTo('body');
		
		$(window).resize(function(){
			var winDimension = ___getPageSize();
			blockView.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});
		});

		/**
		 * getPageSize() by hisasann.com
		 *
		 */
		function ___getPageSize() {
			// スクロール領域を含むwidth
			var pageWidth  = 0;
			if ($.browser.safari) {
				pageWidth = document.body.scrollWidth;
			} else {
				pageWidth = document.documentElement.scrollWidth;
			}

			// スクロール領域を含むheight
			var pageHeight = 0;
			if ($.browser.safari) {
				pageHeight = document.body.scrollHeight;
			} else {
				pageHeight = document.documentElement.scrollHeight;
			}

			// 画面に表示されている領域のwidth
			var windowWidth = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

			// 画面に表示されている領域のheight
			var windowHeight = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;

			return {
				pageWidth: pageWidth, pageHeight: pageHeight,
				winWidth: windowWidth, winHeight: windowHeight
			};
		}

		if (_.isFunction(callback)) {
			callback();
		}
	};
})(jQuery);


