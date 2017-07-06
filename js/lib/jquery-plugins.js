
(function($) {
	/*
	 * relevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 親子の関連チェック
	 */
	// 親子の関連チェック
	$.relevance = function(options) {

		function CheckRelevance (options) {
			var parent = options.parent, // 親のセレクタ
				children = options.children, // 子のセレクタ
				clazz = options.clazz; // クラス名

			// 親が選択された場合は、子をすべて選択する。
			this.checkChildren = function () {
				if (clazz) {
					if (parent.hasClass(clazz)) {
						children.addClass(clazz);
					}
					else {
						children.removeClass(clazz);
					}
				} else {
					if (parent.is(':checked')) {
						children.attr('checked', 'checked');
					}
					else {
						children.removeAttr('checked');
					}
				}
			};

			// 子がすべて選択された場合は、親を選択する。
			this.checkParent = function () {
				if (clazz) {
					var isAllSelect = _.all(children, function (date) {
						return $(date).hasClass(clazz);
					});

					if (isAllSelect) {
						parent.addClass(clazz);
					}
					else {
						parent.removeClass(clazz);
					}
				} else {
					var isAllSelect = _.all(children, function (date) {
						return $(date).is(':checked');
					});

					if (isAllSelect) {
						parent.attr('checked', 'checked');
					}
					else {
						parent.removeAttr('checked');
					}
				}
			};
		}
		return new CheckRelevance(options);
	};
})(jQuery);


(function($) {
	/*
	 * checkRelevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 「すべてにチェック」をクリックした際に、親子関連チェックを行う
	 */
	$.fn.checkRelevance = function(options) {
		// デフォルト値
		var defaults = {
			clazz : null,
			parentCallback: null,
			childCallback: null
		};

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(defaults, options);

		$(this).each(function() {
			var that = $(this),
				childclass = that.data('childclass'),
				children = $(childclass),
				checkRelevance = $.relevance({parent: that, children: children, clazz: settings.clazz});
			that.click(function(e) {
				e.stopPropagation();
				var self = $(this);
				if (settings.clazz) {
					e.preventDefault();
					if(self.hasClass(settings.clazz)) {
						self.removeClass(settings.clazz);
					} else {
						self.addClass(settings.clazz);
					}
				}
				
				checkRelevance.checkChildren();

				if (settings.parentCallback) {
					settings.parentCallback({parent: that, children: children, self: $(this)});
				}
			});
			children.each(function() {
				$(this).click(function(e) {
					e.stopPropagation();
					var self = $(this);
					if (settings.clazz) {
						e.preventDefault();
						if(self.hasClass(settings.clazz)) {
							self.removeClass(settings.clazz);
						} else {
							self.addClass(settings.clazz);
						}
					}
					
					checkRelevance.checkParent();

					if (settings.childCallback) {
						settings.childCallback({parent: that, children: children, self: $(this)});
					}
				});
			});
			checkRelevance.checkParent();
		});
	};
})(jQuery);

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
(function($) {
  $.fn.charCount = function(conf){
    var defaults = {
      allowed: 140,
      counterTarget: '#counter',
      cssWarning: 'warning'
    };

    var conf = $.extend(defaults, conf);

    function calculate(obj){
      var count = $(obj).val().length;
      var available = conf.allowed - count;
      if(available < 0){
        $(conf.counterTarget).addClass(conf.cssWarning);
      } else {
        $(conf.counterTarget).removeClass(conf.cssWarning);
      }
      $(conf.counterTarget).html(available);
    };

    this.each(function() {
      calculate(this);
      $(this).keyup(function(){calculate(this)});
      $(this).change(function(){calculate(this)});
    });

  };
})(jQuery);
(function($) {
/*
 * customEach
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Options:
 * eachCount - setTimeoutを挟みたいカウント数
 * init - 最初に実行したい関数
 * loop - ループ処理時に実行したい関数
 * callback - 最後に実行したい関数
 *
 * Description:
 * 適度にループしたい場合に使えるです。
 *   重いループのとき、IEとかでスクリプト停止のダイアログが出てしまう場合があるが、
 *   これを防ぐために、eachCountずつsetTimeoutを挟むためダイアログが出ないようにできる
 *   ※注意！ customEachを連続して実行したい場合は、必ずcallbackに入れること。
 */

$.customEach = function(object, options) {
	new customEach(object, options);
};

function customEach(object, options) {
	var opts = {
		eachCount: 1,
		eachLength: null,
		init: function() {},
		loop: function() {},
		callback: function() {}
	};

	var makeObject = make(object, options);
		options = makeObject.options;
		object = makeObject.object;

	$.extend(opts, options);

	var i = 0,
		max = object ? object.length : opts.eachLength,
		len;

	object = object ? object : new Array;

	opts.init();
	(function() {
		len = customLen(max, opts.eachCount, i);

		for (;i < len; ++i) {
			opts.loop.call(object[i], i, object[i]);
		}

		if (max <= len){
			opts.callback();
			return;
		}

		setTimeout(arguments.callee, 0);
	})();
}

function make(object, options) {
	var ret = {
		options: null,
		object: null
	};

	if ($.isArray(object) || object && object.length) {
		ret.object = object;
		ret.options = options;
	} else {
		ret.object = null;
		ret.options = object;
	}

	return ret;
}

function customLen(max, count, i) {
	return (function() {
		var next = i + count,
			ret;

		if (max >= next) {
			ret = next;
		} else {
			ret = max;
		}

		return ret;
	})();
}

})(jQuery);


(function($) {
/*
 * imageLazyLoader
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * �摜�x�����[�_�[
 * $("#hoge img, #foo img").imageLazyLoader({ threshold: 200 });
 */

var opts = {
		threshold: 0,			// ��ǂ�px
		container: window		// �X�N���[���R���e�i
	},

	selector = null,

	_IMAGE_CACHE = null,

	EVENT_NAME = "scroll.imageLazyLoader"

	;

$.fn.imageLazyLoader = function(options){
	_IMAGE_CACHE = $.makeArray(this);
	selector = $(this).selector;
	$.imageLazyLoader(options);
};

$.imageLazyLoader = function(options){
	$.extend(opts, options);

	bindScroll();

	// fire
	$(opts.container).trigger(EVENT_NAME);

	return $.imageLazyLoader;
};

$.imageLazyLoader.refresh = function() {
	_IMAGE_CACHE = $.makeArray($(selector));

	// fire
	$(opts.container).trigger(EVENT_NAME);
};

$.imageLazyLoader.unbind = function() {
	$(opts.container).unbind(EVENT_NAME);
};

function bindScroll() {
	// scroll event
	$(opts.container).bind(EVENT_NAME, function(event) {
		var elements = _IMAGE_CACHE,
			container = $(opts.container),
			height = container.height(),
			scrollTop = container.scrollTop();

		// �����Ă�for��
		for (var i = 0, len = elements.length; i < len; ++i)(function(i) {
			var elem = elements[i];

			// ��ʕ\�����W�łȂ��ꍇ
			if (!belowthefold(elem, opts, height, scrollTop) || abovethetop(elem, opts, height, scrollTop)) { return; }

			// ���[�h�����I
			var self = elem;
			$("<img />")
				.bind("load", function() {
					$(self)
						.attr("src", $(self).attr("osrc"))
						.data("loaded", true);
				})
				.attr("src", $(self).attr("osrc"));
		})(i);

		// ���łɉ摜�����[�h�����v�f�͏�������
		removeAlreadyElement();
	});
}

function removeAlreadyElement() {
	var elements = _IMAGE_CACHE,
		_elements = [],
		elem = null;

	for (var i = 0, len = elements.length; i < len; ++i) {
		elem = elements[i];

		// �摜���܂����[�h����Ă��Ȃ�
		if (!$(elem).data("loaded")) { _elements.push(elem); };
	}

	_IMAGE_CACHE = _elements;
}

//�o���ʒu�ɂ���
function belowthefold(element, settings, height, scrollTop) {
	var fold = height + scrollTop;
	return fold > $(element).offset().top - settings.threshold;
}

// ��ʂ��������
function abovethetop(element, settings, height, scrollTop) {
	var fold = scrollTop;
	return fold >= $(element).offset().top + settings.threshold  + $(element).height();
}
})(jQuery);
(function($){
	/**
	 * Jquery プラグイン 画像ロード監視
	 */
	$.fn.imagesLoaded = function(callback){
		var elems = this.filter('img'),
			len   = elems.length,
			blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

		elems.bind('load.imgloaded',function(){
			if (--len <= 0 && this.src !== blank){
				elems.unbind('load.imgloaded');
				callback.call(elems,this);
			}
		}).each(function(){
			// cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined){
				var src = this.src;
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				// data uri bypasses webkit log warning (thx doug jones)
				this.src = blank;
				this.src = src;
			}
		});

		return this;
	};
})(jQuery);

/*
 * imgAreaSelect jQuery plugin
 * version 0.9.3
 *
 * Copyright (c) 2008-2010 Michal Wojciechowski (odyniec.net)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://odyniec.net/projects/imgareaselect/
 *
 */

