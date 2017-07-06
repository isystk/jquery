

(function($){
	/*
	 * zoomPhotoPanel
	 *
	 * Copyright (c) 2014 iseyoshitaka at teamLab
	 *
	 * Description:
	 * マイナビウエディング拡大写真パネルを生成する
	 *
	 * Sample:
	 * $('.js-zoomPhotoPanel').zoomPhotoPanel({}, function() {});
	 */

	$.fn.zoomPhotoPanel = function(options) {

		var params = $.extend({}, $.fn.zoomPhotoPanel.defaults, options);

		var className = "zoomPhotoPanel";
		
		// 初期設定
		var init = function(obj) {

			var screen = $(obj),
				targetClass = params.targetClass,
				target = screen.find(targetClass),
				animateType = params.animateType,
				originalSize = params.originalSize,
				imageUrl = params.imageUrl,
				slideSpeed = params.slideSpeed,
				carousel = params.carousel,
				autoSlide = params.autoSlide,
				autoSlideInterval = params.autoSlideInterval,
				hoverPause = params.hoverPause,
				slideCallBack = params.slideCallBack,
				openCallBack = params.openCallBack,
				maxPageNo = target.length;

			var nowLoading = true;
				
			if (target.length === 0) {
				return;
			}

			var mynavigallery = $('.' + className);
			
			var index = 1;
			if (mynavigallery) {
				index = mynavigallery.length + 1;
			}

			// target を配列に分割する。
			var targetArray = [];
			(function() {
				var len = Math.floor(target.length / params.arrayCnt);
				if ((target.length % params.arrayCnt) !== 0) {
					len = len + 1;
				}
				for(var i=0; i < len; i++) {
					var j = i * params.arrayCnt;
					var p = target.slice(j, j + params.arrayCnt);
					targetArray.push(p);
				}
			})();


			// メインフレームを生成します。
			var makeFlame = function (index) {

				var template = [
					'<div class="photo_enlargeArea portfolio display-none" >',
						'<div class="js-photoSlider" style="overflow:hidden;margin 0 auto;">',
							'<div class="parentKey photo_enlarge_imageArea">',
							'</div>',
						'</div>',
						'<div class="photo_enlarge_partsArea">',
							'<div class="transitionArea transitionList">',
								'<p class="item prev js-backBtn"><a href="#" class="trigger"></a></p>',
								'<p class="item next js-nextBtn"><a href="#" class="trigger"></a></p>',
							'</div>',
							'<div class="closeArea">',
								'<p class="closeBtn"><a href="#" class="layerclose"><img src="' + imageUrl + '/btn_delete.png" alt="削除" width="20" height="20"></a></p>',
							'</div>',
							'<div class="commentArea">',
								'<div class="comment">',
									'<p class="caption_txt captionArea"></p>',
									'<p class="provideArea"></p>',
									'<p class="count" style="bottom: 10px;position: absolute;width: 100%;"></p>',
							'</div>',
						'</div>',
					'</div>'].join('');

				var mainFlame = $(_.template(template, {maxPageNo: maxPageNo}));

				mainFlame.attr('id', 'zoomPhotoPanel'+ index); 
				mainFlame.addClass(className);
				
				$('body').append(mainFlame);

				return mainFlame;
			}

			// 子要素を生成します。
			var makeChild = function (mainFlame, page, callback) {

				if (mainFlame.slider.suspend) {
					mainFlame.slider.suspend(true);
				}

				var num = (function findArrayNum(page) {
					return Math.floor((page-1) / params.arrayCnt);
				})(page);

				var photos = [];

				/* ギャラリーに設定する画像データ配列を生成する */
				for (var i=0, len=mainFlame.targetArray[num].length; i<len; i++) {
					var target = $(mainFlame.targetArray[num][i]),
						image = target.find('img'),
						imageId = target.data('imageid') || '',
						weddingId = target.data('weddingid') || '',
						imagePath = image.attr('osrc') || image.attr('src') || '',
						caption = image.attr('alt') || '',
						title = target.data('title') || '',
						chapelName = target.data('chapelname') || '',
						provideName = target.data('providename') || '',
						provideUrl = target.data('provideurl') || '',
						playtime = target.find('img.gallery-photo').data('playtime') || '',
						isMovie = target.find('img.gallery-photo').hasClass('js-movie');
					
					var originalPath = imagePath;
					if (0 <= imagePath.indexOf('_')) {
						var originalDir = imagePath.substring(0, imagePath.lastIndexOf('/')+1);
						var originalFile = imagePath.substring(imagePath.lastIndexOf('/')+1).replace(/([0-9]*)(.*).jpg(.*)/, '$1.jpg$3');
						originalPath = originalDir + originalFile;
					}

					var data = {
						imageId : imageId,
						imagePath : imagePath,
						originalPath : originalPath,
						caption : caption,
						weddingId : weddingId,
						title : title,
						chapelName : chapelName,
						provideName : provideName,
						provideUrl : provideUrl,
						playtime : playtime,
						movie : (isMovie) ? 'targetMovie' : ''
					};

					// テンプレートに渡すため配列に格納
					photos.push(data);

				}

				/* デザインテンプレート */
				var template = [
					'<% _.each(photos, function(data, i) { %>',
						'<div class="childKey" style="text-align: center;">',
							'<img src="<%=data.originalPath%>" alt="<%-data.caption%>" style="z-index: 0;" data-imageurl="<%=data.imagePath%>" data-imageid="<%=data.imageId%>" data-chapelname="<%=data.chapelName%>" data-providename="<%=data.provideName%>" data-provideurl="<%=data.provideUrl%>" data-playtime="<%= data.playtime %>" data-gaaction="<%= data.weddingId %>" data-galabel="<%= data.title %>" class="targetImg <%= data.movie %>" >',
						'</div>',
					'<%}); %>'].join('');

				// 拡大写真パネルを生成する
				var li = $(_.template(template, {photos: photos}));
				li.attr('array', num);
				li.each(function(i) {
					$(this).attr('pageno', (num*params.arrayCnt) + (i+1));
					if (i===0) {
						$(this).addClass('firstArray');
					}
					if (i===(li.length-1)) {
						$(this).addClass('lastArray');
					}
				});
				li.css('text-align', 'center')
					.css('margin-top', '0px')
					.css('float', 'left');

				// 子要素の横幅を端末のwidthに設定
				li.width($(window).width());
				li.height($(window).height());

				var photos = li.find('img');
				var photoLength = photos.length;
				photos.each(function() {
					var photo = $(this),
						imagePath = photo.attr('src') || '';
					var img = $('<img>');
					img
						.load(function() {
							
							photo.attr('owidth', img[0].width);
							photo.attr('oheight', img[0].height);
							var x = Math.floor(photo.attr('oheight') * $(window).width() / photo.attr('owidth'));
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 <= margin) {
								photo.css('height', '').css('width', '100%');
							} else {
								photo.css('height', '100%').css('width', '');
							}
							if (photoLength !== 1) {
								photoLength--;
								return;
							}
							photos.unbind('load');

							if (mainFlame.slider.suspend) {
								mainFlame.slider.suspend(false);
							}

							callback(li);
						});
					img.attr('src', imagePath);
				});
			}

			// イベントバンドル
			var bundle = function(mainFlame) {

				var sliderAnimateType = '';
				if (animateType === ANIMATE_TYPE.NO) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.NO;
				} else if (animateType === ANIMATE_TYPE.FADE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				} else if (animateType === ANIMATE_TYPE.SLIDE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.SLIDE;
				} else if (animateType === ANIMATE_TYPE.ORIGINAL) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				}

				// 画像スライダー
				var slider = mainFlame.slider = mainFlame.find('.js-photoSlider').mynavislider({
					'parentKey': '.parentKey'
					, 'childKey': '.childKey'
					, 'shift': 1
					, 'isMouseDrag': true
					, 'isFullScreen': true
					, 'heightMaxScreen': true
					, 'animateType': sliderAnimateType
					, 'slideSpeed': slideSpeed
					, 'carousel': carousel
					, 'moment': false
					, 'autoSlide': autoSlide
					, 'autoSlideInterval': autoSlideInterval
					, 'hoverPause': hoverPause
					, 'slideCallBack': function(data) {

						var obj = $(data.obj),
							targetImage = obj.find('img'),
							pageNo = parseInt(obj.attr('pageno')),
							arrayNo = parseInt(obj.attr('array'));

						// 画像上下の余白を調整する。
						prepareDisplay(pageNo);

						// 動画を停止させる
						pauseVideo();
						
						// コメントエリアの表示更新
						(function() {
							mainFlame.find('.commentArea .count').text(data.pageNo + '／' + data.maxPageNo + '');
						})();

						// 両端の場合はメインフレームに次の子要素を追加する。
						(function() {
							if (obj.hasClass('firstArray')) {
								var nextPageNo = pageNo - 1;
								if (nextPageNo < 1) {
									nextPageNo = maxPageNo;
								}
								if (mainFlame.find('.childKey[pageno="' + nextPageNo + '"]').length === 0) {
									makeChild(mainFlame, nextPageNo, function(li) {
										var nextArrayNo = parseInt(li.attr('array'));
										// LIタグの差し込み位置を算出
										var appendPos = findAppendPos(mainFlame, nextArrayNo);
										insertChild(mainFlame.find('.childKey.lastArray[array="'+appendPos+'"]'), li);
										if (nextArrayNo < arrayNo && obj.hasClass('cloned')) {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length*2);
										} else {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length);
										}

										// 画像上下の余白を調整する。
										prepareDisplay(pageNo);

										nowLoading = false;
									});
								}
							}
							if (obj.hasClass('lastArray')) {
								var nextPageNo = pageNo + 1;
								if (maxPageNo < nextPageNo) {
									nextPageNo = 1;
								}
								if (mainFlame.find('.childKey[pageno="' + nextPageNo + '"]').length === 0) {
									makeChild(mainFlame, nextPageNo, function (li) {
										var nextArrayNo = parseInt(li.attr('array'));
										insertChild(mainFlame.find('.childKey.lastArray[array="'+arrayNo+'"]'), li);
										if (arrayNo < nextArrayNo && !obj.hasClass('cloned')) {
											mainFlame.slider.refresh(pageNo, maxPageNo, 0);
										} else {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length);
										}

										// 画像上下の余白を調整する。
										prepareDisplay(pageNo);

										nowLoading = false;
									});
								}
							}

						})();

						nowLoading = false;
						if (slideCallBack) {
							slideCallBack(data);
						}
					}, 'resizeCallBack': function (data) {

						var obj = $(data.obj),
							targetImage = obj.find('img'),
							pageNo = parseInt(obj.attr('pageno'));

						// 画像上下の余白を調整する。
						prepareDisplay(pageNo);

						mainFlame.css('height', $(window).height() + 'px').css('width', $(window).width() + 'px');
						$('#jquery-mLightBox-overlay').css('height', $(document).height() + 'px').css('width', $(window).width() + 'px');

					}
				});

				// 拡大写真パネル 子要素をタップ時にメッセージパネルを非表示にする。
				slider.click(function(e) {
					var partsArea = mainFlame.find('.photo_enlarge_partsArea');
					if (partsArea.is(':visible')) {
						partsArea.hide();
					} else {
						partsArea.show();
					}
				});
				
				// 対象画像クリック時に拡大写真パネルを表示する
				screen.find(targetClass).each(function(i) {
					var target = $(this),
						pageNo = i+1;

					target.unbind('click');
					target.bind('click', function(e) {
						e.preventDefault();
						if (nowLoading) {
							return;
						}
						if (mainFlame.find('.childKey[pageno="' + pageNo + '"]').length === 0) {
							makeChild(mainFlame, pageNo, function(li) {
								var arrayNo = parseInt(li.attr('array'));
								// LIタグの差し込み位置を算出
								var appendPos = findAppendPos(mainFlame, arrayNo);
								insertChild(mainFlame.find('.childKey.lastArray[array="'+appendPos+'"]'), li);
								mainFlame.slider.refresh(null, maxPageNo, li.length);
								showPage(pageNo);
							});
						} else {
							showPage(pageNo);
						}
					});
				});

				// 拡大写真パネルスライダー 前ページクリック時
				mainFlame.find('.js-backBtn').click(function(e) {
					e.preventDefault();
					if (nowLoading) {
						return;
					}
					nowLoading = true;
					mainFlame.slider.backPage();
				});

				// 拡大写真パネルスライダー 次ページクリック時
				mainFlame.find('.js-nextBtn').click(function(e) {
					e.preventDefault();
					if (nowLoading) {
						return;
					}
					nowLoading = true;
					mainFlame.slider.nextPage();
				});

				// 拡大写真パネル 閉じるボタンクリック時
				mainFlame.find('.layerclose').click(function(e) {
					e.preventDefault();

					// 動画を停止させる
					pauseVideo();
					
					$.mLightBox.close();
				});

			};

			// 画面表示を調整する。
			var prepareDisplay = function(pageNo) {
				mainFlame.slider.find('.childKey[pageno="' +pageNo+'"]').each(function() {
					var li = $(this),
						photo = li.find('img'),
						imagePath = photo.attr('src') || '',
						isMovie = photo.hasClass('targetMovie');

					if (isMovie) {
						// 動画の場合
						
						var options = $.extend($.fn.mynaviMovie.defaults, {});
						// 動画再生時
						options.clickCallback = function(obj) {
							
							// カルーセル内にあるcloneサムネイルもvideoに変換する。
							mainFlame.slider.find('.childKey[pageno="' +pageNo+'"]').each(function() {
								var movieBox = $(this).find('.movieBox');
								var image = movieBox.prev();
								movieBox.remove();
								var video = obj.video.clone(true);
								$.fn.mynaviMovie.bindVideoClick(video);
								image.after(video);

								// カルーセル内の動画を同期させる
								$.fn.mynaviMovie.syncPlayingTime(obj.video[0], video[0]);
								
							});
							
							// 余白の調整
							appendMargin();
							
						};
						// 画像を動画再生用サムネイルに変換
						photo.addClass('play');
						photo.mynaviMovie(options, function (videoBoxs) {
							$(videoBoxs).each(function() {
								$(this).addClass('noRestore');
							});
							// 余白の調整
							appendMargin();
						});
						photo.removeClass('targetMovie');
						
					} else {
						// 画像の場合

						// 余白の調整
						appendMargin();
					}
				});
			}
				
			// 上下左右に余白を追加する。
			var appendMargin = function() {
				// 画面上下にマージン設定（画像）
				mainFlame.slider.find('.childKey img.targetImg').each(function() {
					var photo = $(this),
						oheight = photo.attr('oheight') || 0,
						owidth = photo.attr('owidth') || 0,
						moviePath = photo.data('moviepath') || '',
						isMovie = (moviePath !== '') ? true : false;

					photo.closest('.childKey').css('margin-top', '');

					if (!isMovie) {
						// 画像

						var x = Math.floor(oheight * $(window).width() / owidth);
						var margin = Math.floor(($(window).height() - x) / 2) || 0;
						if (0 < margin) {
							photo.closest('.childKey').css('margin-top', margin + 'px');
						} else {
							photo.closest('.childKey').css('margin-top', '0px');
						}
					} else {
						var self = photo.next(),
							isMovieBox = self.hasClass('movieBox');
						
						if (isMovieBox) {
							// 動画サムネイル
							
							self.css('margin-left', '');

							var x = Math.floor(oheight * $(window).width() / owidth);
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 <= margin) {
								self.css('width', $(window).width());
								mainFlame.find('.movieOver').css('width', $(window).width());
								var height = Math.floor(self.width() * oheight / owidth);
								self.css('height', height + 'px');
								mainFlame.find('.movieOver').css('height', height + 'px');
							} else {
								self.css('height', $(window).height());
								mainFlame.find('.movieOver').css('height', $(window).height());
								var width = Math.floor(self.height() * owidth / oheight);
								self.css('width', width + 'px');
								mainFlame.find('.movieOver').css('width', width + 'px');
							}
							$.fn.mynaviMovie.setPartsPosition(self, self.width(), self.height());

							var x = Math.floor(oheight * $(window).width() / owidth);
							var margin = Math.floor(($(window).height() - x) / 2) || 0;
							if (0 < margin) {
								photo.closest('.childKey').css('margin-top', margin + 'px');
								mainFlame.find('.movieOver').css('margin-top', margin + 'px');
							} else {
								var marginLeft = Math.floor(($(window).width() - self.width()) / 2);
								if (0 <= marginLeft) {
									self.css('margin-left', marginLeft + 'px');
									mainFlame.find('.movieOver').css('margin-left', marginLeft + 'px');
								}
							}
							
						} else {
							// 動画

							var x = Math.floor(oheight * $(window).width() / owidth);
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 <= margin) {
								self.css('width', '100%');
								var height = Math.floor($(window).width() * oheight / owidth);
								self.css('height', height + 'px');
							} else {
								self.css('height', '100%');
								var width = Math.floor($(window).height() * owidth / oheight);
								self.css('width', width + 'px');
							}

							var x = Math.floor(oheight * $(window).width() / owidth);
							var margin = Math.floor(($(window).height() - x) / 2) || 0;
							if (0 < margin) {
								photo.closest('.childKey').css('margin-top', margin + 'px');
							} else {
								photo.closest('.childKey').css('margin-top', '0px');
							}

						}
					}
					
				});
			};
			
			// 再生中の動画を停止する。
			var pauseVideo = function() {
				mainFlame.slider.find('.childKey video').each(function() {
					var video = $(this);
					if (video[0].paused) {
						return;
					}
					video[0].pause();
				});
			};

			// 次のDOMを追加する位置を算出します。
			var findAppendPos = function (mainFlame, n) {
				if(mainFlame.find('.childKey').length === 0) {
					return null;
				}
				n = n -1;
				if (n < 0) {
					n = mainFlame.targetArray.length -1;
				}
				if(mainFlame.find('.childKey[array="'+n+'"]').length === 0) {
					return findAppendPos(mainFlame, n);
				}
				return n;
			};

			// beforeDom の後に afterDom を追加します。
			var insertChild = function(beforeDom, afterDom) {
				beforeDom.each(function() {
					var s = $(this);
					var p = afterDom.clone(true);
					if (s.hasClass('cloned')) {
						p.addClass('cloned');
					}
					$(s).after(p);
				});
			};

			// 指定したページを表示します。
			var showPage = function(pageNo) {

				if (nowLoading) {
					return;
				}

				var pageNo = pageNo || 1;

				// 初期表示時のスクロール位置を保持しておく。
				defaultScrollTop = $(window).scrollTop();
				
				mainFlame.slider.changePage(pageNo);

				var options = {'mLightBoxId': '#zoomPhotoPanel' + index, duration: 300,
					callback: function() {
						var page = $('.page');

						// フッタを一旦消す
						page.find('.footerNavBar').hide();

						if (openCallBack) {
							openCallBack();
						}
					},
					closecallback: function() {
						// 動画を停止させる
						pauseVideo();
						// フッタを戻す。
						Mynavi.showFooterNavBar();
						// メッセージの通知を表示する
						Mynavi.showMessageNotice();
					}
				};
				
				options.opacity = 1;
				options.addScroll = false;
				options.zIndex = 10000;
				$.mLightBox(options);
				
			};

			var mainFlame = makeFlame(index);
			mainFlame.targetArray = targetArray;
			makeChild(mainFlame, 1, function(childFlame) {
				mainFlame.find('.parentKey').append(childFlame);
				bundle(mainFlame);
				nowLoading = false;
			});

		};

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.zoomPhotoPanel.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2,
		ORIGINAL: 3
	};

	// デフォルト値
	$.fn.zoomPhotoPanel.defaults = {
		'targetClass': '.js-zoomPhoto' // 拡大する画像要素
		, 'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		, 'imageUrl': '../img' // 画像パス
		, 'slideSpeed': 300 // スライド速度
		, 'carousel': false // ローテートさせるかどうか
		, 'autoSlide': false // 自動スライドさせるどうか
		, 'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		, 'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		, 'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		, 'openCallBack': null // 拡大表示後のコールバック
		, 'showClip': false // 画像クリップ機能を表示する
		, 'sendGa': false // 画像クリップ機能を表示する
		, 'galabel': '' // 画像クリップ時のGAイベントラベル値
		, 'arrayCnt': 20 // 初期表示でロードする拡大画像内要素の数
	};

})(jQuery);

