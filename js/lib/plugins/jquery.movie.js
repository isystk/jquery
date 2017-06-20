
(function($) {
	/*
	 * mynaviMovie
	 *
	 * Copyright (c) 2017 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 動画の表示処理
	 *
	 */
	$.fn.mynaviMovie = function(options, callbackfunc) {
	
		$.fn.mynaviMovie.addStyleCmp = false;
		
		var params = $.extend({}, $.fn.mynaviMovie.defaults, options);

		var init = function(obj, callback) {
			var width = obj.outerWidth() || 0,
				height = obj.outerHeight() || 0,
				playTime = obj.data('playtime') || '',
				isPlay = obj.hasClass('play'),
				imagePath = obj.attr('osrc') || obj.attr('src') || '',
				video = null,
				nowPlaying = false,
				sendGaPlayStart = false,
				sendGaPlayEnd = false;

			var movieBox = $(['<div class="movieBox" >',
				'<div class="playBtn"></div>',
				'<div class="playTime display-none"><span>'+playTime+'</span></div>',
				'</div>'
			].join(''));

			var copyImage = obj.clone(true);
			movieBox.prepend(copyImage);
			
			if (playTime !== '') {
				movieBox.find('.playTime').removeClass('display-none');
			}

			if (isPlay) {
				movieBox.addClass('play');
				// 動画サムネイルをクリックした際に動画に差し替える。
				movieBox.bind("click", function(e) {
					e.preventDefault();
					video = changeVideo($(this), imagePath);
					
					// GAイベントトラッキング
					if (params.sendGa && !sendGaPlayStart) {
						var sendGa = video.closest('.sendGa'),
							gaaction = sendGa.data('gaaction'),
							movieUrl = 'http:' + sendGa.find('source').attr('src'),
							galabel = sendGa.data('galabel');
						$.gaTrackEvent({category: '動画再生', action: gaaction, label: movieUrl + '-' + galabel});
						sendGaPlayStart = true;
					}

				});
			}

			obj.after(movieBox);
			obj.removeClass('movie');
			obj.remove();
			
			if (width !== 0 && height === 0) {
				// 表示サイズの調整
				var img = $('<img>');
				img
					.load(function() {
						var o_width = img[0].width;
						var o_height = img[0].height;

						// アスペクト比からheightを算出
						height = Math.floor(o_height * width / o_width);
						setPartsPosition(width, height);
					});
				img.attr('src', imagePath);
			} else if (width === 0 && height !== 0) {
				// 表示サイズの調整
				var img = $('<img>');
				img
					.load(function() {
						var o_width = img[0].width;
						var o_height = img[0].height;

						// アスペクト比からwidthを算出
						width = Math.floor(o_width * o_height / height);
						setPartsPosition(width, height);
					});
				img.attr('src', imagePath);
			} else if (width === 0 || height === 0) {
				// 表示サイズの調整
				var img = $('<img>');
				img
					.load(function() {
						var o_width = img[0].width;
						var o_height = img[0].height;

						setPartsPosition(o_width, o_height);
					});
				img.attr('src', imagePath);
			} else {
				setPartsPosition(width, height);
			}

			function setPartsPosition(w, h) {
				var playBtnWidth = 0;
				var playBtnHeight = 0;
				if (width < height) {
					// 縦長の場合
					playBtnWidth = Math.floor(w * 0.3);
					playBtnHeight = Math.floor(w * 0.3);
				} else {
					// 横長の場合
					playBtnWidth = Math.floor(h * 0.3);
					playBtnHeight = Math.floor(h * 0.3);
				}
				
				var playBtnTop = Math.floor((h * 0.5) - (playBtnHeight * 0.5));
				var playBtnLeft = Math.floor((w * 0.5) - (playBtnWidth * 0.5));
				var playTimeFontSize = Math.floor(playBtnWidth * 0.3);
				if (20 < playTimeFontSize) {
					playTimeFontSize = 20;
				}
				var playTimeTop = Math.floor(h - 15 - playTimeFontSize);

				movieBox.css('width', w + 'px').css('height', h + 'px');
				movieBox.find('.playBtn').css('top', playBtnTop + 'px').css('left', playBtnLeft + 'px');
				movieBox.find('.playTime').css('top', playTimeTop + 'px').css('font-size', playTimeFontSize + 'px');

				if (callback) {
					callback();
				}
			}
			
			// 動画を再生します。
			var playVideo = $.fn.mynaviMovie.playVideo = function (video) {
				if (nowPlaying) {
					return;
				}
				video[0].play();
				nowPlaying = true;
			}

			// 動画を停止します。
			var pauseVideo = $.fn.mynaviMovie.pauseVideo = function (video) {
				if (!nowPlaying) {
					return;
				}
				video[0].pause();
				nowPlaying = false;
			}
			
			// imgタグをvidoタグに置き換える
			var changeVideo = $.fn.mynaviMovie.changeVideo = function (target, imagePath) {
				var self = target,
					image = self.find('img.movie'),
					width = image.attr('width');

				var movieDir = imagePath.substring(0, imagePath.lastIndexOf('/')+1).replace( /thumb/g , 'movie');
				var movieFile = imagePath.substring(imagePath.lastIndexOf('/')+1).replace(/([0-9]*)(.*).jpg(.*)/, '$1.mp4$3');
				var moviePath = movieDir + movieFile;
				
				var video = $(['<video class="movie" controls="" poster="'+imagePath+'" >',
						'<source src="'+moviePath+'">',
						'<p>ご利用のブラウザではvideoが利用できません。別ブラウザをご利用下さい</p>',
					'</video>'].join(''));
				
				// 初期音量をMUTEにするかどうか
				if (params.muteDefault) {
					video.attr('muted', 'muted');
				}
				
				if (width) {
					width = width.replace('px', '');
					video.css('width', width + 'px');
				}

				var clazz = image.attr('class');
				if (clazz) {
					video.addClass(clazz);
				}
				
				
				self.after(video);
				self.remove();

				if (params.clickCallback) {
					params.clickCallback({target: movieBox});
				}
				
				(function() {
					
					if (params.clickPlay) {
						video.click(function(e) {
							e.preventDefault();
							if (!nowPlaying) {
								playVideo(video);
							} else {
								pauseVideo(video);
							}
						});
					}

					// 動画が再生開始された時
					video[0].addEventListener("play", function(){
						if (params.playCallback) {
							params.playCallback();
						}
					}, true);

					// 動画が停止された時
					video[0].addEventListener("pause", function(){
						if (params.pauseCallback) {
							params.pauseCallback();
						}
					}, true);

					// 動画が再生完了した時
					video[0].addEventListener("ended", function(){

						// GAイベントトラッキング
						if (params.sendGa && !sendGaPlayEnd) {
							var sendGa = video.closest('.sendGa'),
								gaaction = sendGa.data('gaaction'),
								movieUrl = 'http:' + sendGa.find('source').attr('src'),
								galabel = sendGa.data('galabel');
							$.gaTrackEvent({category: '動画再生完了', action: gaaction, label: movieUrl + '-' + galabel});
							sendGaPlayEnd = true;
						}

						if (params.endedCallback) {
							params.endedCallback();
						}
					}, true);
					
					playVideo(video);

					// 初期表示をフルスクリーンにするかどうか
					if (params.zoomStart) {
						if (!!video[0].requestFullScreen) {
							video[0].requestFullScreen();
						} else if (!!video[0].webkitRequestFullScreen) {
							video[0].webkitRequestFullScreen();
						} else if (!!video[0].webkitEnterFullscreen) {
							video[0].webkitEnterFullscreen();
						}
					}
					
				})();

				// ミニファイされるSTG環境だとCSSに記述しても効かなくなるので、JSでスタイル追加しました。
				if (params.hideDownload && !$.fn.mynaviMovie.addStyleCmp) {
					var style = addStyle();
					style.addCSS('video.movie::-webkit-media-controls-panel', 'width', 'calc(100% + 31px)');
					style.addCSS('video.movie::-webkit-media-controls-enclosure', 'overflow', 'hidden');
					$.fn.mynaviMovie.addStyleCmp = true;
				}

				return video;
			};

		};

		var maxCount = $(this).length;
		$(this).each(function() {
			init($(this), function() {
				maxCount--;
				if (maxCount === 0 && callbackfunc) {
					callbackfunc();
				}
			});
		});

		// 画面が回転された場合
		var restore = function(target) {
			var movieBox = target.closest('.movieBox');
			var img = target.clone(true);
			movieBox.after(img);
			movieBox.remove();
			return img;
		}
		$(window).on('orientationchange resize', function(){
			$('img.movie').each(function() {
				var img = restore($(this));
				init(img);
			});
		});

		return this;
	}
	
	$.fn.mynaviMovie.defaults = {
		clickCallback : null,
		playCallback : null,
		pauseCallback : null,
		endedCallback : null,
		muteDefault : false, // 動画再生時の初期音量をMUTEにするかどうか
		hideDownload : true, // ダウンロードボタンを非表示とするかどうか
		clickPlay : true, // videoタグクリック時に動画再生・停止を制御する。
		zoomStart : false, // 拡大表示した状態で再生するかどうか
		sendGa : false // 再生開始、再生終了時にGA送信するかどうか
	}

	function addStyle() {
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		document.getElementsByTagName('head')[0].appendChild(style);
		var sheet = document.styleSheets[0];
		if (sheet.insertRule) {
			sheet.addCSS = function(selector, property, value) {
				var cssRulesIndex = (sheet.cssRules) ? sheet.cssRules.length : 0;
				sheet.insertRule(selector + '{' + property + ':' + value + ';}', cssRulesIndex);
			};
		} else {
			sheet.addCSS = function(selector, property, value) {
				sheet.addRule(selector, property + ':' + value);
			};
		}
		return sheet;
	}
	
})(jQuery);
