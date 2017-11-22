/*
* author: "oujizeng",
* license: "MIT",
* name: "moveToDelete.js",
* version: "1.2.5"
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root['MoveToDelete'] = factory();
    }
}(this, function () {

    var getAll = function (str) {
        return document.querySelectorAll(str);
    };

    var util = {
        hasClass: function (e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        },
        addClass: function (e, c) {
            if ( this.hasClass(e, c) ) {
                return;
            }
            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        },
        removeClass: function (e, c) {
            if ( !this.hasClass(e, c) ) {
                return;
            }
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, '');
        }
    };

    var MoveToDelete = {

        init: function(opt){


            var moveCount = opt.moveCount || 80,            // 位移距离
                container = getAll(opt.container);          // 主容器

            for (var i = 0; i < container.length; i++) {

                var moveX = 0, moveY = 0,                   // 拖动量
                    moveStart = null;                       // 开始抓取标志位

                // 补充操作按钮
                for (var n = 0; n < opt.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = opt.buttons[n].text;
                    btn.classList.add(opt.buttons[n].class);
                    container[i].appendChild(btn);
                }

                // 开启硬件加速
                container[i].style.webkitTransform = 'translateZ(0)';
                container[i].style.transform = 'translateZ(0)';

                // 开始滑动
                container[i].addEventListener('touchstart', function (event) {

                    // 还原动画时间
                    this.style.webkitTransitionDuration = '0ms';
                    this.style.transitionDuration = '0ms';

                    // 关闭其他项的按钮，也可以放在滑动结束
                    for (var ii = 0; ii < container.length; ii++) {
                        if (util.hasClass(container[ii], 'move-out-click') && container[ii] != this) {
                            // 动画慢一点，避免卡帧
                            container[ii].style.webkitTransitionDuration = '325ms';
                            container[ii].style.transitionDuration = '325ms';
                            container[ii].style.webkitTransform = 'translateX(0px)';
                            container[ii].style.transform = 'translateX(0px)';
                            util.removeClass(container[ii], 'move-out-click');
                        }
                    }

                    // 记录滑动位置
                    moveStart = {
                        x: event.touches[0].pageX,
                        y: event.touches[0].pageY
                    }
                }, true);

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
                            if(util.hasClass(this, 'move-out-click')) {
                                var x = moveX > moveCount ? 0 : -moveCount + moveX;
                                this.style.webkitTransform = 'translateX(' + x + 'px)';
                                this.style.transform = 'translateX(' + x + 'px)';
                            }
                        }
                        // 向左滑动
                        if (moveX < 0) {
                            // 没有按钮的时候才处理
                            if(!(util.hasClass(this, 'move-out-click'))) {
                                var x = Math.abs(moveX) > moveCount ? -moveCount : moveX;
                                this.style.webkitTransform = 'translateX(' + x + 'px)';
                                this.style.transform = 'translateX(' + x + 'px)';
                            }
                        }
                    }
                }, true);

                // 滑动结束
                container[i].addEventListener('touchend', function(event){
                    // 防止手机滑动跨越了几个容器，造成没有开始位置
                    if (moveStart === null) {
                        return;
                    }

                    // 规划代码：上下滑动距离达到或者超过容器高度就指示为滚动，不做处理

                    // 动画慢一点，避免卡帧
                    this.style.webkitTransitionDuration = '125ms';
                    this.style.transitionDuration = '125ms';

                    // 已经显示按钮
                    if(util.hasClass(this, 'move-out-click')) {

                        // 向右滑动，超过位移系数一半就隐藏按钮
                        if(moveX > 0){
                            //var x = moveX > (moveCount / 2) ? 0 : -moveCount;
                            var x = moveX > 10 ? 0 : -moveCount;  //改为超过10就隐藏按钮
                            this.style.webkitTransform = 'translateX(' + x + 'px)';
                            this.style.transform = 'translateX(' + x + 'px)';
                            if (x === 0) {
                                util.removeClass(this, 'move-out-click');
                            }
                        }
                    } else {
                        // 向左滑动，超过位移系数一半就显示按钮
                        if (moveX < 0) {
                            var x = Math.abs(moveX) > moveCount / 2 ? -moveCount : 0;
                            this.style.webkitTransform = 'translateX(' + x + 'px)';
                            this.style.transform = 'translateX(' + x + 'px)';
                            if (x !== 0 ) {
                                util.addClass(this, 'move-out-click');
                            }
                        }
                    }

                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                    moveY = 0;
                }, true);

                // 滑动取消
                container[i].addEventListener('touchcancel', function(event) {
                    console.log('cancel');
                    // 回到初始位置
                    this.style.webkitTransitionDuration = '225ms';
                    this.style.transitionDuration = '225ms';
                    this.style.webkitTransform = 'translateX(0px)';
                    this.style.transform = 'translateX(0px)';
                    util.removeClass(this, 'move-out-click');
                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                    moveY = 0;
                }, true);
            }
        }
    };

    return MoveToDelete;
}));