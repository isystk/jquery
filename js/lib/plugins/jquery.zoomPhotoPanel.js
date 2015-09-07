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

		var panel = null,
			screen = null,
			targetClass = null,
			animateType = null,
			imageUrl = null,
			slideSpeed = null,
			easing = null,
			carousel = null,
			autoSlide = null,
			autoSlideInterval = null,
			hoverPause = null,
			slideCallBack = null;
		
		// 初期設定
		var init = function(obj) {

			screen = $(obj);
			targetClass = params.targetClass;
			animateType = params.animateType;
			imageUrl = params.imageUrl;
			slideSpeed = params.slideSpeed;
			easing = params.easing;
			carousel = params.carousel;
			autoSlide = params.autoSlide;
			autoSlideInterval = params.autoSlideInterval;
			hoverPause = params.hoverPause;
			slideCallBack = params.slideCallBack;

			var photos = [];

			/* ギャラリーに設定する画像データ配列を生成する */
			screen.find(targetClass).each(function(i) {

				var target = $(this),
					imagePath = target.attr('osrc') || '',
					caption = target.attr('alt') || '';

				var data = {
					imagePath : imagePath,
					caption : caption
				};

				// テンプレートに渡すため配列に格納
				photos.push(data);

			});

			var maxPageNo = photos.length;

			/* ギャラリーHTML（上部） */
			var upper = '<div id="zoomPhotoPanel" class="window photo_enlarge display-none">'
					+	'<div class="inner">'
					+	'<div class="js-photoSlider carousel">'
					+	'<p class="button back js-backBtn"><a href="#">'
					+	'<% if (1 < maxPageNo) { %>'
					+	'<img src="'+imageUrl+'/btn_carousel_back_l.png" alt="前へ" width="50" height="50" class="imgover" />'
					+	'<% } %>'
					+	'</a></p>'
					+	'<p class="counter" style="width: 696px;padding-left: 71px;"><em><%= maxPageNo %></em>枚中 <em class="js-pageNo">0</em>枚目を表示</p>'
					+	'<div class="js-screen" style="overflow: hidden;width: 696px;margin: 0 auto;">'
					+	'<ul class="photos">';

			/* ギャラリーHTML（画像） */
			var list = '<% _.each(photos, function(data, i) { %> '
					+	'<li class="imagePath<%=i+1%>">'
					+	'<div class="js-photo">'
					+	'<img src="<%= data.imagePath %>" alt="<%= data.caption %>" height="522" class="image imagePath" />'
					+	'<div class="caption">'
					+	'<%= data.caption %>'
					+	'</div>'
					+	'</div></li>'
					+	'<% }); %>';

			/* ギャラリーHTML（下部） */
			var bottom = '</ul>'
					+	'</div>'
					+	'<p class="button next js-nextBtn"><a href="#">'
					+	'<% if (1 < maxPageNo) { %>'
					+	'<img src="'+imageUrl+'/btn_carousel_next_l.png" alt="次へ" width="50" height="50" class="imgover" />'
					+	'<% } %>'
					+	'</a></p></div>'
					+	'</div>'
					+	'<p class="button layerclose"><a href="#">'
					+	'<img src="'+imageUrl+'/btn_full-screen_close.png" alt="閉じる" width="26" height="26" class="imgover" /></a></p>'
					+	'</div>';


			// 拡大写真パネルを生成する
			panel = $(_.template(upper, {maxPageNo: maxPageNo}) + _.template(list, {photos: photos}) + _.template(bottom, {maxPageNo: maxPageNo}));
			
			$('body').append(panel);

			// イベントバンドル
			bindEvent();

		};

		// イベントバンドル
		var bindEvent = function() {

			// 画像スライダーを設定する
			var slider = panel.find('.js-photoSlider').mynavislider({
				'shift': 1
				, 'backBtnKey': panel.find('.js-backBtn')
				, 'nextBtnKey': panel.find('.js-nextBtn')
				, 'animateType': animateType
				, 'slideSpeed': slideSpeed
				, 'easing': easing
				, 'carousel': carousel
				, 'autoSlide': autoSlide
				, 'autoSlideInterval': autoSlideInterval
				, 'hoverPause': hoverPause
				, 'slideCallBack': function(data) {

						panel.find('.js-pageNo').empty().append(data.pageNo);

						var photo = data.obj.find('img.imagePath');

						var img = new Image();
						img.src = photo.attr('src');

						// 表示する画像の幅を算出する。
						var width = Math.ceil(522 * img.width / img.height);
						if (696 < width) {
							width = 696;
						}

						panel.find('.js-screen,js-photo').css('width', width);

						if (slideCallBack) {
							slideCallBack(data);
						}

					}
			});

			// 対象画像クリック時に拡大写真パネルを表示する
			screen.find(targetClass).each(function(i) {
				var target = $(this),
					pageNo = i+1;

				target.click(function(e) {
					e.preventDefault();
					slider.changePage(pageNo);
					$.mLightBox({'mLightBoxId': '#zoomPhotoPanel', duration: 300});
				});
			});

			panel.find('.layerclose').click(function(e) {
				e.preventDefault();
				$.mLightBox.close();
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
		FADE: 2
	};

	// デフォルト値
	$.fn.zoomPhotoPanel.defaults = {
		'targetClass': '.js-zoomPhoto' // 拡大する画像要素
		, 'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		, 'imageUrl': '/img' // 画像パス
		, 'slideSpeed': 300 // スライド速度
		, 'easing': 'easeInOutCirc' // スライドアニメーションの種類
		, 'carousel': false // ローテートさせるかどうか
		, 'autoSlide': false // 自動スライドさせるどうか
		, 'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		, 'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		, 'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
	};

})(jQuery);