(function($) {

var abs = Math.abs,
    max = Math.max,
    min = Math.min,
    round = Math.round;

function div() {
    return $('<div/>');
}

$.imgAreaSelect = function (img, options) {
    var

        $img = $(img),

        imgLoaded,

        $box = div(),
        $area = div(),
        $border = div().add(div()).add(div()).add(div()),
        $outer = div().add(div()).add(div()).add(div()),
        $handles = $([]),

        $areaOpera,

        left, top,

        imgOfs,

        imgWidth, imgHeight,

        $parent,

        parOfs,

        zIndex = 0,

        position = 'absolute',

        startX, startY,

        scaleX, scaleY,

        resizeMargin = 10,

        resize,

        minWidth, minHeight, maxWidth, maxHeight,

        aspectRatio,

        shown,

        x1, y1, x2, y2,

        selection = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 },

        docElem = document.documentElement,

        $p, d, i, o, w, h, adjusted;

    function viewX(x) {
        return x + imgOfs.left - parOfs.left;
    }

    function viewY(y) {
        return y + imgOfs.top - parOfs.top;
    }

    function selX(x) {
        return x - imgOfs.left + parOfs.left;
    }

    function selY(y) {
        return y - imgOfs.top + parOfs.top;
    }

    function evX(event) {
        return event.pageX - parOfs.left;
    }

    function evY(event) {
        return event.pageY - parOfs.top;
    }

    function getSelection(noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        return { x1: round(selection.x1 * sx),
            y1: round(selection.y1 * sy),
            x2: round(selection.x2 * sx),
            y2: round(selection.y2 * sy),
            width: round(selection.x2 * sx) - round(selection.x1 * sx),
            height: round(selection.y2 * sy) - round(selection.y1 * sy) };
    }

    function setSelection(x1, y1, x2, y2, noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        selection = {
            x1: round(x1 / sx),
            y1: round(y1 / sy),
            x2: round(x2 / sx),
            y2: round(y2 / sy)
        };

        selection.width = selection.x2 - selection.x1;
        selection.height = selection.y2 - selection.y1;
    }

    function adjust() {
        if (!$img.width())
            return;

        imgOfs = { left: round($img.offset().left), top: round($img.offset().top) };

        imgWidth = $img.width();
        imgHeight = $img.height();

        minWidth = options.minWidth || 0;
        minHeight = options.minHeight || 0;
        maxWidth = min(options.maxWidth || 1<<24, imgWidth);
        maxHeight = min(options.maxHeight || 1<<24, imgHeight);

        if ($().jquery == '1.3.2' && position == 'fixed' &&
            !docElem['getBoundingClientRect'])
        {
            imgOfs.top += max(document.body.scrollTop, docElem.scrollTop);
            imgOfs.left += max(document.body.scrollLeft, docElem.scrollLeft);
        }

        parOfs = $.inArray($parent.css('position'), ['absolute', 'relative']) + 1 ?
            { left: round($parent.offset().left) - $parent.scrollLeft(),
                top: round($parent.offset().top) - $parent.scrollTop() } :
            position == 'fixed' ?
                { left: $(document).scrollLeft(), top: $(document).scrollTop() } :
                { left: 0, top: 0 };

        left = viewX(0);
        top = viewY(0);

        if (selection.x2 > imgWidth || selection.y2 > imgHeight)
            doResize();
    }

    function update(resetKeyPress) {
        if (!shown) return;

        $box.css({ left: viewX(selection.x1), top: viewY(selection.y1) })
            .add($area).width(w = selection.width).height(h = selection.height);

        $area.add($border).add($handles).css({ left: 0, top: 0 });

        $border
            .width(max(w - $border.outerWidth() + $border.innerWidth(), 0))
            .height(max(h - $border.outerHeight() + $border.innerHeight(), 0));

        $($outer[0]).css({ left: left, top: top,
            width: selection.x1, height: imgHeight });
        $($outer[1]).css({ left: left + selection.x1, top: top,
            width: w, height: selection.y1 });
        $($outer[2]).css({ left: left + selection.x2, top: top,
            width: imgWidth - selection.x2, height: imgHeight });
        $($outer[3]).css({ left: left + selection.x1, top: top + selection.y2,
            width: w, height: imgHeight - selection.y2 });

        w -= $handles.outerWidth();
        h -= $handles.outerHeight();

        switch ($handles.length) {
        case 8:
            $($handles[4]).css({ left: w / 2 });
            $($handles[5]).css({ left: w, top: h / 2 });
            $($handles[6]).css({ left: w / 2, top: h });
            $($handles[7]).css({ top: h / 2 });
        case 4:
            $handles.slice(1,3).css({ left: w });
            $handles.slice(2,4).css({ top: h });
        }

        if (resetKeyPress !== false) {
            if ($.imgAreaSelect.keyPress != docKeyPress)
                $(document).unbind($.imgAreaSelect.keyPress,
                    $.imgAreaSelect.onKeyPress);

            if (options.keys)
                $(document)[$.imgAreaSelect.keyPress](
                    $.imgAreaSelect.onKeyPress = docKeyPress);
        }

        if ($.browser.msie && $border.outerWidth() - $border.innerWidth() == 2) {
            $border.css('margin', 0);
            setTimeout(function () { $border.css('margin', 'auto'); }, 0);
        }
    }

    function doUpdate(resetKeyPress) {
        adjust();
        update(resetKeyPress);
        x1 = viewX(selection.x1); y1 = viewY(selection.y1);
        x2 = viewX(selection.x2); y2 = viewY(selection.y2);
    }

    function hide($elem, fn) {
        options.fadeSpeed ? $elem.fadeOut(options.fadeSpeed, fn) : $elem.hide();

    }

    function areaMouseMove(event) {
        var x = selX(evX(event)) - selection.x1,
            y = selY(evY(event)) - selection.y1;

        if (!adjusted) {
            adjust();
            adjusted = true;

            $box.one('mouseout', function () { adjusted = false; });
        }

        resize = '';

        if (options.resizable) {
            if (y <= resizeMargin)
                resize = 'n';
            else if (y >= selection.height - resizeMargin)
                resize = 's';
            if (x <= resizeMargin)
                resize += 'w';
            else if (x >= selection.width - resizeMargin)
                resize += 'e';
        }

        $box.css('cursor', resize ? resize + '-resize' :
            options.movable ? 'move' : '');
        if ($areaOpera)
            $areaOpera.toggle();
    }

    function docMouseUp(event) {
        $('body').css('cursor', '');

        if (options.autoHide || selection.width * selection.height == 0)
            hide($box.add($outer), function () { $(this).hide(); });

        options.onSelectEnd(img, getSelection());

        $(document).unbind('mousemove', selectingMouseMove);
        $box.mousemove(areaMouseMove);
    }

    function areaMouseDown(event) {
        if (event.which != 1) return false;

        adjust();

        if (resize) {
            $('body').css('cursor', resize + '-resize');

            x1 = viewX(selection[/w/.test(resize) ? 'x2' : 'x1']);
            y1 = viewY(selection[/n/.test(resize) ? 'y2' : 'y1']);

            $(document).mousemove(selectingMouseMove)
                .one('mouseup', docMouseUp);
            $box.unbind('mousemove', areaMouseMove);
        }
        else if (options.movable) {
            startX = left + selection.x1 - evX(event);
            startY = top + selection.y1 - evY(event);

            $box.unbind('mousemove', areaMouseMove);

            $(document).mousemove(movingMouseMove)
                .one('mouseup', function () {
                    options.onSelectEnd(img, getSelection());

                    $(document).unbind('mousemove', movingMouseMove);
                    $box.mousemove(areaMouseMove);
                });
        }
        else
            $img.mousedown(event);

        return false;
    }

    function fixAspectRatio(xFirst) {
        if (aspectRatio)
            if (xFirst) {
                x2 = max(left, min(left + imgWidth,
                    x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1)));

                y2 = round(max(top, min(top + imgHeight,
                    y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1))));
                x2 = round(x2);
            }
            else {
                y2 = max(top, min(top + imgHeight,
                    y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1)));
                x2 = round(max(left, min(left + imgWidth,
                    x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1))));
                y2 = round(y2);
            }
    }

    function doResize() {
        x1 = min(x1, left + imgWidth);
        y1 = min(y1, top + imgHeight);

        if (abs(x2 - x1) < minWidth) {
            x2 = x1 - minWidth * (x2 < x1 || -1);

            if (x2 < left)
                x1 = left + minWidth;
            else if (x2 > left + imgWidth)
                x1 = left + imgWidth - minWidth;
        }

        if (abs(y2 - y1) < minHeight) {
            y2 = y1 - minHeight * (y2 < y1 || -1);

            if (y2 < top)
                y1 = top + minHeight;
            else if (y2 > top + imgHeight)
                y1 = top + imgHeight - minHeight;
        }

        x2 = max(left, min(x2, left + imgWidth));
        y2 = max(top, min(y2, top + imgHeight));

        fixAspectRatio(abs(x2 - x1) < abs(y2 - y1) * aspectRatio);

        if (abs(x2 - x1) > maxWidth) {
            x2 = x1 - maxWidth * (x2 < x1 || -1);
            fixAspectRatio();
        }

        if (abs(y2 - y1) > maxHeight) {
            y2 = y1 - maxHeight * (y2 < y1 || -1);
            fixAspectRatio(true);
        }

        selection = { x1: selX(min(x1, x2)), x2: selX(max(x1, x2)),
            y1: selY(min(y1, y2)), y2: selY(max(y1, y2)),
            width: abs(x2 - x1), height: abs(y2 - y1) };

        update();

        options.onSelectChange(img, getSelection());
    }

    function selectingMouseMove(event) {
        x2 = resize == '' || /w|e/.test(resize) || aspectRatio ? evX(event) : viewX(selection.x2);
        y2 = resize == '' || /n|s/.test(resize) || aspectRatio ? evY(event) : viewY(selection.y2);

        doResize();

        return false;

    }

    function doMove(newX1, newY1) {
        x2 = (x1 = newX1) + selection.width;
        y2 = (y1 = newY1) + selection.height;

        $.extend(selection, { x1: selX(x1), y1: selY(y1), x2: selX(x2),
            y2: selY(y2) });

        update();

        options.onSelectChange(img, getSelection());
    }

    function movingMouseMove(event) {
        x1 = max(left, min(startX + evX(event), left + imgWidth - selection.width));
        y1 = max(top, min(startY + evY(event), top + imgHeight - selection.height));

        doMove(x1, y1);

        event.preventDefault();

        return false;
    }

    function startSelection() {
        adjust();

        x2 = x1;
        y2 = y1;

        doResize();

        resize = '';

        if ($outer.is(':not(:visible)'))
            $box.add($outer).hide().fadeIn(options.fadeSpeed||0);

        shown = true;

        $(document).unbind('mouseup', cancelSelection)
            .mousemove(selectingMouseMove).one('mouseup', docMouseUp);
        $box.unbind('mousemove', areaMouseMove);

        options.onSelectStart(img, getSelection());
    }

    function cancelSelection() {
        $(document).unbind('mousemove', startSelection);
        hide($box.add($outer));

        selection = { x1: selX(x1), y1: selY(y1), x2: selX(x1), y2: selY(y1),
                width: 0, height: 0 };

        options.onSelectChange(img, getSelection());
        options.onSelectEnd(img, getSelection());
    }

    function imgMouseDown(event) {
        if (event.which != 1 || $outer.is(':animated')) return false;

        adjust();
        startX = x1 = evX(event);
        startY = y1 = evY(event);

        $(document).one('mousemove', startSelection)
            .one('mouseup', cancelSelection);

        return false;
    }

    function windowResize() {
        doUpdate(false);
    }

    function imgLoad() {
        imgLoaded = true;

        setOptions(options = $.extend({
            classPrefix: 'imgareaselect',
            movable: true,
            resizable: true,
            parent: 'body',
            onInit: function () {},
            onSelectStart: function () {},
            onSelectChange: function () {},
            onSelectEnd: function () {}
        }, options));

        $box.add($outer).css({ visibility: '' });

        if (options.show) {
            shown = true;
            adjust();
            update();
            $box.add($outer).hide().fadeIn(options.fadeSpeed||0);
        }

        setTimeout(function () { options.onInit(img, getSelection()); }, 0);
    }

    var docKeyPress = function(event) {
        var k = options.keys, d, t, key = event.keyCode;

        d = !isNaN(k.alt) && (event.altKey || event.originalEvent.altKey) ? k.alt :
            !isNaN(k.ctrl) && event.ctrlKey ? k.ctrl :
            !isNaN(k.shift) && event.shiftKey ? k.shift :
            !isNaN(k.arrows) ? k.arrows : 10;

        if (k.arrows == 'resize' || (k.shift == 'resize' && event.shiftKey) ||
            (k.ctrl == 'resize' && event.ctrlKey) ||
            (k.alt == 'resize' && (event.altKey || event.originalEvent.altKey)))
        {
            switch (key) {
            case 37:
                d = -d;
            case 39:
                t = max(x1, x2);
                x1 = min(x1, x2);
                x2 = max(t + d, x1);
                fixAspectRatio();
                break;
            case 38:
                d = -d;
            case 40:
                t = max(y1, y2);
                y1 = min(y1, y2);
                y2 = max(t + d, y1);
                fixAspectRatio(true);
                break;
            default:
                return;
            }

            doResize();
        }
        else {
            x1 = min(x1, x2);
            y1 = min(y1, y2);

            switch (key) {
            case 37:
                doMove(max(x1 - d, left), y1);
                break;
            case 38:
                doMove(x1, max(y1 - d, top));
                break;
            case 39:
                doMove(x1 + min(d, imgWidth - selX(x2)), y1);
                break;
            case 40:
                doMove(x1, y1 + min(d, imgHeight - selY(y2)));
                break;
            default:
                return;
            }
        }

        return false;
    };

    function styleOptions($elem, props) {
        for (option in props)
            if (options[option] !== undefined)
                $elem.css(props[option], options[option]);
    }

    function setOptions(newOptions) {
        if (newOptions.parent)
            ($parent = $(newOptions.parent)).append($box.add($outer));

        $.extend(options, newOptions);

        adjust();

        if (newOptions.handles != null) {
            $handles.remove();
            $handles = $([]);

            i = newOptions.handles ? newOptions.handles == 'corners' ? 4 : 8 : 0;

            while (i--)
                $handles = $handles.add(div());

            $handles.addClass(options.classPrefix + '-handle').css({
                position: 'absolute',
                fontSize: 0,
                zIndex: zIndex + 1 || 1
            });

            if (!parseInt($handles.css('width')) >= 0)
                $handles.width(5).height(5);

            if (o = options.borderWidth)
                $handles.css({ borderWidth: o, borderStyle: 'solid' });

            styleOptions($handles, { borderColor1: 'border-color',
                borderColor2: 'background-color',
                borderOpacity: 'opacity' });
        }

        scaleX = options.imageWidth / imgWidth || 1;
        scaleY = options.imageHeight / imgHeight || 1;

        if (newOptions.x1 != null) {
            setSelection(newOptions.x1, newOptions.y1, newOptions.x2,
                newOptions.y2);
            newOptions.show = !newOptions.hide;
        }

        if (newOptions.keys)
            options.keys = $.extend({ shift: 1, ctrl: 'resize' },
                newOptions.keys);

        $outer.addClass(options.classPrefix + '-outer');
        $area.addClass(options.classPrefix + '-selection');
        for (i = 0; i++ < 4;)
            $($border[i-1]).addClass(options.classPrefix + '-border' + i);

        styleOptions($area, { selectionColor: 'background-color',
            selectionOpacity: 'opacity' });
        styleOptions($border, { borderOpacity: 'opacity',
            borderWidth: 'border-width' });
        styleOptions($outer, { outerColor: 'background-color',
            outerOpacity: 'opacity' });
        if (o = options.borderColor1)
            $($border[0]).css({ borderStyle: 'solid', borderColor: o });
        if (o = options.borderColor2)
            $($border[1]).css({ borderStyle: 'dashed', borderColor: o });

        $box.append($area.add($border).add($handles).add($areaOpera));

        if ($.browser.msie) {
            if (o = $outer.css('filter').match(/opacity=([0-9]+)/))
                $outer.css('opacity', o[1]/100);
            if (o = $border.css('filter').match(/opacity=([0-9]+)/))
                $border.css('opacity', o[1]/100);
        }

        if (newOptions.hide)
            hide($box.add($outer));
        else if (newOptions.show && imgLoaded) {
            shown = true;
            $box.add($outer).fadeIn(options.fadeSpeed||0);
            doUpdate();
        }

        aspectRatio = (d = (options.aspectRatio || '').split(/:/))[0] / d[1];

        $img.add($outer).unbind('mousedown', imgMouseDown);

        if (options.disable || options.enable === false) {
            $box.unbind('mousemove', areaMouseMove).unbind('mousedown', areaMouseDown);
            $(window).unbind('resize', windowResize);
        }
        else {
            if (options.enable || options.disable === false) {
                if (options.resizable || options.movable)
                    $box.mousemove(areaMouseMove).mousedown(areaMouseDown);

                $(window).resize(windowResize);
            }

            if (!options.persistent)
                $img.add($outer).mousedown(imgMouseDown);
        }

        options.enable = options.disable = undefined;
    }

    this.remove = function () {
        $img.unbind('mousedown', imgMouseDown);
        $box.add($outer).remove();
    };

    this.getOptions = function () { return options; };

    this.setOptions = setOptions;

    this.getSelection = getSelection;

    this.setSelection = setSelection;

    this.update = doUpdate;

    $p = $img;

    while ($p.length) {
        zIndex = max(zIndex,
            !isNaN($p.css('z-index')) ? $p.css('z-index') : zIndex);
        if ($p.css('position') == 'fixed')
            position = 'fixed';

        $p = $p.parent(':not(body)');
    }

    zIndex = options.zIndex || zIndex;

    if ($.browser.msie)
        $img.attr('unselectable', 'on');

    $.imgAreaSelect.keyPress = $.browser.msie ||
        $.browser.safari ? 'keydown' : 'keypress';

    if ($.browser.opera)
        $areaOpera = div().css({ width: '100%', height: '100%',
            position: 'absolute', zIndex: zIndex + 2 || 2 });

    $box.add($outer).css({ visibility: 'hidden', position: position,
        overflow: 'hidden', zIndex: zIndex || '0' });
    $box.css({ zIndex: zIndex + 2 || 2 });
    $area.add($border).css({ position: 'absolute', fontSize: 0 });

    img.complete || img.readyState == 'complete' || !$img.is('img') ?
        imgLoad() : $img.one('load', imgLoad);
};

$.fn.imgAreaSelect = function (options) {
    options = options || {};

    this.each(function () {
        if ($(this).data('imgAreaSelect')) {
            if (options.remove) {
                $(this).data('imgAreaSelect').remove();
                $(this).removeData('imgAreaSelect');
            }
            else
                $(this).data('imgAreaSelect').setOptions(options);
        }
        else if (!options.remove) {
            if (options.enable === undefined && options.disable === undefined)
                options.enable = true;

            $(this).data('imgAreaSelect', new $.imgAreaSelect(this, options));
        }
    });

    if (options.instance)
        return $(this).data('imgAreaSelect');

    return this;
};

})(jQuery);
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


(function($) {
/*
 * jKeyup
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Options:
 * 　callback
 *
 * Description:
 * 　Windows:Operaは全角文字入力時にkeyup、keydown、keypressが発生しないので
 * 　その差分を吸収します。
 * 　callbackの第1引数にtextのvalue、第2引数にOpera以外の場合はeventを渡します。
 */

$.fn.jKeyup = function(fn) {
	init($(this), fn);
};

function init(elem, fn) {
	var jkeyup = new jKeyup();
	jkeyup.callback = fn ? fn : function() {};
	jkeyup.elem = elem;

	prevent(jkeyup);
}

function prevent(s) {
	var elem = s.elem;

	// Operaの場合はTimerで監視
	if ($.browser.opera) {
		elem.focus(function(event) {
				var val = "";
				s.interval = setInterval(function() {
					if (val != elem.val()) {
						val = elem.val();
						s.callback.call(elem, val);
					}
				}, 100);
			})
		.blur(function(event) {
				clearInterval(s.interval);
			});
	} else {
		elem.keyup(function(event) {
			s.callback.call(elem, elem.val(), event);
		});
	}
}

function jKeyup() {}
jKeyup.prototype = {
	elem: null, callback: null, interval: null
}

})(jQuery);
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.3.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2010-01-23
 * @link    http://jscolor.com
 */


