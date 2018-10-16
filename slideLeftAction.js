/**
 * author: "oujizeng",
 * license: "MIT",
 * github: "https://github.com/yangyuji/slide-left-action",
 * name: "slideLeftAction.js",
 * version: "1.3.3"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define == 'function' && define.amd) {
        define(function () {
            return factory();
        });
    } else {
        root['slideLeftAction'] = factory();
    }
}(this, function () {
    'use strict'

    function slideLeftAction(opt) {
        this.moveCount = opt.moveCount || 80;
        this.container = document.querySelectorAll(opt.container);
        this.buttons = opt.buttons;
        this.moveStart = null;
        this.moveX = 0;
        this.moveY = 0;
        this.init();
    }

    slideLeftAction.prototype = {
        version: '1.3.3',
        init: function () {
            for (var i = 0; i < this.container.length; i++) {
                // 补充操作按钮
                for (var n = 0; n < this.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = this.buttons[n].text;
                    btn.classList.add(this.buttons[n].class);
                    btn.addEventListener('click', this.buttons[n].click || null, false);
                    this.container[i].appendChild(btn);
                }
                // 开启硬件加速
                this._transform(this.container[i], 'Transform', 'translateZ(0)');
                this._bindEvent(this.container[i]);
            }
        },
        _start: function (el) {
            //console.log(el);
            // 还原动画时间
            this._transform(el, 'TransitionDuration', '0ms');

            // 关闭其他项的按钮，也可以放在滑动结束
            for (var ii = 0; ii < this.container.length; ii++) {
                if (this.container[ii].classList.contains('move-out-click') && this.container[ii] != el) {
                    // 动画慢一点
                    this._transform(this.container[ii], 'TransitionDuration', '225ms');
                    this._transform(this.container[ii], 'Transform', 'translateX(0px)');
                    this.container[ii].classList.remove('move-out-click');
                }
            }

            this.moveX = 0;
            this.moveY = 0;
            // 记录滑动位置
            this.moveStart = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            }
        },
        _move: function (el) {
            // 防止手机滑动跨越了几个容器，造成没有开始位置
            if (this.moveStart === null) {
                return;
            }

            var nowX = event.touches[0].pageX;
            var nowY = event.touches[0].pageY;
            this.moveX = nowX - this.moveStart.x;
            this.moveY = nowY - this.moveStart.y;

            // 左右滑动
            if (Math.abs(this.moveX) > Math.abs(this.moveY)) {
                // 向右滑动
                if (this.moveX > 0) {
                    // 有按钮的时候才处理
                    if (el.classList.contains('move-out-click')) {
                        var x = this.moveX > this.moveCount ? 0 : -this.moveCount + this.moveX;
                        this._transform(el, 'Transform', 'translateX(' + x + 'px)');
                    }
                }
                // 向左滑动
                if (this.moveX < 0) {
                    // 没有按钮的时候才处理
                    if (!(el.classList.contains('move-out-click'))) {
                        var x = Math.abs(this.moveX) > this.moveCount ? -this.moveCount : this.moveX;
                        this._transform(el, 'Transform', 'translateX(' + x + 'px)');
                    }
                }
            }
        },
        _end: function (el) {
            // 防止手机滑动跨越了几个容器，造成没有开始位置
            if (this.moveStart === null) {
                return;
            }

            // 因为已经滑动一段距离了，把动画调快一点
            this._transform(el, 'TransitionDuration', '125ms');

            // 已经显示按钮
            if (el.classList.contains('move-out-click')) {
                // 向右滑动
                if (this.moveX > 0) {
                    // 超过位移系数一半就隐藏按钮
                    //var x = moveX > (this.moveCount / 2) ? 0 : -this.moveCount;
                    var x = this.moveX > 10 ? 0 : -this.moveCount;  // 改为超过10就隐藏按钮
                    this._transform(el, 'Transform', 'translateX(' + x + 'px)');
                    if (x === 0) {
                        el.classList.remove('move-out-click');
                    }
                }
            } else {
                // 向左滑动
                if (this.moveX < 0) {
                    // 超过位移系数一半就显示按钮
                    var x = Math.abs(this.moveX) > this.moveCount / 2 ? -this.moveCount : 0;
                    this._transform(el, 'Transform', 'translateX(' + x + 'px)');
                    if (x !== 0) {
                        el.classList.add('move-out-click');
                    }
                }
            }

            // 恢复初始化状态
            this.moveStart = null;
            this.moveX = 0;
            this.moveY = 0;
        },
        _cancel: function (el) {
            // 回到初始位置
            this._transform(el, 'TransitionDuration', '225ms');
            this._transform(el, 'Transform', 'translateX(0px)');
            el.classList.remove('move-out-click');
            // 恢复初始化状态
            this.moveStart = null;
            this.moveX = 0;
            this.moveY = 0;
        },
        _bindEvent: function (item) {
            this.start = this._start.bind(this, item);
            this.move = this._move.bind(this, item);
            this.end = this._end.bind(this, item);
            this.cancel = this._cancel.bind(this, item);

            item.addEventListener('touchstart', this.start,  false);
            item.addEventListener('touchmove', this.move, this._supportPassive() ? { passive: true } : false);
            item.addEventListener('touchend', this.end, false);
            item.addEventListener('touchcancel', this.cancel, false);
        },
        _supportPassive: function () {
            var support = false;
            try {
                window.addEventListener("test", null,
                    Object.defineProperty({}, "passive", {
                        get: function () {
                            support = true;
                        }
                    })
                );
            } catch (err) {}
            return support
        },
        _transform: function (el, attr, val) {
            var vendors = ['', 'webkit', 'ms', 'Moz', 'O'],
                body = document.body || document.documentElement;

            [].forEach.call(vendors, function (vendor) {
                var styleAttr = vendor ? vendor + attr : attr.charAt(0).toLowerCase() + attr.substr(1);
                if (typeof body.style[styleAttr] === 'string') {
                    el.style[styleAttr] = val;
                }
            });
        }
    };

    return slideLeftAction;
}));