(function($){
	/*
	 * tableSort
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 */
	// デフォルト値
	var options = {
		targetselector : '.js-sort'
	};

	$.fn.tableSort = function(opts) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(options, opts);

		var table = $(this),
			sortOrder = 1;

		// ソート
		table.find(settings.targetselector).each(function(){
			$(this).click(function(e) {
				e.preventDefault();

				var self = $(this),
					type = self.data('type'),
					col = self.index();

				// 行全体を取得
				var rows = $('tbody>tr');

				rows.sort(function(a, b) {
					return compare(a, b, type, col) * sortOrder;
				});

				// tbodyを並び替えた行全体で入れ替え
				$('tbody').empty().append(rows);

				sortOrder *= -1;

				table.find(settings.targetselector).find('span').empty();
				var arrow = sortOrder === 1 ? '▲' : '▼';
				self.find('span').text(arrow);
			});
		});

		function compare(a, b, type, col) {
			var _a = $(a).find('td').eq(col).text();
			var _b = $(b).find('td').eq(col).text();

			if (type === 'string') {
				if(_a < _b) {
					return -1;
				}
				if(_b < _a) {
					return 1;
				}
				return 0;
			} else {
				_a *= 1;
				_b *= 1;
				return _a - _b;
			}
		}

		return this;
	};
})(jQuery);