var jscolor = {


  dir : '../img/', // location of jscolor directory (leave empty to autodetect)
  bindClass : 'color', // class name
  binding : true, // automatic binding via <input class="...">
  preloading : true, // use image preloading?


  install : function() {
    jscolor.addEvent(window, 'load', jscolor.init);
  },


  init : function() {
    if(jscolor.binding) {
      jscolor.bind();
    }
    if(jscolor.preloading) {
      jscolor.preload();
    }
  },


  getDir : function() {
    if(!jscolor.dir) {
      var detected = jscolor.detectDir();
      jscolor.dir = detected!==false ? detected : 'jscolor/';
    }
    return jscolor.dir;
  },


  detectDir : function() {
    var base = location.href;

    var e = document.getElementsByTagName('base');
    for(var i=0; i<e.length; i+=1) {
      if(e[i].href) { base = e[i].href; }
    }

    var e = document.getElementsByTagName('script');
    for(var i=0; i<e.length; i+=1) {
      if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
        var src = new jscolor.URI(e[i].src);
        var srcAbs = src.toAbsolute(base);
        srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
        srcAbs.query = null;
        srcAbs.fragment = null;
        return srcAbs.toString();
      }
    }
    return false;
  },


  bind : function() {
    var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
    var e = document.getElementsByTagName('input');
    for(var i=0; i<e.length; i+=1) {
      var m;
      if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
        var prop = {};
        if(m[3]) {
          try {
            eval('prop='+m[3]);
          } catch(eInvalidProp) {}
        }
        e[i].color = new jscolor.color(e[i], prop);
      }
    }
  },


  preload : function() {
    for(var fn in jscolor.imgRequire) {
      if(jscolor.imgRequire.hasOwnProperty(fn)) {
        jscolor.loadImage(fn);
      }
    }
  },


  images : {
    pad : [ 181, 101 ],
    sld : [ 16, 101 ],
    cross : [ 15, 15 ],
    arrow : [ 7, 11 ]
  },


  imgRequire : {},
  imgLoaded : {},


  requireImage : function(filename) {
    jscolor.imgRequire[filename] = true;
  },


  loadImage : function(filename) {
    if(!jscolor.imgLoaded[filename]) {
      jscolor.imgLoaded[filename] = new Image();
      jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
    }
  },


  fetchElement : function(mixed) {
    return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
  },


  addEvent : function(el, evnt, func) {
    if(el.addEventListener) {
      el.addEventListener(evnt, func, false);
    } else if(el.attachEvent) {
      el.attachEvent('on'+evnt, func);
    }
  },


  fireEvent : function(el, evnt) {
    if(!el) {
      return;
    }
    if(document.createEventObject) {
      var ev = document.createEventObject();
      el.fireEvent('on'+evnt, ev);
    } else if(document.createEvent) {
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent(evnt, true, true);
      el.dispatchEvent(ev);
    } else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
      el['on'+evnt]();
    }
  },


  getElementPos : function(e) {
    var e1=e, e2=e;
    var x=0, y=0;
    if(e1.offsetParent) {
      do {
        x += e1.offsetLeft;
        y += e1.offsetTop;
      } while(e1 = e1.offsetParent);
    }
    while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
      x -= e2.scrollLeft;
      y -= e2.scrollTop;
    }
    return [x, y];
  },


  getElementSize : function(e) {
    return [e.offsetWidth, e.offsetHeight];
  },


  getMousePos : function(e) {
    if(!e) { e = window.event; }
    if(typeof e.pageX === 'number') {
      return [e.pageX, e.pageY];
    } else if(typeof e.clientX === 'number') {
      return [
        e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
        e.clientY + document.body.scrollTop + document.documentElement.scrollTop
      ];
    }
  },


  getViewPos : function() {
    if(typeof window.pageYOffset === 'number') {
      return [window.pageXOffset, window.pageYOffset];
    } else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      return [document.body.scrollLeft, document.body.scrollTop];
    } else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
      return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
    } else {
      return [0, 0];
    }
  },


  getViewSize : function() {
    if(typeof window.innerWidth === 'number') {
      return [window.innerWidth, window.innerHeight];
    } else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
      return [document.body.clientWidth, document.body.clientHeight];
    } else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else {
      return [0, 0];
    }
  },


  URI : function(uri) { // See RFC3986

    this.scheme = null;
    this.authority = null;
    this.path = '';
    this.query = null;
    this.fragment = null;

    this.parse = function(uri) {
      var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
      this.scheme = m[3] ? m[2] : null;
      this.authority = m[5] ? m[6] : null;
      this.path = m[7];
      this.query = m[9] ? m[10] : null;
      this.fragment = m[12] ? m[13] : null;
      return this;
    };

    this.toString = function() {
      var result = '';
      if(this.scheme !== null) { result = result + this.scheme + ':'; }
      if(this.authority !== null) { result = result + '//' + this.authority; }
      if(this.path !== null) { result = result + this.path; }
      if(this.query !== null) { result = result + '?' + this.query; }
      if(this.fragment !== null) { result = result + '#' + this.fragment; }
      return result;
    };

    this.toAbsolute = function(base) {
      var base = new jscolor.URI(base);
      var r = this;
      var t = new jscolor.URI;

      if(base.scheme === null) { return false; }

      if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
        r.scheme = null;
      }

      if(r.scheme !== null) {
        t.scheme = r.scheme;
        t.authority = r.authority;
        t.path = removeDotSegments(r.path);
        t.query = r.query;
      } else {
        if(r.authority !== null) {
          t.authority = r.authority;
          t.path = removeDotSegments(r.path);
          t.query = r.query;
        } else {
          if(r.path === '') { // TODO: == or === ?
            t.path = base.path;
            if(r.query !== null) {
              t.query = r.query;
            } else {
              t.query = base.query;
            }
          } else {
            if(r.path.substr(0,1) === '/') {
              t.path = removeDotSegments(r.path);
            } else {
              if(base.authority !== null && base.path === '') { // TODO: == or === ?
                t.path = '/'+r.path;
              } else {
                t.path = base.path.replace(/[^\/]+$/,'')+r.path;
              }
              t.path = removeDotSegments(t.path);
            }
            t.query = r.query;
          }
          t.authority = base.authority;
        }
        t.scheme = base.scheme;
      }
      t.fragment = r.fragment;

      return t;
    };

    function removeDotSegments(path) {
      var out = '';
      while(path) {
        if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
          path = path.replace(/^\.+/,'').substr(1);
        } else if(path.substr(0,3)==='/./' || path==='/.') {
          path = '/'+path.substr(3);
        } else if(path.substr(0,4)==='/../' || path==='/..') {
          path = '/'+path.substr(4);
          out = out.replace(/\/?[^\/]*$/, '');
        } else if(path==='.' || path==='..') {
          path = '';
        } else {
          var rm = path.match(/^\/?[^\/]*/)[0];
          path = path.substr(rm.length);
          out = out + rm;
        }
      }
      return out;
    }

    if(uri) {
      this.parse(uri);
    }

  },


  /*
   * Usage example:
   * var myColor = new jscolor.color(myInputElement)
   */

  color : function(target, prop) {


    this.required = true; // refuse empty values?
    this.adjust = true; // adjust value to uniform notation?
    this.hash = false; // prefix color with # symbol?
    this.caps = true; // uppercase?
    this.valueElement = target; // value holder
    this.styleElement = target; // where to reflect current color
    this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
    this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1

    this.pickerOnfocus = true; // display picker on focus?
    this.pickerMode = 'HSV'; // HSV | HVS
    this.pickerPosition = 'bottom'; // left | right | top | bottom
    this.pickerFace = 10; // px
    this.pickerFaceColor = 'ThreeDFace'; // CSS color
    this.pickerBorder = 1; // px
    this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
    this.pickerInset = 1; // px
    this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
    this.pickerZIndex = 10000;


    for(var p in prop) {
      if(prop.hasOwnProperty(p)) {
        this[p] = prop[p];
      }
    }


    this.hidePicker = function() {
      if(isPickerOwner()) {
        removePicker();
      }
    };


    this.showPicker = function() {
      if(!isPickerOwner()) {
        var tp = jscolor.getElementPos(target); // target pos
        var ts = jscolor.getElementSize(target); // target size
        var vp = jscolor.getViewPos(); // view pos
        var vs = jscolor.getViewSize(); // view size
        var ps = [ // picker size
          2*this.pickerBorder + 4*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0],
          2*this.pickerBorder + 2*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[1]
        ];
        var a, b, c;
        switch(this.pickerPosition.toLowerCase()) {
          case 'left': a=1; b=0; c=-1; break;
          case 'right':a=1; b=0; c=1; break;
          case 'top':  a=0; b=1; c=-1; break;
          default:     a=0; b=1; c=1; break;
        }
        var l = (ts[b]+ps[b])/2;
        var pp = [ // picker pos
          -vp[a]+tp[a]+ps[a] > vs[a] ?
            (-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
            tp[a],
          -vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
            (-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
            (tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
        ];
        drawPicker(pp[a], pp[b]);
      }
    };


    this.importColor = function() {
      if(!valueElement) {
        this.exportColor();
      } else {
        if(!this.adjust) {
          if(!this.fromString(valueElement.value, leaveValue)) {
            styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
            styleElement.style.color = styleElement.jscStyle.color;
            this.exportColor(leaveValue | leaveStyle);
          }
        } else if(!this.required && /^\s*$/.test(valueElement.value)) {
          valueElement.value = '';
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
          styleElement.style.color = styleElement.jscStyle.color;
          this.exportColor(leaveValue | leaveStyle);

        } else if(this.fromString(valueElement.value)) {
          // OK
        } else {
          this.exportColor();
        }
      }
    };


    this.exportColor = function(flags) {
      if(!(flags & leaveValue) && valueElement) {
        var value = this.toString();
        if(this.caps) { value = value.toUpperCase(); }
        if(this.hash) { value = '#'+value; }
        valueElement.value = value;
      }
      if(!(flags & leaveStyle) && styleElement) {
        styleElement.style.backgroundColor =
          '#'+this.toString();
        styleElement.style.color =
          0.213 * this.rgb[0] +
          0.715 * this.rgb[1] +
          0.072 * this.rgb[2]
          < 0.5 ? '#FFF' : '#000';
      }
      if(!(flags & leavePad) && isPickerOwner()) {
        redrawPad();
      }
      if(!(flags & leaveSld) && isPickerOwner()) {
        redrawSld();
      }
    };


    this.fromHSV = function(h, s, v, flags) { // null = don't change
      h<0 && (h=0) || h>6 && (h=6);
      s<0 && (s=0) || s>1 && (s=1);
      v<0 && (v=0) || v>1 && (v=1);
      this.rgb = HSV_RGB(
        h===null ? this.hsv[0] : (this.hsv[0]=h),
        s===null ? this.hsv[1] : (this.hsv[1]=s),
        v===null ? this.hsv[2] : (this.hsv[2]=v)
      );
      this.exportColor(flags);
    };


    this.fromRGB = function(r, g, b, flags) { // null = don't change
      r<0 && (r=0) || r>1 && (r=1);
      g<0 && (g=0) || g>1 && (g=1);
      b<0 && (b=0) || b>1 && (b=1);
      var hsv = RGB_HSV(
        r===null ? this.rgb[0] : (this.rgb[0]=r),
        g===null ? this.rgb[1] : (this.rgb[1]=g),
        b===null ? this.rgb[2] : (this.rgb[2]=b)
      );
      if(hsv[0] !== null) {
        this.hsv[0] = hsv[0];
      }
      if(hsv[2] !== 0) {
        this.hsv[1] = hsv[1];
      }
      this.hsv[2] = hsv[2];
      this.exportColor(flags);
    };


    this.fromString = function(hex, flags) {
      var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
      if(!m) {
        return false;
      } else {
        if(m[1].length === 6) { // 6-char notation
          this.fromRGB(
            parseInt(m[1].substr(0,2),16) / 255,
            parseInt(m[1].substr(2,2),16) / 255,
            parseInt(m[1].substr(4,2),16) / 255,
            flags
          );
        } else { // 3-char notation
          this.fromRGB(
            parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
            parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
            parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
            flags
          );
        }
        return true;
      }
    };


    this.toString = function() {
      return (
        (0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
        (0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
        (0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
      );
    };


    function RGB_HSV(r, g, b) {
      var n = Math.min(Math.min(r,g),b);
      var v = Math.max(Math.max(r,g),b);
      var m = v - n;
      if(m === 0) { return [ null, 0, v ]; }
      var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
      return [ h===6?0:h, m/v, v ];
    }


    function HSV_RGB(h, s, v) {
      if(h === null) { return [ v, v, v ]; }
      var i = Math.floor(h);
      var f = i%2 ? h-i : 1-(h-i);
      var m = v * (1 - s);
      var n = v * (1 - s*f);
      switch(i) {
        case 6:
        case 0: return [v,n,m];
        case 1: return [n,v,m];
        case 2: return [m,v,n];
        case 3: return [m,n,v];
        case 4: return [n,m,v];
        case 5: return [v,m,n];
      }
    }


    function removePicker() {
      delete jscolor.picker.owner;
      document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
    }


    function drawPicker(x, y) {
      if(!jscolor.picker) {
        jscolor.picker = {
          box : document.createElement('div'),
          boxB : document.createElement('div'),
          pad : document.createElement('div'),
          padB : document.createElement('div'),
          padM : document.createElement('div'),
          sld : document.createElement('div'),
          sldB : document.createElement('div'),
          sldM : document.createElement('div')
        };
        for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
          var seg = document.createElement('div');
          seg.style.height = segSize+'px';
          seg.style.fontSize = '1px';
          seg.style.lineHeight = '0';
          jscolor.picker.sld.appendChild(seg);
        }
        jscolor.picker.sldB.appendChild(jscolor.picker.sld);
        jscolor.picker.box.appendChild(jscolor.picker.sldB);
        jscolor.picker.box.appendChild(jscolor.picker.sldM);
        jscolor.picker.padB.appendChild(jscolor.picker.pad);
        jscolor.picker.box.appendChild(jscolor.picker.padB);
        jscolor.picker.box.appendChild(jscolor.picker.padM);
        jscolor.picker.boxB.appendChild(jscolor.picker.box);
      }

      var p = jscolor.picker;

      // recompute controls positions
      posPad = [
        x+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset,
        y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];
      posSld = [
        null,
        y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];

      // controls interaction
      p.box.onmouseup =
      p.box.onmouseout = function() { target.focus(); };
      p.box.onmousedown = function() { abortBlur=true; };
      p.box.onmousemove = function(e) { holdPad && setPad(e); holdSld && setSld(e); };
      p.padM.onmouseup =
      p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
      p.padM.onmousedown = function(e) { holdPad=true; setPad(e); };
      p.sldM.onmouseup =
      p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
      p.sldM.onmousedown = function(e) { holdSld=true; setSld(e); };

      // picker
      p.box.style.width = 4*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] + 'px';
      p.box.style.height = 2*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[1] + 'px';

      // picker border
      p.boxB.style.position = 'absolute';
      p.boxB.style.clear = 'both';
      p.boxB.style.left = x+'px';
      p.boxB.style.top = y+'px';
      p.boxB.style.zIndex = THIS.pickerZIndex;
      p.boxB.style.border = THIS.pickerBorder+'px solid';
      p.boxB.style.borderColor = THIS.pickerBorderColor;
      p.boxB.style.background = THIS.pickerFaceColor;

      // pad image
      p.pad.style.width = jscolor.images.pad[0]+'px';
      p.pad.style.height = jscolor.images.pad[1]+'px';

      // pad border
      p.padB.style.position = 'absolute';
      p.padB.style.left = THIS.pickerFace+'px';
      p.padB.style.top = THIS.pickerFace+'px';
      p.padB.style.border = THIS.pickerInset+'px solid';
      p.padB.style.borderColor = THIS.pickerInsetColor;

      // pad mouse area
      p.padM.style.position = 'absolute';
      p.padM.style.left = '0';
      p.padM.style.top = '0';
      p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
      p.padM.style.height = p.box.style.height;
      p.padM.style.cursor = 'crosshair';

      // slider image
      p.sld.style.overflow = 'hidden';
      p.sld.style.width = jscolor.images.sld[0]+'px';
      p.sld.style.height = jscolor.images.sld[1]+'px';

      // slider border
      p.sldB.style.position = 'absolute';
      p.sldB.style.right = THIS.pickerFace+'px';
      p.sldB.style.top = THIS.pickerFace+'px';
      p.sldB.style.border = THIS.pickerInset+'px solid';
      p.sldB.style.borderColor = THIS.pickerInsetColor;

      // slider mouse area
      p.sldM.style.position = 'absolute';
      p.sldM.style.right = '0';
      p.sldM.style.top = '0';
      p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
      p.sldM.style.height = p.box.style.height;
      try {
        p.sldM.style.cursor = 'pointer';
      } catch(eOldIE) {
        p.sldM.style.cursor = 'hand';
      }

      // load images in optimal order
      switch(modeID) {
        case 0: var padImg = 'jquery.jscolor.hs.png'; break;
        case 1: var padImg = 'jquery.jscolor.hv.png'; break;
      }
      p.padM.style.background = "url('"+jscolor.getDir()+"jquery.jscolor.cross.gif') no-repeat";
      p.sldM.style.background = "url('"+jscolor.getDir()+"jquery.jscolor.arrow.gif') no-repeat";
      p.pad.style.background = "url('"+jscolor.getDir()+padImg+"') 0 0 no-repeat";

      // place pointers
      redrawPad();
      redrawSld();

      jscolor.picker.owner = THIS;
      document.getElementsByTagName('body')[0].appendChild(p.boxB);
    }


    function redrawPad() {
      // redraw the pad pointer
      switch(modeID) {
        case 0: var yComponent = 1; break;
        case 1: var yComponent = 2; break;
      }
      var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
      var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
      jscolor.picker.padM.style.backgroundPosition =
        (THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
        (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

      // redraw the slider image
      var seg = jscolor.picker.sld.childNodes;

      switch(modeID) {
        case 0:
          var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
          for(var i=0; i<seg.length; i+=1) {
            seg[i].style.backgroundColor = 'rgb('+
              (rgb[0]*(1-i/seg.length)*100)+'%,'+
              (rgb[1]*(1-i/seg.length)*100)+'%,'+
              (rgb[2]*(1-i/seg.length)*100)+'%)';
          }
          break;
        case 1:
          var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
          var i = Math.floor(THIS.hsv[0]);
          var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
          switch(i) {
            case 6:
            case 0: rgb=[0,1,2]; break;
            case 1: rgb=[1,0,2]; break;
            case 2: rgb=[2,0,1]; break;
            case 3: rgb=[2,1,0]; break;
            case 4: rgb=[1,2,0]; break;
            case 5: rgb=[0,2,1]; break;
          }
          for(var i=0; i<seg.length; i+=1) {
            s = 1 - 1/(seg.length-1)*i;
            c[1] = c[0] * (1 - s*f);
            c[2] = c[0] * (1 - s);
            seg[i].style.backgroundColor = 'rgb('+
              (c[rgb[0]]*100)+'%,'+
              (c[rgb[1]]*100)+'%,'+
              (c[rgb[2]]*100)+'%)';
          }
          break;
      }
    }


    function redrawSld() {
      // redraw the slider pointer
      switch(modeID) {
        case 0: var yComponent = 2; break;
        case 1: var yComponent = 1; break;
      }
      var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
      jscolor.picker.sldM.style.backgroundPosition =
        '0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
    }


    function isPickerOwner() {
      return jscolor.picker && jscolor.picker.owner === THIS;
    }


    function blurTarget() {
      if(valueElement === target) {
        THIS.importColor();
      }
      if(THIS.pickerOnfocus) {
        THIS.hidePicker();
      }
    }


    function blurValue() {
      if(valueElement !== target) {
        THIS.importColor();
      }
    }


    function setPad(e) {
      var posM = jscolor.getMousePos(e);
      var x = posM[0]-posPad[0];
      var y = posM[1]-posPad[1];
      switch(modeID) {
        case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
        case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
      }
    }


    function setSld(e) {
      var posM = jscolor.getMousePos(e);
      var y = posM[1]-posPad[1];
      switch(modeID) {
        case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
        case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
      }
    }


    var THIS = this;
    var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
    var abortBlur = false;
    var
      valueElement = jscolor.fetchElement(this.valueElement),
      styleElement = jscolor.fetchElement(this.styleElement);
    var
      holdPad = false,
      holdSld = false;
    var
      posPad,
      posSld;
    var
      leaveValue = 1<<0,
      leaveStyle = 1<<1,
      leavePad = 1<<2,
      leaveSld = 1<<3;

    // target
    jscolor.addEvent(target, 'focus', function() {
      if(THIS.pickerOnfocus) { THIS.showPicker(); }
    });
    jscolor.addEvent(target, 'blur', function() {
      if(!abortBlur) {
        window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
      } else {
        abortBlur = false;
      }
    });

    // valueElement
    if(valueElement) {
      var updateField = function() {
        THIS.fromString(valueElement.value, leaveValue);
      };
      jscolor.addEvent(valueElement, 'keyup', updateField);
      jscolor.addEvent(valueElement, 'input', updateField);
      jscolor.addEvent(valueElement, 'blur', blurValue);
      valueElement.setAttribute('autocomplete', 'off');
    }

    // styleElement
    if(styleElement) {
      styleElement.jscStyle = {
        backgroundColor : styleElement.style.backgroundColor,
        color : styleElement.style.color
      };
    }

    // require images
    switch(modeID) {
      case 0: jscolor.requireImage('jquery.jscolor.hs.png'); break;
      case 1: jscolor.requireImage('jquery.jscolor.hv.png'); break;
    }
    jscolor.requireImage('jquery.jscolor.cross.gif');
    jscolor.requireImage('jquery.jscolor.arrow.gif');

    this.importColor();
  }

};


jscolor.install();
(function($){
/*
 * mLightBox
 *
 * Require Library:
 * 　jquery.js 1.3.2
 *
 * Options:
 * 　mLightBoxId - LightBoxとして表示させたい要素ID
 * 　duration - LightBoxの表示速度
 * 　easing - LightBoxのeasingタイプ
 * 　zIndex - LightBoxのz-index値
 * 　callback - コールバック関数を指定してください、型はfunctionです
 * 　
 * Description:
 * 　簡易的なLightBox機能を提供します
 * 　
 * Browser:
 *  Windows - IE6.0, IE7.0, IE8.0, Firefox3.5, Safari3.1, Opera9.6
 *  Mac - Firefox3.5, Safari5, Opera9.6
 *
 */

var options = {
		mLightBoxId: null,
		duration: null,
		easing: null,
		zIndex: null,
		callback: function(){},
		resizebeforeback: function(){},
		closecallback: function(){}
	},

	// default z-index
	DEFAULT_ZINDEX = 1000,

	// default duration
	DEFAULT_DURATION = 100,

	// default easing type
	DEFAULT_EASING = "swing",

	// overlay element id
	overlayId = "jquery-mLightBox-overlay"

	;

$.mLightBox = function(opts){
	$.extend(options, opts);
	$.ui.mLightBox(this, options);
}

$.ui = $.ui || {};

$.ui.mLightBox = function(container, options){
	_hideSelectBox();

	var winDimension = ___getPageSize();

	// overlay
	var overlay = $("<div>")
		.attr("id", overlayId)
		.css({
			position: "absolute", top: "0px", left: "0px",
			backgroundColor: "#000000", opacity: "0",
			width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px",
			zIndex: options.zIndex || DEFAULT_ZINDEX
		})
		.click(function(){
			close(options.closecallback);
		})
		.appendTo("body")
		.animate({opacity: 0.4}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING
		});

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize(overlay, mLightBox);
}

$.mLightBox.changeLayer = function(opts){
	$(options.mLightBoxId).hide();
	$.extend(options, opts);

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize($(overlayId), mLightBox);
}

$.mLightBox.close = function(fn) {
	close(fn);
}

function close(fn){
	// overlay
	$("#" + overlayId)
		.animate({
			opacity: 0
		}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				_showSelectBox();
				$(this).remove();
		}
	});

	// mLightBox
	$(options.mLightBoxId)
		.animate({ opacity: 0 }, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				$(this).hide();
				(fn || function(){}).apply(this, arguments);
		}
	});
}

function __winResize(overlay, mLightBox) {
	$(window).resize(function(){
		options.resizebeforeback();

		// overlay
		var winDimension = ___getPageSize();
		overlay.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});

		// mLightBox
		var offset = __elemOffset(mLightBox);
		mLightBox.css({top: offset.top, left: offset.left});
	});
}

