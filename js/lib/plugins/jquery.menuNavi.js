(function($){
/*
 * globalMenuNavi
 *
 * Require Library:
 * 　jquery.js 1.3.2
 *
 * Options:
 * 　global - グローバルメニューのID
 * 　sub - サブメニューのID
 * 　action - link or click
 *
 * Description:
 * 　クライアント、管理のグローバルナビゲーション機能を提供します
 */

var globalElems = [], subElems = [],
curgId, cursId,
__LINK = "link",
__CLICK = "click";

$.globalMenuNavi = function(menus) {
	menus = menus || [];

	elementCache(menus);

	var menu;
	for (var i = 0, len = menus.length; i < len; ++i) {
		menu = menus[i];

		if (menu.action == __CLICK) (function() {
			var gId = menu.global,
				sId = menu.sub;

			$(gId).click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				if (gId == curgId)
					return;

				setCurSelected(gId, sId);

				$(curgId).animate({ opacity: 0.2 }, {
					duration: 300,
					easing: "easeOutBack",
					complete: function() {
						showMenu(gId, sId);
						$(curgId).animate({ opacity: 1 }, {
							duration: 400,
							easing: "easeOutBack",
							complete: function() {
							}
						});
					}
				});
			});
		})();
		else if (menu.action == __LINK) (function() {
			var gId = menu.global,
				sId = menu.sub;
			showMenu(gId, sId);
		})();
	}

	return $.globalMenuNavi;
};

function elementCache(menus){
	var menu;
	for (var i=0, len=menus.length; i<len; ++i) {
		menu = menus[i];
		menu.sub = menu.global + "-sub";

		if ($(menu.global).hasClass("focus"))
			setCurSelected(menu.global, menu.sub);

		if (menu.global)
			globalElems.push($(menu.global));
		if (menu.sub)
			subElems.push($(menu.sub));
	}
}

function setCurSelected(gId, sId) {
	curgId = gId;
	cursId = sId;
}

function showMenu(gId, sId) {
	// グローバルメニューの切り替え
	if (gId) {
		for (var i = 0, len = globalElems.length; i < len; ++i) {
			if ("#" + globalElems[i].attr("id") == gId) {
				globalElems[i].parent().addClass("focus");
			} else {
				globalElems[i].parent().removeClass("focus");
			}
		}
	}

	// サブメニューの切り替え
	if (sId) {
		for (var i = 0, len = subElems.length; i < len; ++i) {
			if ("#" + subElems[i].attr("id") == sId)
				subElems[i].removeClass("display-none").addClass("display-block");
			else
				subElems[i].removeClass("display-block").addClass("display-none");
		}
	}
}

function showSubMenu(sId, menuId) {
	$(sId).find("li").each(function(){
		if ("#" + $(this).attr("id") == menuId) {
			// いつでもリンクをクリックできるようにするためコメントアウト
//				var html = $(this)
//					.addClass("on")
//					.find("a")
//					.html();
//				$(this).html(html);
		} else {
			$(this).removeClass("on");
		}
	});
}

// 画面ロード時にグローバルナビを#globalMenu、#subMenuのvalの要素に切り替えます。
$.globalMenuNavi.load = function() {

	var mainMenuId = ["#", $("#globalMenuId").val()].join("");
	var subMenuId = ["#", $("#globalMenuId").val(), "-sub"].join("");
	var menuId = ["#", $("#subMenu").val()].join("");

	// グローバル、サブメニューの切り替え
	showMenu(mainMenuId, subMenuId);

	// サブメニューの中のメニューの切り替え
	showSubMenu(subMenuId, menuId);
}

})(jQuery);
