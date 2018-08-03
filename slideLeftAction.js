/*
* author: "oujizeng",
* license: "MIT",
* name: "slideLeftAction.js",
* version: "1.3.1"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define == 'function' && define.amd) {
        define( function () { return factory(); } );
    } else {
        root['slideLeftAction'] = factory();
    }
}(this, function () {
    'use strict'

    var passiveSupported = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
            get: function() {
                passiveSupported = true;
            }
        }));
    } catch(err) {}

    var _transform = function (el, attr, val) {
        var vendors = ['', 'webkit', 'ms', 'Moz', 'O'],
            body = document.body || document.documentElement;

        [].forEach.call(vendors, function (vendor) {
            var styleAttr = vendor ? vendor + attr.charAt(0).toUpperCase() + attr.substr(1) : attr;
            if (typeof body.style[styleAttr] === 'string') {
                el.style[styleAttr] = val;
            }
        });
    }

    var slideLeftAction = {

        init: function(opt) {

            var moveCount = opt.moveCount || 80,            // 位移距离
                container = document.querySelectorAll(opt.container);  // 主容器

            for (var i = 0; i < container.length; i++) {

                var moveX = 0, moveY = 0,                   // 拖动量
                    moveStart = null;                       // 开始抓取标志位

                // 补充操作按钮
                for (var n = 0; n < opt.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = opt.buttons[n].text;
                    btn.classList.add(opt.buttons[n].class);
                    btn.addEventListener('click', opt.buttons[n].click || null, false);
                    container[i].appendChild(btn);
                }

                // 开启硬件加速
                _transform(container[i], 'transform', 'translateZ(0)');

                // 开始滑动
                container[i].addEventListener('touchstart', function (event) {

                    // 还原动画时间
                    _transform(this, 'transitionDuration', '0ms');

                    // 关闭其他项的按钮，也可以放在滑动结束
                    for (var ii = 0; ii < container.length; ii++) {
                        if (container[ii].classList.contains('move-out-click') && container[ii] != this) {
                            // 动画慢一点
                            _transform(container[ii], 'transitionDuration', '225ms');
                            _transform(container[ii], 'transform', 'translateX(0px)');
                            container[ii].classList.remove('move-out-click');
                        }
                    }

                    // 记录滑动位置
                    moveStart = {
                        x: event.touches[0].pageX,
                        y: event.touches[0].pageY
                    }
                }, passiveSupported ? { passive: true } : false);

                // 滑动过程
                container[i].addEventListener('touchmove', function (event) {
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
                    if(Math.abs(moveX) > Math.abs(moveY)) {
                        // 向右滑动
                        if (moveX > 0) {
                            // 有按钮的时候才处理
                            if(this.classList.contains('move-out-click')) {
                                var x = moveX > moveCount ? 0 : -moveCount + moveX;
                                _transform(this, 'transform', 'translateX(' + x + 'px)');
                            }
                        }
                        // 向左滑动
                        if (moveX < 0) {
                            // 没有按钮的时候才处理
                            if(!(this.classList.contains('move-out-click'))) {
                                var x = Math.abs(moveX) > moveCount ? -moveCount : moveX;
                                _transform(this, 'transform', 'translateX(' + x + 'px)');
                            }
                        }
                    }
                }, passiveSupported ? { passive: true } : false);

                // 滑动结束
                container[i].addEventListener('touchend', function(){
                    // 防止手机滑动跨越了几个容器，造成没有开始位置
                    if (moveStart === null) {
                        return;
                    }

                    // 因为已经滑动一段距离了，把动画调快一点
                    _transform(this, 'transitionDuration', '125ms');

                    // 已经显示按钮
                    if(this.classList.contains('move-out-click')) {
                        // 向右滑动
                        if(moveX > 0) {
                            // 超过位移系数一半就隐藏按钮
                            //var x = moveX > (moveCount / 2) ? 0 : -moveCount;
                            var x = moveX > 10 ? 0 : -moveCount;  // 改为超过10就隐藏按钮
                            _transform(this, 'transform', 'translateX(' + x + 'px)');
                            if (x === 0) {
                                this.classList.remove('move-out-click');
                            }
                        }
                    } else {
                        // 向左滑动
                        if (moveX < 0) {
                            // 超过位移系数一半就显示按钮
                            var x = Math.abs(moveX) > moveCount / 2 ? -moveCount : 0;
                            _transform(this, 'transform', 'translateX(' + x + 'px)');
                            if (x !== 0 ) {
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
                container[i].addEventListener('touchcancel', function() {
                    // 回到初始位置
                    _transform(this, 'transitionDuration', '225ms');
                    _transform(this, 'transform', 'translateX(0px)');
                    this.classList.remove('move-out-click');
                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                    moveY = 0;
                }, false);
            }
        }
    };

    return slideLeftAction;
}));