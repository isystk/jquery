(function($) {

	/*
	 * mynaviPushState
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * Ajaxを利用した画面遷移の際のURL履歴管理
	 *
	 * Sample:
	 * 	$.mynaviPushState({callback: function() {
	 * 		// ここでイベントをバインド
	 * });
	 *
	 */
	
	var defaults = {
		target: '#js-contents', 
		callback: null
	};
	
	$.mynaviPushState = function(options){

		var settings = $.extend(defaults, options);
		
		var target = settings.target,
			callback = settings.callback;

		var isFirst = true;
		
		// 履歴管理
		return (function() {
			var contents = {},
				count =0;
			
			$(window).on('popstate', function(jqevent) {
				var state = jqevent.originalEvent.state;
				if (state === null) {
					return;
				}

				if (isFirst) {
					return;
				}

				$(target).html(contents[state]);
				
				if (callback) {
					callback();
				}
			});

			contents[count] = $(target).html();

			return new function() {
				this.pushState = function(url) {
			    	// IE8では未対応
			    	if (!window.history.pushState) {
			    		return;
			    	}
			    	if (count === 0) {
			    		history.pushState(count, '', location.href);
			    	}
		    		count++;
		    		history.pushState(count, '', url);
		    		contents[count] = $(target).html();
		    		isFirst = false;
				}
			};
		})();

	};
})(jQuery);

