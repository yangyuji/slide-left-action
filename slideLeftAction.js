/**
 * author: "oujizeng",
 * license: "MIT",
 * github: "https://github.com/yangyuji/slide-left-action",
 * name: "slideLeftAction.js",
 * version: "1.3.2"
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
        this.init();
    }

    slideLeftAction.prototype = {
        version: '1.3.2',
        init: function () {
            var that = this;

            for (var i = 0; i < this.container.length; i++) {

                var moveX = 0, moveY = 0,                   // 拖动量
                    moveStart = null;                       // 开始抓取标志位

                // 补充操作按钮
                for (var n = 0; n < this.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = this.buttons[n].text;
                    btn.classList.add(this.buttons[n].class);
                    btn.addEventListener('click', this.buttons[n].click || null, false);
                    this.container[i].appendChild(btn);
                }

                // 开启硬件加速
                util._transform(this.container[i], 'transform', 'translateZ(0)');

                // 开始滑动
                this.container[i].addEventListener('touchstart', function (event) {

                    // 还原动画时间
                    util._transform(this, 'transitionDuration', '0ms');

                    // 关闭其他项的按钮，也可以放在滑动结束
                    for (var ii = 0; ii < that.container.length; ii++) {
                        if (that.container[ii].classList.contains('move-out-click') && that.container[ii] != this) {
                            // 动画慢一点
                            util._transform(that.container[ii], 'transitionDuration', '225ms');
                            util._transform(that.container[ii], 'transform', 'translateX(0px)');
                            that.container[ii].classList.remove('move-out-click');
                        }
                    }

                    // 记录滑动位置
                    moveStart = {
                        x: event.touches[0].pageX,
                        y: event.touches[0].pageY
                    }
                }, false);

                // 滑动过程
                this.container[i].addEventListener('touchmove', function (event) {
                    // 防止手机滑动跨越了几个容器，造成没有开始位置
                    if (moveStart === null) {
                        return;
                    }

                    var nowX = event.touches[0].pageX;
                    var nowY = event.touches[0].pageY;
                    moveX = nowX - moveStart.x;
                    moveY = nowY - moveStart.y;

                    // 规划代码：上下滑动距离达到或者超过容器高度就指示为滚动，不做处理

                    // 左右滑动
                    if (Math.abs(moveX) > Math.abs(moveY)) {
                        // 向右滑动
                        if (moveX > 0) {
                            // 有按钮的时候才处理
                            if (this.classList.contains('move-out-click')) {
                                var x = moveX > that.moveCount ? 0 : -that.moveCount + moveX;
                                util._transform(this, 'transform', 'translateX(' + x + 'px)');
                            }
                        }
                        // 向左滑动
                        if (moveX < 0) {
                            // 没有按钮的时候才处理
                            if (!(this.classList.contains('move-out-click'))) {
                                var x = Math.abs(moveX) > that.moveCount ? -that.moveCount : moveX;
                                util._transform(this, 'transform', 'translateX(' + x + 'px)');
                            }
                        }
                    }
                }, util._supportPassive() ? { passive: true } : false);

                // 滑动结束
                this.container[i].addEventListener('touchend', function () {
                    // 防止手机滑动跨越了几个容器，造成没有开始位置
                    if (moveStart === null) {
                        return;
                    }

                    // 因为已经滑动一段距离了，把动画调快一点
                    util._transform(this, 'transitionDuration', '125ms');

                    // 已经显示按钮
                    if (this.classList.contains('move-out-click')) {
                        // 向右滑动
                        if (moveX > 0) {
                            // 超过位移系数一半就隐藏按钮
                            //var x = moveX > (that.moveCount / 2) ? 0 : -moveCount;
                            var x = moveX > 10 ? 0 : -that.moveCount;  // 改为超过10就隐藏按钮
                            util._transform(this, 'transform', 'translateX(' + x + 'px)');
                            if (x === 0) {
                                this.classList.remove('move-out-click');
                            }
                        }
                    } else {
                        // 向左滑动
                        if (moveX < 0) {
                            // 超过位移系数一半就显示按钮
                            var x = Math.abs(moveX) > that.moveCount / 2 ? -that.moveCount : 0;
                            util._transform(this, 'transform', 'translateX(' + x + 'px)');
                            if (x !== 0) {
                                this.classList.add('move-out-click');
                            }
                        }
                    }

                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                    moveY = 0;
                }, false);

                // 滑动取消
                this.container[i].addEventListener('touchcancel', function () {
                    // 回到初始位置
                    util._transform(this, 'transitionDuration', '225ms');
                    util._transform(this, 'transform', 'translateX(0px)');
                    this.classList.remove('move-out-click');
                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                    moveY = 0;
                }, false);
            }
        }
    };

    var util = {
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