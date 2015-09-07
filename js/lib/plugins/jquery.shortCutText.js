
(function($){
	/*
	 * shortCutText
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * メッセージ表示が長い場合に「・・・・・>>続きを読む」を表示して、メッセージを短縮する。
	 */

	$.shortCutText = function(opts, callback) {

		// デフォルト値
		$.shortCutText.defaults = {
			wrapselector : document,
			targetselector : ".js_shortCutText",
			lineWidth : 295, // 1行の幅
			minWordCount : 0, // １行に表示する最小文字数（この数値を大きくするとパフォーマンスが上がりますが、上げ過ぎると上手く動きません＞＜）
			showLineCount : 4, // 表示させる行数
			textLabel : '・・・・・>>続きを読む',
			isLink : true,
			isLinkBreak : false, // リンク部分を改行させるかどうか
			callbackfunc : undefined // 続きを読むをクリックした際のコールバック処理
		};
		
		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend($.shortCutText.defaults, opts);

		var textLabel = null
		,	minWordCount = null
		,	lineWidth = null
		,	minWordCount = null
		,	showLineCount = null
		,	isLink = null
		,	isLinkBreak = null
		,	callbackfunc = null;

		var init = function(target) {
			var text = target.text(),
				str = text.split(''),
				lineWidth = settings.lineWidth,
				minWordCount = settings.minWordCount,
				textLabel = settings.textLabel,
				showLineCount = settings.showLineCount,
				isLink = settings.isLink,
				isLinkBreak = settings.isLinkBreak,
				callbackfunc = settings.callbackfunc;

			// テキストを空にする
			target.empty();

			// 続きを見るのリンク
			var link = null;
			if (isLink) {
				link = $('<span class="js-continue" style="float: right"><a href="#">'+textLabel+'</a></span>');
			} else {
				link = $('<span class="js-continue">'+textLabel+'</span>');
			}

			target.append(link);
			var linkWidth = target.width();

			// テキストを空にする
			target.empty();

			var appendSpan = function() {
				var span = $('<span class="js-line"></span>');
				if (isLink) {
					span.css('float', 'left');
				}
				span.appendTo(target);
				return span;
			};

			var span = appendSpan();

			var lineNo = 1;
			for (var i=0, len=str.length; i<len; i++) {
				var s = str[i];
				/* ここから パフォーマンスチューニング用の設定
				   必ず１行に納まる想定の文字数を１度に追加してしまう。
				 */
				if (span.text().length < minWordCount) {
					if (i+minWordCount < str.length) {
						span.text(span.text()+text.substr(i, minWordCount));
						i = i+minWordCount-1;
					} else {
						span.text(span.text()+text.substr(i, str.length-i));
						i = i + (str.length-1-i);
					}
				} else {
					span.text(span.text()+s);
				}
				/* ここまで パフォーマンスチューニング用の設定  */
				// 最終行の場合
				if (lineNo === showLineCount) {
					var spanWidth = span.width();
					if (!isLinkBreak) {
						spanWidth = spanWidth + linkWidth;
					}
					if (lineWidth <= spanWidth) {
						if (isLinkBreak) {
							$('<br/>').appendTo(target);
						}
						link.appendTo(target);
						lineNo++;
						if (isLink) {
							link.click(function(e) {
								e.preventDefault();
								if (callbackfunc) {
									callbackfunc(target);
									return;
								} else {
									if(callbackfunc) {
										return;
									}
									target.empty().text(text);
									$(this).remove();
									return;
								}
							});
						}
						break;
					}
				} else {
					if (lineWidth <= span.width()) {
						$('<br/>').appendTo(target);
						span = appendSpan();
						lineNo++;
					}
				}
			}
			$('<br/>').appendTo(target);
		}

		// 処理開始
		$.customEach($(settings.wrapselector).find(settings.targetselector), {loop: function (idx, obj) {
			init($(obj));
		}, callback: callback
		});

	};

})(jQuery);