// LigithBox animate!!
function animation(element, offset) {
	element
		.css({
			opacity: 1,
			left: offset.left + "px", top: offset.top,
			zIndex: (options.zIndex || DEFAULT_ZINDEX) + 1 })
		.show()
		.animate({ opacity: 1}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				options.callback.apply(this, arguments);
				$(this).find("input:first").focus();
			}
		});
}

/**
 * getPageSize()
 *
 */
function ___getPageSize() {
	// スクロール領域を含むwidth
	var pageWidth  = 0;
	if ($.browser && $.browser.safari) {
		pageWidth = document.body.scrollWidth;
	} else {
		pageWidth = document.documentElement.scrollWidth;
	}

	// スクロール領域を含むheight
	var pageHeight = 0;
	if ($.browser && $.browser.safari) {
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

function __elemOffset(element) {
	var top = Math.floor($(window).scrollTop() + ($(window).height() - $(element).height()) / 2);
	if ($(window).height() < $(element).height()) {
		top = Math.floor($(window).scrollTop());
	}
	var left = Math.floor($(window).scrollLeft() + ($(window).width() - $(element).width()) / 2);
	
	return {
		top: top,
		left: left
	};
}

// ie6 require
var display = [];
function _hideSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			display[index] = $(this).css("visibility");
			$(this).css("visibility", "hidden");
		});
	}
}

function _showSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			$(this).css("visibility", display[index]);
		});
	}
}

})(jQuery);

(function($) {
/*
 * makeUri
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメインを除去し、getパラメータを分割します。
 */
$.makeUri = function(href, addParam){
	var url =  $.rejectDomain(href);

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);		// #より前の部分のURLを抽出

	idx = url.indexOf("?");
	var uri = (idx < 0) ? url : url.substr(0, idx);	// ?より前の部分のURLを抽出

	// すでにgetパラメータがあるならそのまま配列に突っ込む
	var param = (idx < 0) ? [] : url.substr(idx + 1).split("&");

	// 追加したいgetパラメータをpushする
	if (addParam) {
		for (var i=0,len=addParam.length; i<len; ++i) {
			param.push(addParam[i]);
		}
	}

	return { uri: uri, param: param }
};

})(jQuery);


(function($) {
/*
 * rejectDomain
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメイン部分を除去します。
 */
$.rejectDomain = function(url){
	if(!url) return null;

	var idx;

	idx = url.indexOf("/");
	if(idx == 0) return url;

	var baseurl = [location.protocol, "//", location.host].join('');
	idx = url.indexOf(baseurl);

	if(idx != 0) return "";

	return url.substr(baseurl.length);
};

})(jQuery);

(function($) {
/*
 * rejectFragmentId
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLから#以降、?以降を除去します。
 */
$.rejectFragmentId = function(url){
	if(!url) return null;

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);

	idx = url.indexOf("?");

	return (idx < 0) ? url : url.substr(0, idx);
};

})(jQuery);

(function($) {
/*
 * uriParamJoin
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * paramがある場合は?を、paramが複数ある場合は&で繋ぐ
 */
$.uriParamJoin = function(url, param){
	var addParam = $.compact(param);

	return addParam.length > 0 ? [url, addParam.join("&")].join("?") : url;
};

})(jQuery);


(function($){
/*
 * compact
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * 配列からnull、undefine、""を除去します。（もっとDeepな感じのほうが便利かな？）
 */

$.compact = function(object) {
	if (object.constructor != Array) { return }

	var ret = new Array();
	for (var i=0,len=object.length; i<len; ++i) {
		if (object[i] !== null && object[i] !== undefined && object[i] !== "") {
			ret.push(object[i]);
		}
	}

	return ret;
}

})(jQuery);


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
﻿
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

				var movieDir = imagePath.substring(0, imagePath.lastIndexOf('/')+1);
				var movieFile = imagePath.substring(imagePath.lastIndexOf('/')+1).replace(/(.*).jpg(.*)/, '$1.mp4$2');
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
(function($){
/*
 * openDialog
 *
 * Options:
 * url - URL
 * name - window名
 * style - ポップアップスタイル（例："width=700,height=450,resizable=no,scrollbars=no,status=no,toolbar=no"）
 *
 * Description:
 * window.openのラッパー
 * 戻り値に開いたwindowを返します
 */
$.openDialog = function(options) {
	var p = new Dialog();
	jQuery.extend(p.options, options);
	p.window = window.open(p.options.url, p.options.name, p.options.style);
	return p;
};

var Dialog = function() {};
Dialog.prototype = {
	window: null,
	options: {
		url: null,
		name: null,
		style: null
	},
	close: function() {
		this.window.close();
	}
}

})(jQuery);
(function($) {
	/*
	 * photoFinder
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像検索
	 *
	 * Sample:
	 */
	$.photoFinder = function(word, callback) {

		var uri = 'https://www.googleapis.com/customsearch/v1';
		var param = [];
		param.push('num=10');
		param.push('start=1');
		param.push('q='+word);
		param.push('cx=012220449560669031557%3A5_0q2vq3gm4');
		param.push('searchType=image');
		param.push('key=AIzaSyCZC97xNh4pjmu5MHWkKPz31uR5QTdv4Fk');
		var url = $.uriParamJoin(uri, param);

		$.get(url, {}, function(result) {
			if (callback) {
				callback(result);
			}
		});
	};

})(jQuery);



