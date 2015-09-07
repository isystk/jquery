(function($) {
/*
 * インスピレーションボード表示機能
 *
 * Copyright (c) 2012 iseyoshitaka
 *
 * Description:
 * インスピレーションボード表示機能を提供する
 *
 * Sample:
 * 	$.showInspirationBoad(imageArray);
 *
 */
$.inspirationBoad = function (images) {
	
	var ib = {
		limit : 15, // １ページに表示する件数
		currentPageNo : 1, // 現在表示しているページ番号
		maxPageNo : 1, // 最大のページ番号
		nowLoding : false // ロード中かどうか
	};
	
	/**
	 * 『他の写真を見る』ボタン クリック時のイベント
	 * 次ページのインスピレーションボードの画像を表示する。
	 */
	$('#more').click(function(e) {
		e.preventDefault();
		
		// アニメーションしながらインスピレーションボードを消す
		hideInspirationBoard();

		var interval = setInterval(function() {
			clearInterval(interval);
			
			// ページ番号をインクリメント
			ib.currentPageNo++;
			
			// 最大ページを超える場合は、１ページに戻す。
			if (ib.maxPageNo < ib.currentPageNo) {
				ib.currentPageNo = 1;
			}
			
			// アニメーションしながらインスピレーションボードを表示する
			showInspirationBoard();
		}, 800);

	});

	/**
	 * 『カテゴリー』プルダウンメニュー クリック時のイベント
	 * カテゴリーに紐付くインスピレーションボードの画像を変更する。
	 */
	$('.changePulldownCategory').click(function(e) {
		e.preventDefault();

		// 同じカテゴリを選択した場合は、後続処理を行わない
		if($('#more').data('imagecategoryid') === String($(this).data('imagecategoryid'))) {
			return false;
		}

		// アニメーションしながらインスピレーションボードを消す
		hideInspirationBoard();

		// 他の写真を見る押下用にカテゴリーを保持する
		$('#more').data('imagecategoryid', $(this).data('imagecategoryid'));

		// ページ数を初期化する
		ib.currentPageNo = 1;

		// ソート番号
		$('#more').data('sortno', $(this).data('sortno'));

		// インスピレーションボードを生成する
		getInspirationBoardData($(this).data('weddingid'), $(this).data('imagecategoryid'), $(this).data('sortno'));

	});


	// TOP位置情報配列
	var topPosition = [20, 0, 10, 0, 20, 190, 170, 180, 160, 190, 340, 330, 340, 320, 340];
	// LEFT位置情報配列
	var leftPosition = [20, 208, 396, 584, 772, 0, 196, 394, 582, 780, 20, 208, 396, 584, 772];

	// アニメーションしながらインスピレーションボードを表示する
	var showInspirationBoard = function() {

		// Lodding画像を隠す。
		$('#mainboard .loading').hide();
		
		$('li.pageNo' + ib.currentPageNo, '#mainboard').css('visibility', 'visible');
		$('li.pageNo' + ib.currentPageNo, '#mainboard').each(function(i) {
			$(this)
				.fadeIn()
				.animate({
					'opacity': 1
				,	'top': topPosition[i]
				,	'left': leftPosition[i]
				}, 500, 'easeOutQuint', function() {
				});
		});
	};

	// アニメーションしながらインスピレーションボードを消す
	var hideInspirationBoard = function(callback) {
		$('li.pageNo' + ib.currentPageNo, '#mainboard').each(function(i) {
			$(this)
				.animate({
					'left': 350
				,	'top': 150
				,	'opacity': 0
				}, 500, 'easeOutQuint'
				, function() {
					$(this).css('visibility', 'hidden');
				});
		});

	};

	// インスピレーションボードを生成する
	(function() {
		var ul = $('<ul>').addClass('photos');
		var list = [];
		for (var i=0; i < images.length; i++) {
			var pageNo = Math.floor((i+1)/ib.limit);
			if (((i+1)%ib.limit) !== 0) {
				pageNo = pageNo + 1;
			}
			list[i] = [
			    '<li class="pageNo'+pageNo+'">',
					'<a href="#" class="gallery" style="position:static;">',
						'<img src="' + images[i] + '" alt="" height="126" class="image gallery-photo" />',
					'</a>',
				'</li>'].join('');
		}
		
		$(list.join('')).hide().appendTo(ul);

		// 最大ページを設定
		ib.maxPageNo = Math.floor(list.length/ib.limit);
		if ((list.length%ib.limit) !== 0) {
			ib.maxPageNo = ib.maxPageNo + 1;
		}
		
		// フォトギャラリーHTML要素をDOMに書き込む
		$('#mainboard')
			.find('ul.photos')
				.remove()
			.end()
			.append(ul);

		// 画像ロード完了時の処理
		$('img', '#mainboard').imagesLoaded( function(){

			// フォトギャラリーDOMに対して位置・透過処理を行う
			$('li', '#mainboard').each(function(i) {
				$(this).css({
						'opacity': 0
					,	'top': 150
					,	'left': 350
					});
			});

			// 再作成する為、事前に拡大写真パネル要素を削除する
			$('#mynavigallery').remove();

			// 拡大写真パネル再作成時に、拡大写真パネルイベントも登録するので、アプリ経由画像用にイベントを破棄する
			$('.gallery-photo', '#imageDelayArea').unbind();

			// アニメーションしながらインスピレーションボードを表示する
			showInspirationBoard();

			// 処理完了
			ib.nowLoding　= false;

		});

	})();

};

})(jQuery);

