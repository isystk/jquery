;(function($) {
	/*
	 * mynavislider *
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像スライダー
	 *
	 * Sample:
	 * $('#thumbs').mynavislider({
	 * 	'easing': 'easeInOutCirc'
	 * ,	'duration': 150
	 * ,	'shift':	5
	 * });
	 */
	$.fn.mynavislider = function(options) {

		var screen = null
			,	ul = null
			,	li = null
			,	back = null // 前ページボタン
			,	next = null // 次ページボタン
			,	pos = 0 // 画像のポジション
			,	pageNo = 1 // 現在のページ番号
			,	maxPageNo = 1 // 最大のページ番号
			,	liwidth = 0 // 子要素の横幅
			,	shiftw = 0 // １ページにスライドさせる幅
			,	nowLoading = false // 処理中かどうか
			,	dragw = 0 // スワイプした横幅
			,	dispCount = 0; // １ページに表示する子要素の件数

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		// jQueryオブジェクトキャッシュ、移動量の初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			dispCount = params.dispCount || params.shift;

			if (params.shiftw) {
				liwidth = Math.ceil(params.shiftw/params.shift);
				shiftw = params.shiftw;
			} else {
				liwidth = li.width();
				shiftw = liwidth * params.shift;
			}
			maxPageNo = Math.ceil(li.size()/params.shift);

			// １画像の場合はスライド不要の為、ローテートは強制OFFとする。
			if (maxPageNo <= 1) {
				params.carousel = false;
			}

			if (params.carousel) {
				// カルーセルの初期設定を行う
				initCarousel();
				pos = li.size()/2;
			} else {
				// ページングボタンの表示制御
				showArrows();
				pos = params.shift;
			}

			// ulタグの横幅を調整する
			ul.css('width', shiftw * li.size() / params.shift)
				.css('position', 'relative');

			li.css('float', 'left');

			// マウスドラッグでのページングを可能にする
			if (params.isMouseDrag) {
				bindMouseDragEvent();
			}

			// マウスクリックでのページングを可能にする
			bindMouseClickEvent();

			// 自動のページングを可能にする。
			if (params.autoSlide) {
				autoSlide.init();
			}

		};

		// 画像ギャラリーをスライドする
		var slide = function(page, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 後処理
			var after = function() {
				if (params.carousel) {
					doCarousel();
				}

				nowLoading = false;
				dragw = 0;

				// コールバック
				slideCallBack();
			};

			// 移動するページ量
			var move = page - pageNo;

			if (maxPageNo <= 1) {
				after();
				return;
			}

			// カルーセルがない場合で、次ページが存在しない場合は、処理させない
			if (!params.carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			var from = 0;
			if (params.carousel) {
				from = -1 * (pos/params.shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-params.shift)/params.shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			pos = pos + (params.shift * move);

			// ページ番号
			if (page < 1) {
				pageNo = maxPageNo;
			} else if (maxPageNo < page) {
				pageNo = 1;
			} else {
				pageNo = page;
			}

			// ページングボタンの表示制御
			if (!params.carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用しない
				if (1 < maxPageNo && params.carousel) {
					pos = (page * params.shift) - params.shift;
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					pos = page * params.shift;
					ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				if (!params.isMouseDrag) {
					// jQueryを利用したアニメーション
					ul.animate(
						{ left: to}
					,	params.slideSpeed
					,	params.easing
					,	function() {
							after();
						}
					);
				} else {
					// jQueryを利用しないアニメーション(Androidでアニメーションが重いため)
					(function() {
						var self = this;

						var elem = ul[0];
						var begin = +new Date();
						var duration = params.slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;

								after();
								return;
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					})();
				}
			} else if (animateType === ANIMATE_TYPE.FADE) {
				ul.animate({'opacity': 0 }, 300, function() {
					// アニメーションを利用しない
					if (1 < maxPageNo && params.carousel) {
						pos = (page * params.shift) - params.shift;
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						pos = page * params.shift;
						ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
					}
					after();
				});
			}

		};

		// 次へ、前へボタンの表示・非表示を切り替える
		var showArrows = function() {
			// 1ページしかない場合
			if (maxPageNo <= 1) {
				next.hide();
				back.hide();
			// 左端
			} else if (pageNo === 1) {
				next.show();
				back.hide();
			// 右端
			} else if (pageNo === maxPageNo) {
				back.show();
				next.hide();
			} else {
				back.show();
				next.show();
			}
		};

		// カルーセル用に両端に番兵を作成する
		var initCarousel = function() {

			// 最終ページに空きが出来る場合は空のLIダグを追加する
			var addSize = li.size()%params.shift;
			if (addSize !== 0) {
				for (var i=0, len=params.shift-addSize;i<len;i++) {
					ul.append(ul.find(params.childKey).filter(':first').clone().empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(params.childKey);
			}

			ul
				.append(li.clone().addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(params.childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos === 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if ((li.size()-params.shift - (dispCount - params.shift)) <= pos) {
				pos = (li.size()/2)-params.shift - (dispCount - params.shift);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// マウスクリックでのページングを可能にする
		var bindMouseClickEvent = function() {
			// 左方向へスライドする
			back.click(function(e) {
				e.preventDefault();
				backPage();
			});

			// 右方向へスライドする
			next.click(function(e) {
				e.preventDefault();
				nextPage();
			});
		};

		// マウスドラッグでのページングを可能にする
		var bindMouseDragEvent = function() {
			var isTouch = ('ontouchstart' in window);
			ul.bind({
				// タッチの開始、マウスボタンを押したとき
				'touchstart mousedown': function(e) {

					if (nowLoading) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					nowLoading = true;

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = $(this).position().left;
					this.startLeft = this.left;

					this.touched = true;
				},
				// タッチしながら移動、マウスのドラッグ
				'touchmove mousemove': function(e) {

					if (!this.touched) {
						return;
					}

					var x = (this.pageX - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX));
					var y = (this.pageY - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY));

					if (5 < Math.abs(x)) {
						event.preventDefault();
						event.stopPropagation();
					} else if (5 < Math.abs(y)) {
						return;
					}
					// 移動先の位置を取得する
					this.left = this.left - x;

					// 画像を移動させる
					$(this).css({left:this.left});

					// 位置 X,Y 座標を覚えておく
					this.pageX = ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);

				},
				// タッチの終了、マウスのドラッグの終了
				'touchend mouseup touchcancel': function(e) {
					if (!this.touched) {
						return;
					}
					this.touched = false;

					// スワイプの移動量
					dragw = this.startLeft - this.left;

					// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
					if ((Math.abs(dragw) < params.reboundw) || (!params.carousel && ((pageNo <= 1 && dragw < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
						ul.animate(
							{ left: '-=' + (-1 * dragw)},
							function() {
								nowLoading = false;
							}
						);
						dragw = 0;
					}

					if (dragw < 0) {
						// 前ページ
						slide(pageNo-1, ANIMATE_TYPE.SLIDE);
					} else if (0 < dragw) {
						// 次ページ
						slide(pageNo+1, ANIMATE_TYPE.SLIDE);
					} else {
						// 何もしない
					}
				}
			});
		};

		// 自動スライド
		var autoSlide = this.autoSlide = new (function() {
			var timer = null;
			this.on = false;
			this.init = function() {
				this.on = true;
				start();
				if (params.hoverPause) {
					$(li).hover(function() {
						stop();
					}, function() {
						start();
					});
				}
			};
			this.restart = function() {
				stop();
				start();
			};
			var start = this.start = function() {
				if (!autoSlide.on) {
					return;
				}
				timer = setTimeout(function() {
					clearInterval(timer);
					slide(pageNo+1, params.animateType);
					start();
				} , params.autoSlideInterval);
			};
			var stop = this.stop = function() {
				if (!autoSlide.on) {
					return;
				}
				clearInterval(timer);
				timer = null;
			};
		})();

		// コールバック
		var slideCallBack = function() {
			if (params.slideCallBack) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (params.carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-params.shift)]);
				}
				params.slideCallBack(data);
			}
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(pageNo-1, params.animateType);
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(pageNo+1, params.animateType);
		}

		// 指定したページを表示します。
		this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			if (maxPageNo < page) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(page, animateType);
		}

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.mynavislider.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2
	};

	// デフォルト値
	$.fn.mynavislider.defaults = {
			'parentKey': 'ul' // 親要素
		,	'childKey': 'li' // 子要素
		,	'shift': 5 // １ページでスライドさせる画像数
		,	'dispCount': null // １ページに表示する子要素の件数(shiftで指定した値と１ページに表示する子要素の数が異なる場合にのみ指定する)
		,	'shiftw': null // １ページでにスライドさせる幅(子要素にmarginなどの余白が指定されている場合に、自動で幅が算出できないためこれを指定する。)
		,	'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		,	'slideSpeed': 300 // スライド速度
		,	'easing': 'easeInOutCirc' // スライドアニメーションの種類
		,	'carousel': false // ローテートさせるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタン
		,	'nextBtnKey': '#gallery-next' // 前ページボタン
		,	'autoSlide': false // 自動スライドさせるどうか
		,	'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		,	'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 20 // スワイプ時に跳ね返りを行う幅
		,	'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
	};

})(jQuery);