(function($) {
	/*
	 * mynavislider
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像スライダー
	 *
	 * Sample:
	 * var slider1 = $('.js-mynavislider').mynavislider({
	 * 	'parentKey': 'ul',
	 * 	'childKey': 'li',
	 * 	'carousel': true,
	 * 	'backBtnKey': '.back',
	 * 	'nextBtnKey': '.next',
	 * 	'slideCallBack': function(data) {
	 * 		slider1.find('.pageNo').text(data.pageNo + '/' + data.maxPageNo);
	 * 	}
	 * });
	 * slider1.find('.changePage').click(function(e) {
	 * 	e.preventDefault();
	 * 	slider1.changePage($(this).data('pageno'), $.fn.mynavislider.ANIMATE_TYPE.SLIDE);
	 * });
	 * 
	 */
	$.fn.mynavislider = function(options) {

		var screen = null // 処理対象エリア
			,	ul = null // 親要素
			,	li = null // 子要素
			,	back = null // 前ページボタン
			,	next = null // 次ページボタン
			,	pos = 0 // 子要素のインデックス
			,	pageNo = 1 // 現在のページ番号
			,	maxPageNo = 1 // 最大のページ番号
			,	liwidth = 0 // 子要素１つの横幅
			,	nowLoading = false // 処理中かどうか
			,	dragw = 0 // スワイプした横幅
			,	childKey = null
			,	shift = null
			,	margin = 0
			,	dispCount = 0
			,	shiftw = 0
			,	animateType = null
			,	slideSpeed = null
			,	carousel = null
			,	slideCallBackFunc = null
			,	resizeCallBackFunc = null
			,	isAutoSlide = null
			,	autoSlideInterval = null
			,	hoverPause = null
			,	isMouseDrag = null
			,	reboundw = null
			,	moment = false
			,	isFullScreen = false
			,	heightMaxScreen = false
			,	diffMoveMode = false; // 通常はページ番号の差分で移動距離を算出しますが、このモードがtrueの場合は間の子要素の数で移動距離を算出します。

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		// jQueryオブジェクトキャッシュ、初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			dispCount = params.dispCount || params.shift;
			childKey = params.childKey;
			animateType = params.animateType;
			isAutoSlide = params.autoSlide;
			autoSlideInterval = params.autoSlideInterval;
			hoverPause = params.hoverPause;
			isMouseDrag = params.isMouseDrag;
			reboundw = params.reboundw;
			moment = params.moment;
			slideSpeed = params.slideSpeed;
			shift = params.shift;
			margin = params.margin;
			carousel = params.carousel;
			isFullScreen = params.isFullScreen;
			heightMaxScreen = params.heightMaxScreen;
			slideCallBackFunc = params.slideCallBack;
			resizeCallBackFunc = params.resizeCallBack;

			ul.find(childKey).each(function(i) {
				$(this).attr('pageno', (i+1));
			});

			if (heightMaxScreen) {
				// 画像縦幅を端末サイズに合わせる為オリジナル画像サイズが必要になる。画像を事前にロードしておく。
				var photos = ul.find(childKey).find('img');
				var photoLength = photos.length;
				photos.each(function() {
					var photo = $(this),
						imagePath = photo.attr('src') || '';
					var img = $('<img>');
					img
						.load(function() {
							photo.attr('owidth', img[0].width);
							photo.attr('oheight', img[0].height);
							if (photoLength !== 1) {
								photoLength--;
								return;
							}
							photos.unbind('load');
							// 画像のロードが完了したらスタート
							exec();
						});
					img.attr('src', imagePath);
				});
			} else {
				exec();
			}

			function exec() {
				if (isFullScreen) {
					// スライド幅＝画面横幅いっぱい
					fullScreen();
				} else if (params.shiftw) {
					// スライド幅＝指定した幅固定
					liwidth = Math.ceil(params.shiftw/shift);
					shiftw = params.shiftw;
				} else {
					// スライド幅＝子要素横幅✕１ページに表示する子要素の数
					liwidth = li.width();
					shiftw = liwidth * shift;
				}
				maxPageNo = Math.ceil(li.size()/shift);

				// １ページの場合はスライド不要の為、カルーセルは強制OFFとする。
				if (maxPageNo <= 1) {
					carousel = false;
					isMouseDrag = false;
				}

				if (carousel) {
					// カルーセルの初期設定を行う
					initCarousel();
					pos = li.size()/2;
				} else {
					// ページングボタンの表示制御
					showArrows();
					pos = shift;
				}

				// ulタグの横幅を調整する
				ul.css('width', shiftw * li.size() / shift)
					.css('position', 'relative');

				li.css('float', 'left');

				// 各種イベントの設定
				bindEvent();
				
				// スライダーを設定したよっていうマークを付ける。
				screen.addClass('slider-set-end');
			};
		};

		// 後処理
		var after = function() {
			if (carousel) {
				doCarousel();
			}

			nowLoading = false;
			dragw = 0;
			
			// コールバック
			slideCallBack();
		};

		// 各種イベントの設定
		var bindEvent = function() {

			// スワイプでのページングを可能にする
			if (isMouseDrag) {
				bindMouseDragEvent();
			}

			// ボタンクリックでのページングを可能にする
			bindPagingEvent();

			// 自動でのページングを可能にする
			if (isAutoSlide) {
				autoSlide.init();
			}

		}

		// 指定したページに移動する
		var slide = function(move, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 子要素が１つの場合は処理しない
			if (maxPageNo <= 1) {
				after();
				return;
			}

			// カルーセルでない場合は、次ページが存在しないと処理しない
			if (!carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			// 現在のオフセット位置と移動後のオフセット位置を設定
			var from = 0;
			if (carousel) {
				from = -1 * (pos/shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-shift)/shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			// 移動後の子要素のインデックスを設定
			pos = pos + (shift * move);

			// ページ番号を設定
			if (diffMoveMode) {
				if (carousel) {
					pageNo = parseInt($(li[pos]).attr('pageno'));
				} else {
					pageNo = parseInt($(li[(pos-shift)]).attr('pageno'));
				}
			} else {
				pageNo = pageNo + move;
				if (pageNo < 1) {
					pageNo = pageNo + maxPageNo;
				} else if (maxPageNo < pageNo) {
					pageNo = pageNo - maxPageNo;
				}
			}

			// ページングボタンの表示制御
			if (!carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用せずに画像を切り替える。
				if (1 < maxPageNo && carousel) {
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					ul.css('left', '-' + ((pos - shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				// スライドで画像を切り替える。（Androidで負荷が大きいため、jQueryのアニメーションは利用しない)
				(function() {
					var self = this;

					var elem = ul[0];
					var begin = +new Date();
					var duration = slideSpeed;
					var easing = function(time, duration) {
						return -(time /= duration) * (time - 2);
					};
					var timer = setInterval(function() {
						var time = new Date() - begin;
						var _pos, _now;
						if (time > duration) {
							clearInterval(timer);
							_now = to;
							elem.style.left = _now + 'px';

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
			} else if (animateType === ANIMATE_TYPE.FADE) {
				// フェードで画像を切り替える。
				ul.animate({'opacity': 0 }, 300, function() {
					if (1 < maxPageNo && carousel) {
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						ul.css('left', '-' + ((pos - shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
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

			// 最終ページに空きが出来る場合は空のLIダグを追加する。例）｜○○○｜○○○｜○○○｜○  ｜
			var addSize = li.size()%shift;
			if (addSize !== 0) {
				for (var i=0, len=shift-addSize;i<len;i++) {
					ul.append(ul.find(childKey).filter(':first').clone(true).empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(childKey);
			}

			ul
				.append(li.clone(true).addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos <= 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
				var range = pos - (li.size()-shift - (dispCount - shift));
				pos = (li.size()/2)-shift - (dispCount - shift) + range;
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// ボタンクリックでのページングを可能にする
		var bindPagingEvent = function() {
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

		// スワイプでのページングを可能にする
		var bindMouseDragEvent = function() {
			var isTouch = ('ontouchstart' in window);
			// 慣性を利用するかどうか
			var momentObject = (moment) ? new MomentObject(ul[0]) : null;
			ul.bind({
				// タッチの開始、マウスボタンを押したとき
				'touchstart mousedown': function(e) {
					if (nowLoading) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					nowLoading = true;

					// 自動スライドのタイマーをリセットする。
					if (autoSlide.on) {
						autoSlide.restart();
					}

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = parseInt($(this).css('left'));
					if(isNaN(this.left)) {
						this.left = $(this).position().left;
					}
					this.top = parseInt($(this).css('top'));
					if(isNaN(this.top)) {
						this.top = $(this).position().top;
					}
					this.startLeft = this.left;
					
					this.touched = true;

					// 慣性を利用してスワイプする。
					if (moment) {
						momentObject._position = momentObject.positionize();
						momentObject.dragStart(event);
					}

				},
				// タッチしながら移動、マウスのドラッグ
				'touchmove mousemove': function(e) {

					if (!this.touched) {
						return;
					}

					var x = (this.pageX - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX));
					var y = (this.pageY - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY));

					if (Math.abs(x) < 5 || 200 < Math.abs(y)) {
						// スワイプさせない
						return;
					} else {
						// スワイプさせる
						event.preventDefault();
						event.stopPropagation();
					}
					
					if (!carousel) {
						// １ページ目は右にスワイプさせない。
						if (0 < (this.left - x)) {
							return;
						}
						// 最後のページは左にスワイプさせない
						if ((this.left - x) <= -1 * ((maxPageNo-1) * shiftw)) {
							return;
						}
					}

					// 移動先の位置を取得する
					this.left = this.left - x;

					// 慣性を利用する場合は、移動速度を計算する
					if (moment) {
						momentObject.dragMove(event);
					}

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

					var self = this;
					
					// 残りの移動処理
					var restMove = function (movew) {

						// スワイプ中（touchmove mousemove）で移動したページ量
						var movePage = Math.floor(Math.abs(movew)/shiftw);
						if (movePage != 0) {
							if (movew < 0) {
								movePage = movePage * -1;
							}
							// ページ番号
							pageNo = pageNo + movePage;
							if (pageNo < 1) {
								pageNo = pageNo + maxPageNo;
							} else if (maxPageNo < pageNo) {
								pageNo = pageNo - maxPageNo;
							}
							pos = pos + (shift * movePage);
							if (carousel) {
								// 左端
								if (pos <= 0) {
									pos = (li.size()/2);
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = 1;
									slide(0, ANIMATE_TYPE.NO);
									return;
								// 右端
								} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
									var range = pos - (li.size()-shift - (dispCount - shift));
									pos = (li.size()/2)-shift - (dispCount - shift) + range;
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = maxPageNo;
									slide(0, ANIMATE_TYPE.NO);
									return;
								}
							}
						}

						var restw = Math.abs(movew) % shiftw;
						if (movew < 0) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo - 1;
								if (!carousel && p <= 1) {
									p = 1;
								}
								// 前ページ
								dragw = movew - (shiftw * movePage);
								// 移動するページ量
								var move = p - pageNo;
								slide(move, ANIMATE_TYPE.SLIDE);
							}
						} else if (0 < movew) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo + 1;
								if (!carousel && maxPageNo <= p) {
									p = maxPageNo;
								}
								// 次ページ
								dragw = movew - (shiftw * movePage);
								// 移動するページ量
								var move = p - pageNo;
								slide(move, ANIMATE_TYPE.SLIDE);
							}
						} else {
							// 何もしない
							nowLoading = false;
						}
					}

					// リバウンド処理
					var rebound = function(from, to) {
						var elem = ul[0];
						var begin = +new Date();
						var duration = slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;
								elem.style.left = _now + 'px';

								slide(0, ANIMATE_TYPE.NO);
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					}

					if (moment) {
						momentObject.onstop = function (obj) {
					    	// 慣性で動いた分を加算する
							var movew = self.startLeft - self.left + obj.momentw;
							restMove(movew);
					    }
						momentObject.dragEnd(event);
					} else {
						var movew = self.startLeft - self.left;
						restMove(movew);
					}
				    
				}
			});
		};

		// 自動スライド
		var autoSlide = this.autoSlide = new (function() {
			var timer = null;
			this.on = false;
			this.init = function() {
				start();
				if (hoverPause) {
					$(ul).hover(function() {
						stopTimer();
					}, function() {
						startTimer();
					});
				}
			};
			this.restart = function() {
				stopTimer();
				startTimer();
			};
			var start = this.start = function() {
				autoSlide.on = true;
				startTimer();
			};
			function startTimer() {
				if (!autoSlide.on) {
					return;
				}
				timer = setTimeout(function() {
					clearInterval(timer);
					slide(1, animateType);
					startTimer();
				} , autoSlideInterval);
			}
			var stop = this.stop = function() {
				stopTimer();
				autoSlide.on = false;
			};
			function stopTimer() {
				if (!autoSlide.on) {
					return;
				}
				clearInterval(timer);
				timer = null;
			}
		})();

		// 子要素をフルスクリーンで表示します。
		var fullScreen = function() {
			// スライダーの表示幅を調整します。
			var changeDisplay = function() {
				
				// 子要素の横幅を端末のwidthに設定
				ul.find(childKey).width(Math.ceil($(window).width() /dispCount) - Math.ceil(margin/dispCount));
				
				if (heightMaxScreen) {
					ul.find(childKey).height($(window).height());
					ul.find(childKey).each(function() {
						var li = $(this),
							img = li.find('img');

						var x = Math.floor(img.attr('oheight') * $(window).width() / img.attr('owidth'));
						var margin = Math.floor(($(window).height() - x) / 2);
						if (0 <= margin) {
							img.height('').width('100%');
						} else {
							img.height('100%').width('');
						}
						
					});
				}
				
				liwidth = ul.find(childKey).width();
				shiftw = (liwidth + margin) * shift;
				ul.css('width', shiftw * li.size() / shift);

				pos = li.size()/2;
				ul.css('left', '-' + (liwidth*(li.size())) + 'px');
			};
			var resizeCallBack = function() {
				if (resizeCallBackFunc) {
					var data = {};
					data.pageNo = pageNo;
					data.maxPageNo = maxPageNo;
					if (carousel) {
						data.obj = $(li[pos]);
					} else {
						data.obj = $(li[(pos-shift)]);
					}
					resizeCallBackFunc(data);
				}
			};
			// 画面が回転された場合
			$(this).on('orientationchange',function(){
				changeDisplay();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			// 画面がリサイズされた場合
			$(this).resize(function() {
				changeDisplay();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			changeDisplay();
		};

		// コールバック
		var slideCallBack = function() {
			if (slideCallBackFunc) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-shift)]);
				}
				slideCallBackFunc(data);
			}
		};
		

		// 慣性を利用してスライドする
		var MomentObject = function (element) {
			this.element = element;
			this._position = this.positionize();
			this.reset();
		}
		MomentObject.prototype = {
			constructor: MomentObject,
			damping : 15,
			_isDragging: false,
			__position : Vector2.zero,
			_velocity : Vector2.zero,
			_prevTime : 0,
			_prevPosition: Vector2.zero,
			_prevVelocity: Vector2.zero,
			_loopTimer: null,

			positionize: function () {
				var rect = this.element.getBoundingClientRect();
				var x = rect.left;
				var y = rect.top;
				return new Vector2(x, y);
			},

			positionizeByEvent: function (e) {
				var isTouch = ('ontouchstart' in window);
				var x = (isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX;
				var y = (isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY;
				return new Vector2(x, y);
			},
			dragStart: function (evt) {
				this.reset();
				this._prevTime	 = Date.now();
				this._prevPosition = this.positionizeByEvent(evt);
				this._isDragging   = true;
			},
			dragMove: function (evt) {
				if (!this._isDragging) {
					return;
				}

				var now = Date.now();
				var deltaTime = now - this._prevTime;
				var eventPos = this.positionizeByEvent(evt);
				var deltaPosition = Vector2.sub(eventPos, this._prevPosition);
				var velocity = Vector2.divisionScalar(deltaPosition, (deltaTime || (deltaTime = 1)));
				var deltaVelocity = Vector2.sub(velocity, this._prevVelocity);

				this._velocity.add(deltaVelocity);
				this._position = Vector2.add(this._position, deltaPosition);

				this._prevTime = now;
				this._prevPosition = eventPos;
				this._prevVelocity = velocity;
			},
			dragEnd: function (evt) {
				this._isDragging = false;
				this.dragRelease();
			},
			dragRelease: function () {
				var _this = this;
				var zero = Vector2.zero;
				var past = Date.now();
				
				var startLeft = _this._position.x;
				
				(function loop() {
					_this.dampingVelocity();
					var now   = Date.now();
					var delta = now - past;
					_this._position = Vector2.add(_this._position, Vector2.multiplyScalar(_this._velocity, delta));
					
					// 画像を移動させる
					$(_this.element).css({left:_this._position.x});

					var isFirst = false;
					if (0 <= _this._position.x) {
						isFirst = true;
					}
					var isLast = false;
					if (_this._position.x <= (-1 * (maxPageNo * (carousel ? 2 : 1) * shiftw) + shiftw)) {
						isLast = true;
					}
					// 先頭に到達、最後に到達、慣性での動作が停止 の何れかの場合
					if (isFirst || isLast || _this._velocity.equal(zero)) {
						_this.reset();

						// 慣性の移動量
						var obj = {
								momentw : startLeft - _this._position.x
						};
						
						_this.stop(obj);
						return;
					}

					past = now;
					_this._loopTimer = setTimeout(loop, 16);
				}());
			},
			dampingVelocity: function () {
				var damping = Vector2.divisionScalar(this._velocity, this.damping);
				this._velocity.sub(damping);
				if (this._velocity.lessThen(0.05)) {
					this._velocity = Vector2.zero;
				}
			},
			reset: function () {
				clearTimeout(this._loopTimer);
				this._velocity = Vector2.zero;
				this._prevVelocity = Vector2.zero;
				this._prevPosition = Vector2.zero;
			},
			
			stop: function (obj) {
				this.onstop && this.onstop(obj);
			}
		};

		// Vector2
		function Vector2(x, y) {
			this.x = x;
			this.y = y;
		}
		Object.defineProperties(Vector2, {
			'zero': {
				enumerable: true,
				set: function (val) {},
				get: function () { return new Vector2(0, 0); }
			}
		});
		Vector2.prototype = {
			constructor: Vector2,

			add: function (vec) {
				this.x += vec.x;
				this.y += vec.y;
				return this;
			},
			sub: function (vec) {
				this.x -= vec.x;
				this.y -= vec.y;
				return this;
			},
			multiplyScalar: function (val) {
				this.x *= val;
				this.y *= val;
				return this;
			},
			divisionScalar: function (val) {
				this.x /= val;
				this.y /= val;
				return this;
			},
			length: function () {
				return Math.sqrt((this.x * this.x) + (this.y * this.y));
			},
			lessThen: function (val) {
				return (this.length() <= val);
			},
			equal: function (vec) {
				return (this.x === vec.x && this.y === vec.y);
			},
			copy: function () {
				return new Vector2(this.x, this.y);
			}
		};
		Vector2.add = function (vec1, vec2) {
			var x = vec1.x + vec2.x;
			var y = vec1.y + vec2.y;
			return new Vector2(x, y);
		};
		Vector2.sub = function (vec1, vec2) {
			var x = vec1.x - vec2.x;
			var y = vec1.y - vec2.y;
			return new Vector2(x, y);
		};
		Vector2.multiplyScalar = function (vec, val) {
			var x = vec.x * val;
			var y = vec.y * val;
			return new Vector2(x, y);
		};
		Vector2.divisionScalar = function (vec, val) {
			var x = vec.x / val;
			var y = vec.y / val;
			return new Vector2(x, y);
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function(callback) {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(-1, animateType);
			if (callback) {
				callback();
			}
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function(callback) {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(1, animateType);
			if (callback) {
				callback();
			}
		}

		// 指定したページを表示します。
		var changePage = this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			if (maxPageNo < page) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			// 移動するページ量
			var move = 0;
			if (diffMoveMode) {
				if (page !== pageNo) {
					var moveR = (ul.find(params.childKey+'[pageno="'+pageNo+'"]:eq(0)').nextUntil(ul.find(params.childKey+'[pageno="'+page+'"]:eq(0)')).length+1);
					var moveL = -1 * (ul.find(params.childKey+'[pageno="'+page+'"]:eq(0)').nextUntil(ul.find(params.childKey+'[pageno="'+pageNo+'"]:eq(0)')).length+1);
					if (Math.abs(moveR) < Math.abs(moveL)) {
						move = moveR;
					} else {
						move = moveL;
					}
				}
			} else {
				move = page - pageNo;
			}
			slide(move, animateType);
		}

		// 最大ページなどの情報をリフレッシュする。（スライドコールバックで次ページ要素をAjax取得してLIに追加した場合などはこれを利用してページ情報を最新化する）
		// 引数：現在ページ、最大ページ、現在ページの左に追加した要素数
		var refresh = this.refresh = function (page, max, leftAddCnt) {
			// 子要素をリキャッシュ
			li = ul.find(params.childKey);
			if (li.size() === 1) {
				// スライド幅＝子要素横幅✕１ページに表示する子要素の数
				liwidth = li.width();
				shiftw = liwidth * shift;
			}
			// 親要素のwidthを再計算
			ul.width(ul.width()+(li.size() * liwidth) + 'px');
			if (carousel) {
				diffMoveMode = true;
				if (max) {
					maxPageNo = parseInt(max);
				} else{
					maxPageNo = Math.ceil(li.size()/2/shift);
				}
				if (leftAddCnt) {
					pos = pos + leftAddCnt;
					ul.css('left', '-' + (pos * liwidth) + 'px');
				}
				if (page) {
					// コールバックは一次的に呼ばない。
					var workSlideCallBackFunc = slideCallBackFunc;
					slideCallBackFunc = null;
					changePage(page);
					slideCallBackFunc = workSlideCallBackFunc;
				}
			} else {
				if (max) {
					maxPageNo = parseInt(max);
				} else{
					maxPageNo = Math.ceil(li.size()/shift);
				}
				showArrows();
			}
		};

		// ボタンクリックやスワイプ時の処理を一次的に停止/開始する。
		var suspend = this.suspend = function(suspendFlg) {
			if (!suspendFlg) {
				nowLoading = false;
			} else {
				nowLoading = true;
			}
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
		,	'shift': 5 // １ページでスライドさせる子要素の数
		,	'dispCount': null // １ページに表示する子要素の数(shiftで指定した値と異なる場合にのみ指定する。例：１ページ５要素表示するがスライドは１要素づつ移動する場合など)
		,	'shiftw': null // １ページでにスライドさせる幅(子要素にmarginなどの余白が指定されている場合に、自動で幅が算出できないためこれを指定する。)
		,	'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類（なし、スライド、フェード）
		,	'slideSpeed': 300 // スライド速度
		,	'carousel': false // １ページ目または、最終ページに到達した場合に、ローテートさせるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタンのセレクタ
		,	'nextBtnKey': '#gallery-next' // 前ページボタンのセレクタ
		,	'autoSlide': false // 自動でスライドさせるどうか
		,	'autoSlideInterval':  5000 // 自動でスライドさせる間隔(ミリ秒)
		,	'hoverPause':  false // 子要素上にマウスオーバーすると自動スライドを一時停止する。
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 50 // スワイプ時に跳ね返りを行う幅
		,	'moment': false // スワイプ時に慣性を利用するかどうか
		,	'isFullScreen': false // 画面横幅いっぱいに画像を表示するかどうか
		,	'margin': 0 // 子要素間のマージン(isFullScreenで画面横幅いっぱいに表示した場合で子要素間にマージンが設定されている場合に利用する)
		,	'heightMaxScreen': false // 画像縦幅が画面縦幅よりも大きい場合は画面縦幅いっぱいに表示する（拡大写真パネルにて利用。isFullScreen がtrueの場合のみ有効）
		,	'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はこれを利用してカスタマイズする)
		,	'resizeCallBack': null // 画面リサイズ（または回転）後に処理を行うコールバック
	};

})(jQuery);

(function($) {

	/*
	 * placeholder
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * IEにてプレースホルダーに対応します。
	 * 参考サイト http://mths.be/placeholder v2.0.7 by @mathias
	 */
	var isInputSupported = 'placeholder' in document.createElement('input'),
	    isTextareaSupported = 'placeholder' in document.createElement('textarea'),
	    prototype = $.fn,
	    valHooks = $.valHooks,
	    hooks,
	    placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		isInputSupported || (valHooks.input = hooks);
		isTextareaSupported || (valHooks.textarea = hooks);

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
		    rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this,
		    $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement,
		    input = this,
		    $input = $(input),
		    $origInput = $input,
		    id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': true,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

})(jQuery);

(function($) {
/*
 * popupMessage
 *
 * Description:
 * 　ポップアップメッセージを表示する
 *
 * Sample:
 * 	$.popupMessage({
 *		message: "こんにちは"
 *  });

 */

var options = {
	message: "",
	alertId: "popupAlert",
	closeId: "popupClose",
	messageId: "popupMessage",
	callback: function(){}
},
	isFirst = true,

	timeout = null

	;

$.popupMessage = function(opts) {
	$.extend(options, opts);

	clearTimeout(options.timeout);

	var elem = $('#'+options.alertId);
	if (!elem || elem.length <= 0) {
		elem = $(['<div id="'+options.alertId+'" class="window display-none">',
			'<div class="inner">',
				'<p id="popupMessage"><br></p>',
			'</div>',
			'<p class="button"><a href="#" id="'+options.closeId+'"><img src="../img/btn_window_close.png" alt="閉じる" width="15" height="15" class="imgover"></a></p>',
		'</div>'].join(''));
		elem.appendTo('body');
	}

	var top  = Math.floor($(window).scrollTop() + ($(window).height() - elem.height() - 20)),
		left = Math.floor($(window).scrollLeft() + ($(window).width() - elem.width() - 20));

	elem.stop().hide().css({
		position: "absolute",
		top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px",
		left: left + "px",
		"z-index": 5000
	});

	$('#'+options.messageId).html(options.message);

	if (isFirst) {
		$('#'+options.closeId).click(function(event){
			event.preventDefault();

			clearTimeout(options.timeout);

			elem.animate({
				top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px"
			}, 300, "easeOutBack", function(){
				$(this).hide();
			});
		});
		isFirst = false;
	}

	elem.show().animate({
		top: top + "px",
		left: left + "px"
	}, 300, "easeOutBack", function(){
		options.callback();

		options.timeout = setTimeout(function() {
			elem.animate({
				top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px"
			}, 300, "easeOutBack", function(){
				$(this).hide();
			});
		}, 2000);
	});
};

})(jQuery);

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

(function($) {
	$.fn.rotate = function(angle,whence) {
		var p = this.get(0);

		// we store the angle inside the image tag for persistence
		if (!whence) {
			p.angle = ((p.angle==undefined?0:p.angle) + angle) % 360;
		} else {
			p.angle = angle;
		}

		if (p.angle >= 0) {
			var rotation = Math.PI * p.angle / 180;
		} else {
			var rotation = Math.PI * (360+p.angle) / 180;
		}
		var costheta = Math.cos(rotation);
		var sintheta = Math.sin(rotation);

		if (document.all && !window.opera) {
			var canvas = document.createElement('img');

			canvas.src = p.src;
			canvas.height = p.height;
			canvas.width = p.width;

			canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+costheta+",M12="+(-sintheta)+",M21="+sintheta+",M22="+costheta+",SizingMethod='auto expand')";
		} else {
			var canvas = document.createElement('canvas');
			if (!p.oImage) {
				canvas.oImage = new Image();
				canvas.oImage.src = p.src;
			} else {
				canvas.oImage = p.oImage;
			}

			canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width) + Math.abs(sintheta*canvas.oImage.height);
			canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height) + Math.abs(sintheta*canvas.oImage.width);

			var context = canvas.getContext('2d');
			context.save();
			if (rotation <= Math.PI/2) {
				context.translate(sintheta*canvas.oImage.height,0);
			} else if (rotation <= Math.PI) {
				context.translate(canvas.width,-costheta*canvas.oImage.height);
			} else if (rotation <= 1.5*Math.PI) {
				context.translate(-costheta*canvas.oImage.width,canvas.height);
			} else {
				context.translate(0,-sintheta*canvas.oImage.width);
			}
			context.rotate(rotation);
			context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
			context.restore();
		}
		canvas.id = p.id;
		canvas.angle = p.angle;
		p.parentNode.replaceChild(canvas, p);
	}

	$.fn.rotateRight = function(angle) {
		this.rotate(angle==undefined?90:angle);
	}

	$.fn.rotateLeft = function(angle) {
		this.rotate(angle==undefined?-90:-angle);
	}
})(jQuery);

/*
 * mynaviMove
 *
 * Copyright (c) 2013 matsudashogo at teamLab
 *
 * Description:
 *  ページ内遷移のライブラリを提供します。固定ヘッダーなどを考慮した遷移が可能です。
 *
 * Options:
 * target - ajax読み込みなどの対象を指定します
 * from - クリック対象を指定します
 * to - 遷移先を指定します
 * margin_top - 遷移先に対してずらす高さを指定します（デフォルト：式場詳細ナビに合わせてあります）
 * speed - アニメーションの早さを指定します
 *
 * Sample:
 * $.mynaviMove({
 *			target : $('#ajaxResult'),
 *			from : '#movePlan',
 *			to : '#ajaxResultPlan'
 *		});
 *
 */
(function($){

	// デフォルト値
	var options = {
		'separator' : document,
		'target' : null,
		'to' : null,
		'margin_top' : null,
		'speed' : 600
	};

	$.mynaviMove = function(opts)
	{
		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(options, opts);

		var scrollTo = ($(settings.to).offset().top - settings.margin_top);

		$(settings.separator).find(settings.target).click(function(e) {
			e.preventDefault();
			$('html, body').animate({scrollTop: scrollTo}, settings.speed);
		});

	};

})(jQuery);



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


(function($) {
	/*
	 * mynavislideshow
	 *
	 * Copyright (c) 2012 wakui at teamLab
	 *
	 * Description:
	 * 　マイナビウェディングスライドショー
	 *
	 * Sample:
	 * $('#slideshow').mynavislideshow({});
	 */
	$.fn.mynavislideshow = function() {

		var SLIDE_TYPE_FADE = 0
		,	SLIDE_TYPE_H = 1
		,	SLIDE_TYPE_V = 2
		,	SLIDE_TOP_MARGIN = 70	// 画像初期配置のトップマージン
		;

		var screen = null		// ギャラリー画像表示枠
		,	ul = null			// ギャラリー用ULタグ
		,	li = null			// ギャラリー用LIタグ
		,	description = null	// 画像コメント
		,	pos = 0				// ギャラリーポジション
		,	shiftw = 0			// ギャラリー移動量（横）
		,	shifth = 0			// ギャラリー移動量（縦）
		,	interval = 0		// アニメーションインターバル
		,	cachedList = null;

		var cur = null			// 現在表示中画像
		,	next = null;		// 次回表示予定画像

		var params = {
			'showMessage':	'true'
		,	'fadeSpeed':	900
		,	'slideSpeed':	900
		,	'slideTime':	3000
		,	'slideType':	0
		,	'easing':		'easeOutSine'
		,	'carousel':		'true'
		,	'random':		'false'
		};

		var isLastPhoto = function() {
			// 番兵が存在している場合はli.sizeからマイナス１を終端とする
			return (pos >= li.size()-((params.slideType===SLIDE_TYPE_FADE)?0:1));
		};

		var init = function() {

			screen = $('#full-screen');
			shiftw = screen.width();
			shifth = screen.height() * 0.75;

			ul = screen.find('ul');
			li = ul.find('li').css({
					'height': shifth
				,	'opacity': 1
				}).removeClass('cur');
			description = $('#slide-description');

			// コメントに１枚めの画像コメントを差し込む
			description.html(li.filter(':first').find('img').attr('alt'));

			// メーッセージ表示がOFFの場合
			if (params.showMessage === 'false') {
				description.css('visibility', 'hidden');
			} else {
				description.css('visibility', 'visible');
			}

			// リサイズ等で初期化を行う場合はキャッシュしたリストを使ってスライドショーを初期化する
			if (cachedList === null || cachedList.size() === 0) {
				cachedList = li;
			} else {
				ul.empty().append(cachedList);
			}

			// 表示画像のポジションをリセット
			pos = 0;
			// 動作中のアニメーションを止めてトップマージンを設定
			ul.css('top', SLIDE_TOP_MARGIN);
			// cloneが存在してれば削除
			li.filter('.slide-cloned').remove()
			.end()
			   .filter(':first').addClass('cur');

			// スライドタイプ別初期化処理
			switch(params.slideType) {
				case SLIDE_TYPE_FADE:
					initFade();
					break;
				case SLIDE_TYPE_H:
					initH();
					break;
				case SLIDE_TYPE_V:
					initV();
					break;
			}
		};

		/**
		 * フェードスライドエフェクト初期化処理
		 */
		var initFade = function() {

			li.each(function(i) {

				var $this = $(this);
				if (i === 0) {
					$this.css({
						'width': screen.width()
					});
				} else {
					$this.css({
						'width': screen.width()
					,	'opacity': 0
					});
				}
			});

			interval = setInterval(function() {
				fade();
			}, params.slideTime);
		};

		/**
		 * 横スライドエフェクト初期化処理
		 */
		var initH = function() {

			// カルーセル設定がされている場合
			if (params.carousel === 'true') {
				ul.css('left', '0px')
					.append(li.filter(':first').clone().addClass('slide-cloned'));

				// liを再キャッシュ
				li = ul.find('li');
			} else {
				ul.css({'left': '0px', 'top': SLIDE_TOP_MARGIN});
			}

			// ulタグの横幅を調整する
			ul.css('width', li.size() * screen.width());

			// liタグの横幅・位置を調整する
			li.each(function(i) {
				$(this).css({
					'width': screen.width()
				,	'left': (i * screen.width()) + 'px'
				});
			});

			interval = setInterval(function() {
				nextAnimate(slide);
			}, params.slideTime);
		};

		/**
		 * 縦スライドエフェクト初期化処理
		 */
		var initV = function() {

			// カルーセル設定がされている場合
			if (params.carousel === 'true') {
				ul.css({
						'top': SLIDE_TOP_MARGIN + 'px'
					,	'left': '0px'
					,	'width': screen.width()
					})
					.append(li.filter(':first').clone().addClass('slide-cloned'));

				// liを再キャッシュ
				li = ul.find('li');
			} else {
				ul.css({'left': '0px', 'width': screen.width()});
			}

			// ulタグの縦幅を調整する
			ul.css('height', li.size() * screen.height());

			li.each(function(i) {
				$(this).css({
					'height': shifth
				,	'top': (i*screen.height()) + 'px'
				});
			});

			interval = setInterval(function() {
				nextAnimate(slideup);
			}, params.slideTime);
		};

		/**
		 * 画像ギャラリーをスライドする(フェード)
		 */
		var nextAnimate = function(func) {

			var showNext = true;

			// カルーセル
			if (params.carousel === 'true') {
				doCarousel();
			} else {
				if (isLastPhoto()) {
					showNext = false;
					clearInterval(interval);
				}
			}

			if (showNext) {
				func();
				description.html(next.find('img').attr('alt'));
			}
		}

		/**
		 * 画像ギャラリーをスライドする(フェード)
		 */
		var fade = function() {

			cur = li.filter('.cur');
			next = cur.next();

			if (params.carousel === 'true' && next.size() === 0) {
				next = li.filter(':first');
				pos = 0;
			} else if (next.size() === 0) {
				clearInterval(interval);
				return;
			}

			++pos;

			cur.animate({'opacity': 0}
			,	params.fadeSpeed
			,	params.easing
			,	function() {

				nextAnimate(function() {
					next.animate({'opacity': 1}
						,	params.fadeSpeed
						,	params.easing
						,	function() {
							setCurrentPosition();
						});
				});

			});
		};

		/**
		 * 画像ギャラリーをスライドする(横)
		 */
		var slide = function() {

			if (ul.is(':animated')) return;

			cur = li.filter('.cur');
			next = cur.next();

			++pos;

			ul.animate(
				{ left: - (pos * shiftw) }
			,	params.slideSpeed
			,	params.easing
			,	function() {
				setCurrentPosition();
			});
		};

		/**
		 * 画像ギャラリーをスライドする(縦)
		 */
		var slideup = function() {

			if (ul.is(':animated')) return;

			cur = li.filter('.cur');
			next = cur.next();

			++pos;

			ul.animate(
				{ top: - ((pos * screen.height()) - SLIDE_TOP_MARGIN) }
			,	params.slideSpeed
			,	params.easing
			,	function() {
				setCurrentPosition();
			});
		};

		/**
		 * 現在地設定
		 */
		var setCurrentPosition = function() {
			cur.removeClass('cur');
			next.addClass('cur');
		}

		/**
		 * カルーセル終端処理
		 */
		var doCarousel = function() {

			if(!isLastPhoto()) return;

			switch(params.slideType) {
				case SLIDE_TYPE_FADE:
					break;
				case SLIDE_TYPE_H:
					ul.css('left', '0px')
					pos = 0;
					li.removeClass('cur').filter(':first').addClass('cur');
					break;
				case SLIDE_TYPE_V:
					ul.css('top', '0px')
					pos = 0;
					li.removeClass('cur').filter(':first').addClass('cur');
					break;
			}
		};

		/**
		 * イベントバンドル
		 */
		var bundle = function() {

			/* windowがリサイズされた場合 */
			$(window).resize(function () {

				if ($('#full-screen').is(':hidden')) return;

				clearInterval(interval);

				init();
			});

			/* スライドショーを表示ボタンクリック時 */
			$('.slideshow').click(function() {

				clearInterval(interval);

				cachedList = null;

				// 画面から受け取ったパラメータを設定する
				params.showMessage = $('.showMessage:checked').val();
				params.slideType = parseInt($('.animateType:checked').val(), 10);
				params.slideTime = params.slideSpeed + (1000 * parseInt($('.switchTime:checked').val(), 10));
				params.carousel = $('.doLoop:checked').val();
				params.random = $('.showType:checked').val();

				var albumPhotos = $('#album-photos').find('li.checked')
				,	slideFrame = $('#slide-photos')
				,	slidePhotos = []
				,	photoTemplate = '<% _.each(photos, function(data) { %>'
								+	'<li><img src="<%- data.imagePath %>" alt="<%- data.caption %>" width="776" height="582" class="image" /></li>'
								+	'<% }); %>';

				// 画像が選択されていない場合はエラー処理
				if (albumPhotos.size() === 0) {
					$.mynavialert({message: "スライドショーに表示する画像を選択してください。"});
					return;
				}

				// テンプレートを元にHTMLを生成しチェックされている画像でスライドショーを作成する
				albumPhotos.each(function() {
					var photo = $(this).find('img')
					,	data = {};

					// ギャラリー画像に設定する値をdataに設定
					data.imagePath = photo.attr('src');
					data.caption = photo.attr('alt');

					// テンプレートに渡すため配列に格納
					slidePhotos[slidePhotos.length] = data;
				});

				if (params.random === 'true') {
					slidePhotos = _.shuffle(slidePhotos);
				}

				slideFrame.empty().append($(_.template(photoTemplate, {photos: slidePhotos})));

				// 正常な高さを取得するため初期化前にスクリーンを表示する
				$('#full-screen').show();

				init();
			});

			/* スライドショー画面クリック時 */
			$('#full-screen').click(function(e) {

				e.preventDefault();

				clearInterval(interval);

				$('#full-screen').hide();
			});

			/* ESCキー押下時 */
			$(document).keyup(function(e) {

				if ($('#full-screen').is(':visible') && e.keyCode == 27) {

					clearInterval(interval);

					$('#full-screen').hide();
				}
			});
		};

		/**
		 * メイン処理
		 */
		return this.each(function() {

			// 共通初期化処理
			init();

			// イベントバンドル
			bundle();
		});

	};

})(jQuery);
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

(function($) {
	/*
	 * mynavimessage
	 *
	 * Description:
	 * 　ポップアップメッセージを表示する
	 *
	 * Sample:
	 * 	$.mynavimessage({
	 *		message: "こんにちは"
	 *  });

	 */

	var options = {
		message: "",
		windowClassName: "popupWindow",
		timer: 5000,
		zIndex: 10000,
		callback: function(){}
	};

	$.mynavimessage = function(opts) {
		var settings = $.extend(options, opts);

		var totalHeight = 5;
		$('.' + settings.windowClassName).each(function() {
			totalHeight = totalHeight + $(this).height() + 5;
		});

		var elem = $([
			'<div class="'+settings.windowClassName+'">',
				'<div class="inner">',
				'<p class="message"></p>',
				'</div>',
			'</div>'
					].join(''))
			.css('position', 'fixed')
			.css('z-index', settings.zIndex)
			.css('background-color', '#ffffff')
			.css('border', 'solid 2px black')
			.css('width', '360px')
			.css('border-radius', '10px')
			.css('filter', 'alpha(opacity=90)')
			.css('-moz-opacity', '0.9')
			.css('opacity', '0.9');

		$('<p class="button"><a href="#" class="closeBtn">[閉じる]</a></p>')
			.css('position', 'absolute')
			.css('top', '6px')
			.css('right', '6px')
			.css('margin', '0').appendTo(elem);

		$('body').append(elem);
		var top  = Math.floor(totalHeight),
			left = Math.floor($(window).width() - elem.width() - 20);

		elem.hide().css({
			top: top + "px",
			left: left + "px"
		});

		elem.find('.message').html(settings.message);

		elem.fadeIn(300, function(){
			options.callback();

			var timer = setTimeout(function() {
				clearInterval(timer);
				elem.fadeOut(300, "easeOutBack", function(){

					var self = $(this);

					self.remove();
					removeWin();
				});
			}, settings.timer);

			// マウスオーバー時に、自動クローズを停止
			elem.click(function (e) {
				e.preventDefault();
				clearInterval(timer);
			});

			// 閉じるリンククリック時
			elem.find('.closeBtn').click(function(e) {
				e.preventDefault();
				var self = $(this).closest('.'+settings.windowClassName);
				self.remove();
				removeWin();
			});
		});

		var nowLoading = false;
		var removeWin = function() {
			if (nowLoading) {
				return;
			}
			nowLoading = true;
			var listSize = $('.' + settings.windowClassName).size();
			var totalHeight = 5;
			$('.' + settings.windowClassName).each(function(i) {
				var self = $(this);
				if (i !== 0) {
					totalHeight = totalHeight + self.height() + 5;
				}
				self.animate({
					top: totalHeight + "px"
				}, 300, "easeOutBack", function(){
					if (listSize-1 === i)  {
						nowLoading = false;
					}
				});

			});
		};

	};

})(jQuery);


(function($) {
	/*
	 * tooltip
	 *
	 * Copyright (c) 2013 iseyohsitaka at teamLab
	 *
	 * Description: ツールチップを表示する
	 */
	$.fn.tooltip = function(options) {

		// デフォルト値
		var defaults = {
			screen : ['<div class="window forefront display-none">',
					 	'<div class="inner">',
					 		'<p class="text"></p>',
						'</div>',
						'<p class="button js-closebtn"><a href="#" class="closeBtn"><img src="/img/btn_window_close.png" alt="閉じる" width="15" height="15" class="imgover" /></a></p>',
					'</div>'
				 ].join(''),
			text : null,
			closeBtn : '.js-closebtn',
			isClick : false,
			left : null
		};

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(defaults, options);

		var screen = null,
			closeBtn = null;

		var init = function(obj) {
			screen = $(settings.screen);
			closeBtn = $(settings.closeBtn);

			// 表示するテキストを設定する。
			if (settings.text) {
				screen.find('.text').append(settings.text);
			}

			// クリックの場合
			if (!settings.isClick) {
				closeBtn.hide();
			}

			// 位置の調整
			if (settings.left) {
				screen.css('left', settings.left);
			}

			$(obj).after(screen);
		};

		var bind = function(obj) {
			var target = $(obj).next('div.window,div.window2,div.popup_bg');
			// クリックの場合
			if (settings.isClick) {
				$(obj).click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					if (!target.is(':visible')) {
						$(settings.closeBtn).click();
						target.show();
					}
				});
				closeBtn.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					target.hide();
				});
				$(target).click(function(e) {
					e.stopPropagation();
				});
				$('body').click(function(e) {
					if (target.is(':visible')) {
						e.preventDefault();
						target.hide();
					}
				});
			// マウスオーバーの場合
			} else {
				$(obj).click(function(e) {
					event.preventDefault();
				});
				$(obj).hover(
					function () {
						target.show();
					},
					function () {
						target.hide();
					}
				);

			}
		};

		// 処理開始
		$(this).each(function() {
			init(this);
			// イベントのバインド
			bind(this);
		});

	};

})(jQuery);


(function($) {
	/*
	 * mynaviUpload
	 *
	 * Copyright (c) 2017 iseyoshitaka at teamLab
	 *
	 * Description:
	 * �t�@�C���񓯊��A�b�v���[�_�[
	 *
	 */
	$.mynaviUpload = function(options) {
	
		var params = $.extend({}, $.mynaviUpload.defaults, options);

		var init = function(files) {

			var uploadUrl = params.uploadUrl;
			var contentType = params.contentType;
			var maxFileSize = params.maxFileSize;
			var successCallback = params.successCallback;
			var errorsCallback = params.errorsCallback;
			
			// �摜URL����t�@�C�����A�b�v���[�h
			this.imageUrlUpload = function(imagePath, imageId) {
				// �摜�����[�h
				var img = $('<img>');
				img
					.load(function() {
						var o_width = img[0].width;
						var o_height = img[0].height;
						
						// canvas�ɏ����o��
						var canvas = document.createElement('canvas');
						canvas.width  = o_width;
						canvas.height = o_height;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img[0], 0, 0);
						var base64 = canvas.toDataURL(contentType);
						
						// Base64����o�C�i���֕ϊ�
						var bin = atob(base64.replace(/^.*,/, ''));
						
						// �o�C�i������Blob �֕ϊ�
						var buffer = new Uint8Array(bin.length);
						for (var i = 0; i < bin.length; i++) {
						  buffer[i] = bin.charCodeAt(i);
						}
						var blob = new Blob([buffer.buffer], {type: contentType});
						blob.name = imagePath.substring(imagePath.lastIndexOf('/')+1).replace(/(.*)\.(.*)\?(.*)$/, '$1.$2');
						blob.imageId = imageId;
						var files = [blob];
						var obj = {files : files};
						
						// �t�@�C��API�ɑΉ����Ă���ꍇ�́A�摜�`�F�b�N�ƃT�C�Y�`�F�b�N���N���C�A���g���ł��s���B
						if (window.File && window.FileReader && window.FileList && window.Blob){
							for(var i=0,len=files.length; i<len; i++){
								var file = files[i];
								var errors = [];
								
								// �摜�t�@�C���`�F�b�N
								if( !file.type.match("image.*") ){
									errors.push('�摜�t�@�C�����s���ł��B');
								}
								// �t�@�C���T�C�Y�`�F�b�N
								if( maxFileSize && maxFileSize <= file.size ){
									errors.push('�摜�t�@�C���̃t�@�C���T�C�Y���ő�l('+ maxFileSize +'�o�C�g)�𒴂��Ă��܂��B');
								}

								if (0 < errors.length) {
									if (errorsCallback) {
										errorsCallback(errors);
									}

									return false;
								}
							}
						}
						
						fileUpload(obj);
					});
				img.attr('src', imagePath);
			};
			
			// �t�@�C���̃A�b�v���[�h
			var fileUpload = this.fileUpload = function (obj) {

				// 60�b�ȓ��Ƀ��X�|���X���Ȃ��ꍇ�́A�^�C���A�E�g���b�Z�[�W��\������B
				var timer = setTimeout( function() {
					var errors = [];
					errors.push('�^�C���A�E�g���������܂����B');

					if (errorsCallback) {
						errorsCallback(errors);
					}

					return false;
				}, 60000);
				
				var def = $.Deferred();
				var promise = def;

				// �t�@�C�����^�X�N���쐬
				$.each(obj.files, function(i, file){
					 
					promise = promise.pipe(function(response){
						 
						var newPromise = $.Deferred();
		
						var formData = new FormData();
						formData.enctype = 'multipart/form-data';
						formData.append('uploadImageFile', file, file.name);
						formData.append('uploadImageId', file.imageId);
						$.ajax({
							url: uploadUrl,
							type: 'POST',
							dataType: 'json',
							data: formData,
							cache: false,
							contentType: false,
							processData: false,
							success: function(res) {
								
								clearInterval(timer);
								
								if (successCallback) {
									successCallback(res);
								}

							},
							error: function(xhr, textStatus, errorThrown) {
								var res = {};
								try {
									res = $.parseJSON(xhr.responseText);
								} catch (e) {}
								alert(res.errorMessage);
							},
							complete: function() {
								newPromise.resolve();
							}
						});
						return newPromise;
					});
				});
				def.resolve();
			};
			
		};

		return new init();
	}
	
	$.mynaviUpload.defaults = {
		uploadUrl: '/client/album/list/imageUpload/',
		contentType : 'image/jpeg',
		maxFileSize : null,
		successCallback : null,
		errorsCallback : null
	}

})(jQuery);
/**
 * WYSIWYG - jQuery plugin 0.6
 *
 * Copyright (c) 2008-2009 Juan M Martinez
 * http://plugins.jquery.com/project/jWYSIWYG
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Id: $
 */
(function( $ )
{
    $.fn.document = function()
    {
        var element = this.get(0);

        if ( element.nodeName.toLowerCase() == 'iframe' )
        {
            return element.contentWindow.document;
            /*
            return ( $.browser.msie )
                ? document.frames[element.id].document
                : element.contentWindow.document // contentDocument;
             */
        }
        return this;
    };

    $.fn.documentSelection = function()
    {
        var element = this.get(0);

        if ( element.contentWindow.document.selection )
            return element.contentWindow.document.selection.createRange().text;
        else
            return element.contentWindow.getSelection().toString();
    };

    $.fn.wysiwyg = function( options )
    {
        if ( arguments.length > 0 && arguments[0].constructor == String )
        {
            var action = arguments[0].toString();
            var params = [];

            for ( var i = 1; i < arguments.length; i++ )
                params[i - 1] = arguments[i];

            if ( action in Wysiwyg )
            {
                return this.each(function()
                {
                    $.data(this, 'wysiwyg')
                     .designMode();

                    Wysiwyg[action].apply(this, params);
                });
            }
            else return this;
        }

        var controls = {};

        /**
         * If the user set custom controls, we catch it, and merge with the
         * defaults controls later.
         */
        if ( options && options.controls )
        {
            var controls = options.controls;
            delete options.controls;
        }

        options = $.extend({
            html : '<'+'?xml version="1.0" encoding="UTF-8"?'+'><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body style="margin: 0px;">INITIAL_CONTENT</body></html>',
            css  : {},

            debug        : false,

            autoSave     : true,  // http://code.google.com/p/jwysiwyg/issues/detail?id=11
            rmUnwantedBr : true,  // http://code.google.com/p/jwysiwyg/issues/detail?id=15
            brIE         : true,

            controls : {},
            messages : {}
        }, options);

        options.messages = $.extend(true, options.messages, Wysiwyg.MSGS_EN);
        options.controls = $.extend(true, options.controls, Wysiwyg.TOOLBAR);

        for ( var control in controls )
        {
            if ( control in options.controls )
                $.extend(options.controls[control], controls[control]);
            else
                options.controls[control] = controls[control];
        }

        // not break the chain
        return this.each(function()
        {
            Wysiwyg(this, options);
        });
    };

    function Wysiwyg( element, options )
    {
        return this instanceof Wysiwyg
            ? this.init(element, options)
            : new Wysiwyg(element, options);
    }

    $.extend(Wysiwyg, {
        insertImage : function( szURL, attributes )
        {
            var self = $.data(this, 'wysiwyg');

            if ( self.constructor == Wysiwyg && szURL && szURL.length > 0 )
            {
                if ($.browser.msie) self.focus();
                if ( attributes )
                {
                    self.editorDoc.execCommand('insertImage', false, '#jwysiwyg#');
                    var img = self.getElementByAttributeValue('img', 'src', '#jwysiwyg#');

                    if ( img )
                    {
                        img.src = szURL;

                        for ( var attribute in attributes )
                        {
                            img.setAttribute(attribute, attributes[attribute]);
                        }
                    }
                }
                else
                {
                    self.editorDoc.execCommand('insertImage', false, szURL);
                }
            }
        },

        createLink : function( szURL )
        {
            var self = $.data(this, 'wysiwyg');

            if ( self.constructor == Wysiwyg && szURL && szURL.length > 0 )
            {
                var selection = $(self.editor).documentSelection();

                if ( selection.length > 0 )
                {
                    if ($.browser.msie) self.focus();
                    self.editorDoc.execCommand('unlink', false, []);
                    self.editorDoc.execCommand('createLink', false, szURL);
                }
                else if ( self.options.messages.nonSelection )
                    alert(self.options.messages.nonSelection);
            }
        },

        insertHtml : function( szHTML )
        {
            var self = $.data(this, 'wysiwyg');

            if ( self.constructor == Wysiwyg && szHTML && szHTML.length > 0 )
            {
                if ($.browser.msie)
                {
                    self.focus();
                    self.editorDoc.execCommand('insertImage', false, '#jwysiwyg#');
                    var img = self.getElementByAttributeValue('img', 'src', '#jwysiwyg#');
                    if (img)
                    {
                        $(img).replaceWith(szHTML);
                    }
                }
                else
                {
                    self.editorDoc.execCommand('insertHTML', false, szHTML);
                }
            }
        },

        setContent : function( newContent )
        {
            var self = $.data(this, 'wysiwyg');
                self.setContent( newContent );
                self.saveContent();
        },

        clear : function()
        {
            var self = $.data(this, 'wysiwyg');
                self.setContent('');
                self.saveContent();
        },

        MSGS_EN : {
            nonSelection : 'select the text you wish to link'
        },

        TOOLBAR : {
            bold          : { visible : true, tags : ['b', 'strong'], css : { fontWeight : 'bold' }, tooltip : "Bold" },
            italic        : { visible : true, tags : ['i', 'em'], css : { fontStyle : 'italic' }, tooltip : "Italic" },
            strikeThrough : { visible : true, tags : ['s', 'strike'], css : { textDecoration : 'line-through' }, tooltip : "Strike-through" },
            underline     : { visible : true, tags : ['u'], css : { textDecoration : 'underline' }, tooltip : "Underline" },

            separator00 : { visible : true, separator : true },

            justifyLeft   : { visible : true, css : { textAlign : 'left' }, tooltip : "Justify Left" },
            justifyCenter : { visible : true, tags : ['center'], css : { textAlign : 'center' }, tooltip : "Justify Center" },
            justifyRight  : { visible : true, css : { textAlign : 'right' }, tooltip : "Justify Right" },
            justifyFull   : { visible : true, css : { textAlign : 'justify' }, tooltip : "Justify Full" },

            separator01 : { visible : true, separator : true },

            indent  : { visible : true, tooltip : "Indent" },
            outdent : { visible : true, tooltip : "Outdent" },

            separator02 : { visible : false, separator : true },

            subscript   : { visible : true, tags : ['sub'], tooltip : "Subscript" },
            superscript : { visible : true, tags : ['sup'], tooltip : "Superscript" },

            separator03 : { visible : true, separator : true },

            undo : { visible : true, tooltip : "Undo" },
            redo : { visible : true, tooltip : "Redo" },

            separator04 : { visible : true, separator : true },

            insertOrderedList    : { visible : true, tags : ['ol'], tooltip : "Insert Ordered List" },
            insertUnorderedList  : { visible : true, tags : ['ul'], tooltip : "Insert Unordered List" },
            insertHorizontalRule : { visible : true, tags : ['hr'], tooltip : "Insert Horizontal Rule" },

            separator05 : { separator : true },

            createLink : {
                visible : true,
                exec    : function()
                {
                    var selection = $(this.editor).documentSelection();

                    if ( selection.length > 0 )
                    {
                        if ( $.browser.msie )
                        {
                            this.focus();
                            this.editorDoc.execCommand('createLink', true, null);
                        }
                        else
                        {
                            var szURL = prompt('URL', 'http://');

                            if ( szURL && szURL.length > 0 )
                            {
                                this.editorDoc.execCommand('unlink', false, []);
                                this.editorDoc.execCommand('createLink', false, szURL);
                            }
                        }
                    }
                    else if ( this.options.messages.nonSelection )
                        alert(this.options.messages.nonSelection);
                },

                tags : ['a'],
                tooltip : "Create link"
            },

            insertImage : {
                visible : true,
                exec    : function()
                {
                    if ( $.browser.msie )
                    {
                        this.focus();
                        this.editorDoc.execCommand('insertImage', true, null);
                    }
                    else
                    {
                        var szURL = prompt('URL', 'http://');

                        if ( szURL && szURL.length > 0 )
                            this.editorDoc.execCommand('insertImage', false, szURL);
                    }
                },

                tags : ['img'],
                tooltip : "Insert image"
            },

            separator06 : { separator : true },

            h1mozilla : { visible : true && $.browser.mozilla, className : 'h1', command : 'heading', arguments : ['h1'], tags : ['h1'], tooltip : "Header 1" },
            h2mozilla : { visible : true && $.browser.mozilla, className : 'h2', command : 'heading', arguments : ['h2'], tags : ['h2'], tooltip : "Header 2" },
            h3mozilla : { visible : true && $.browser.mozilla, className : 'h3', command : 'heading', arguments : ['h3'], tags : ['h3'], tooltip : "Header 3" },

            h1 : { visible : true && !( $.browser.mozilla ), className : 'h1', command : 'formatBlock', arguments : ['<H1>'], tags : ['h1'], tooltip : "Header 1" },
            h2 : { visible : true && !( $.browser.mozilla ), className : 'h2', command : 'formatBlock', arguments : ['<H2>'], tags : ['h2'], tooltip : "Header 2" },
            h3 : { visible : true && !( $.browser.mozilla ), className : 'h3', command : 'formatBlock', arguments : ['<H3>'], tags : ['h3'], tooltip : "Header 3" },

            separator07 : { visible : false, separator : true },

            cut   : { visible : false, tooltip : "Cut" },
            copy  : { visible : false, tooltip : "Copy" },
            paste : { visible : false, tooltip : "Paste" },

            separator08 : { separator : false && !( $.browser.msie ) },

            increaseFontSize : { visible : false && !( $.browser.msie ), tags : ['big'], tooltip : "Increase font size" },
            decreaseFontSize : { visible : false && !( $.browser.msie ), tags : ['small'], tooltip : "Decrease font size" },

            separator09 : { separator : true },

            html : {
                visible : false,
                exec    : function()
                {
                    if ( this.viewHTML )
                    {
                        this.setContent( $(this.original).val() );
                        $(this.original).hide();
                    }
                    else
                    {
                        this.saveContent();
                        $(this.original).show();
                    }

                    this.viewHTML = !( this.viewHTML );
                },
                tooltip : "View source code"
            },

            removeFormat : {
                visible : true,
                exec    : function()
                {
                    if ($.browser.msie) this.focus();
                    this.editorDoc.execCommand('removeFormat', false, []);
                    this.editorDoc.execCommand('unlink', false, []);
                },
                tooltip : "Remove formatting"
            }
        }
    });

    $.extend(Wysiwyg.prototype,
    {
        original : null,
        options  : {},

        element  : null,
        editor   : null,

        focus : function()
        {
            $(this.editorDoc.body).focus();
        },

        init : function( element, options )
        {
            var self = this;

            this.editor = element;
            this.options = options || {};

            $.data(element, 'wysiwyg', this);

            var newX = element.width || element.clientWidth;
            var newY = element.height || element.clientHeight;

            if ( element.nodeName.toLowerCase() == 'textarea' )
            {
                this.original = element;

                if ( newX == 0 && element.cols )
                    newX = ( element.cols * 8 ) + 21;

                if ( newY == 0 && element.rows )
                    newY = ( element.rows * 16 ) + 16;

                var editor = this.editor = $('<iframe src="javascript:false;"></iframe>').css({
                    minHeight : ( newY - 6 ).toString() + 'px',
                    width     : ( newX - 8 ).toString() + 'px'
                }).attr('id', $(element).attr('id') + 'IFrame')
                .attr('frameborder', '0');

                /**
                 * http://code.google.com/p/jwysiwyg/issues/detail?id=96
                 */
                this.editor.attr('tabindex', $(element).attr('tabindex'));

                if ( $.browser.msie )
                {
                    this.editor
                        .css('height', ( newY ).toString() + 'px');

                    /**
                    var editor = $('<span></span>').css({
                        width     : ( newX - 6 ).toString() + 'px',
                        height    : ( newY - 8 ).toString() + 'px'
                    }).attr('id', $(element).attr('id') + 'IFrame');

                    editor.outerHTML = this.editor.outerHTML;
                     */
                }
            }

            var panel = this.panel = $('<ul role="menu" class="panel"></ul>');

            this.appendControls();
            this.element = $('<div></div>').css({
                width : ( newX > 0 ) ? ( newX ).toString() + 'px' : '100%'
            }).addClass('wysiwyg')
                .append(panel)
                .append( $('<div><!-- --></div>').css({ clear : 'both' }) )
                .append(editor)
		;

            $(element)
                .hide()
                .before(this.element)
		;

            this.viewHTML = false;
            this.initialHeight = newY - 8;

            /**
             * @link http://code.google.com/p/jwysiwyg/issues/detail?id=52
             */
            this.initialContent = $(element).val();
            this.initFrame();

            if ( this.initialContent.length == 0 )
                this.setContent('');

            /**
             * http://code.google.com/p/jwysiwyg/issues/detail?id=100
             */
            var form = $(element).closest('form');

            if ( this.options.autoSave )
	    {
                form.submit(function() { self.saveContent(); });
	    }

            form.bind('reset', function()
            {
                self.setContent( self.initialContent );
                self.saveContent();
            });
        },

        initFrame : function()
        {
            var self = this;
            var style = '';

            /**
             * @link http://code.google.com/p/jwysiwyg/issues/detail?id=14
             */
            if ( this.options.css && this.options.css.constructor == String )
	    {
                style = '<link rel="stylesheet" type="text/css" media="screen" href="' + this.options.css + '" />';
	    }

            this.editorDoc = $(this.editor).document();
            this.editorDoc_designMode = false;

            try {
                this.editorDoc.designMode = 'on';
                this.editorDoc_designMode = true;
            } catch ( e ) {
                // Will fail on Gecko if the editor is placed in an hidden container element
                // The design mode will be set ones the editor is focused

                $(this.editorDoc).focus(function()
                {
                    self.designMode();
                });
            }

            this.editorDoc.open();
            this.editorDoc.write(
                this.options.html
                    /**
                     * @link http://code.google.com/p/jwysiwyg/issues/detail?id=144
                     */
                    .replace(/INITIAL_CONTENT/, function() { return self.initialContent; })
                    .replace(/STYLE_SHEET/, function() { return style; })
            );
            this.editorDoc.close();

            this.editorDoc.contentEditable = 'true';

            if ( $.browser.msie )
            {
                /**
                 * Remove the horrible border it has on IE.
                 */
                setTimeout(function() { $(self.editorDoc.body).css('border', 'none'); }, 0);
            }

            $(this.editorDoc).click(function( event )
            {
                self.checkTargets( event.target ? event.target : event.srcElement);
            });

            /**
             * @link http://code.google.com/p/jwysiwyg/issues/detail?id=20
             */
            $(this.original).focus(function()
            {
                if (!$.browser.msie)
                {
                    self.focus();
                }
            });

            if ( this.options.autoSave )
            {
                /**
                 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=11
                 */
                $(this.editorDoc).keydown(function() { self.saveContent(); })
                                 .keyup(function() { self.saveContent(); })
                                 .mousedown(function() { self.saveContent(); });
            }

            if ( this.options.css )
            {
                setTimeout(function()
                {
                    if ( self.options.css.constructor == String )
                    {
                        /**
                         * $(self.editorDoc)
                         * .find('head')
                         * .append(
                         *     $('<link rel="stylesheet" type="text/css" media="screen" />')
                         *     .attr('href', self.options.css)
                         * );
                         */
                    }
                    else
                        $(self.editorDoc).find('body').css(self.options.css);
                }, 0);
            }

            $(this.editorDoc).keydown(function( event )
            {
                if ( $.browser.msie && self.options.brIE && event.keyCode == 13 )
                {
                    var rng = self.getRange();
                    rng.pasteHTML('<br />');
                    rng.collapse(false);
                    rng.select();
                    return false;
                }
                return true;
            });
        },

        designMode : function()
        {
            if ( !( this.editorDoc_designMode ) )
            {
                try {
                    this.editorDoc.designMode = 'on';
                    this.editorDoc_designMode = true;
                } catch ( e ) {}
            }
        },

        getSelection : function()
        {
            return ( window.getSelection ) ? window.getSelection() : document.selection;
        },

        getRange : function()
        {
            var selection = this.getSelection();

            if ( !( selection ) )
                return null;

            return ( selection.rangeCount > 0 ) ? selection.getRangeAt(0) : selection.createRange();
        },

        getContent : function()
        {
            return $( $(this.editor).document() ).find('body').html();
        },

        setContent : function( newContent )
        {
            $( $(this.editor).document() ).find('body').html(newContent);
        },

        saveContent : function()
        {
            if ( this.original )
            {
                var content = this.getContent();

                if ( this.options.rmUnwantedBr )
		{
                    content = ( content.substr(-4) == '<br>' ) ? content.substr(0, content.length - 4) : content;
		}

                $(this.original).val(content);
            }
        },

        withoutCss: function()
        {
            if ($.browser.mozilla)
            {
                try
                {
                    this.editorDoc.execCommand('styleWithCSS', false, false);
                }
                catch (e)
                {
                    try
                    {
                        this.editorDoc.execCommand('useCSS', false, true);
                    }
                    catch (e)
                    {
                    }
                }
            }
        },

        appendMenu : function( cmd, args, className, fn, tooltip )
        {
            var self = this;
            args = args || [];

            $('<li></li>').append(
                $('<a role="menuitem" tabindex="-1" href="javascript:;">' + (className || cmd) + '</a>')
                    .addClass(className || cmd)
                    .attr('title', tooltip)
            ).click(function() {
                if ( fn ) fn.apply(self); else
                {
                    self.withoutCss();
                    self.editorDoc.execCommand(cmd, false, args);
                }
                if ( self.options.autoSave ) self.saveContent();
            }).appendTo( this.panel );
        },

        appendMenuSeparator : function()
        {
            $('<li role="separator" class="separator"></li>').appendTo( this.panel );
        },

        appendControls : function()
        {
            for ( var name in this.options.controls )
            {
                var control = this.options.controls[name];

                if ( control.separator )
                {
                    if ( control.visible !== false )
                        this.appendMenuSeparator();
                }
                else if ( control.visible )
                {
                    this.appendMenu(
                        control.command || name, control.arguments || [],
                        control.className || control.command || name || 'empty', control.exec,
                        control.tooltip || control.command || name || ''
                    );
                }
            }
        },

        checkTargets : function( element )
        {
            for ( var name in this.options.controls )
            {
                var control = this.options.controls[name];
                var className = control.className || control.command || name || 'empty';

                $('.' + className, this.panel).removeClass('active');

                if ( control.tags )
                {
                    var elm = element;

                    do {
                        if ( elm.nodeType != 1 )
                            break;

                        if ( $.inArray(elm.tagName.toLowerCase(), control.tags) != -1 )
                            $('.' + className, this.panel).addClass('active');
                    } while ((elm = elm.parentNode));
                }

                if ( control.css )
                {
                    var elm = $(element);

                    do {
                        if ( elm[0].nodeType != 1 )
                            break;

                        for ( var cssProperty in control.css )
                            if ( elm.css(cssProperty).toString().toLowerCase() == control.css[cssProperty] )
                                $('.' + className, this.panel).addClass('active');
                    } while ((elm = elm.parent()));
                }
            }
        },

        getElementByAttributeValue : function( tagName, attributeName, attributeValue )
        {
            var elements = this.editorDoc.getElementsByTagName(tagName);

            for ( var i = 0; i < elements.length; i++ )
            {
                var value = elements[i].getAttribute(attributeName);

                if ( $.browser.msie )
                {
                    /** IE add full path, so I check by the last chars. */
                    value = value.substr(value.length - attributeValue.length);
                }

                if ( value == attributeValue )
                    return elements[i];
            }

            return false;
        }
    });
})(jQuery);


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

