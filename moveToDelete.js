/*
* author: "oujizeng",
* license: "MIT",
* name: "moveToDelete.js",
* version: "1.0.0"
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

                var moveX = 0,                              // 拖动量
                    moveStart = null;                       // 开始抓取标志位

                // 补充操作按钮
                for (var n = 0; n < opt.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = opt.buttons[n].text;
                    btn.classList.add(opt.buttons[n].class);
                    container[i].appendChild(btn);
                }

                // 动画慢一点，避免卡帧
                container[i].style.transitionDuration = '125ms';

                // 开始滑动
                container[i].addEventListener('touchstart', function (event) {
                    // 记录滑动位置
                    moveStart = event.touches ? event.touches[0].pageX : event.clientX;
                });

                // 滑动过程
                container[i].addEventListener('touchmove', function (event) {

                    var nowX = event.touches ? event.touches[0].pageX : event.clientX;
                    moveX = nowX - moveStart;
                    event.preventDefault();

                    // 向右滑动
                    if (moveX > 0) {
                        // 有按钮的时候才处理
                        if(util.hasClass(this, 'move-out-click')) {
                            var x = moveX > moveCount ? 0 : (-moveCount + Math.abs(moveX));
                            this.style.webkitTransform = 'translateX(' + x + 'px)';
                            this.style.transform = 'translateX(' + x + 'px)';
                        }
                    }
                    // 向左滑动
                    if (moveX < 0) {
                        // 没有按钮的时候才处理
                        if(!(util.hasClass(this, 'move-out-click'))) {
                            var x = Math.abs(moveX) > moveCount ? moveCount : Math.abs(moveX);
                            this.style.webkitTransform = 'translateX(' + -x + 'px)';
                            this.style.transform = 'translateX(' + -x + 'px)';
                        }
                    }
                });

                // 滑动结束
                container[i].addEventListener('touchend', function(event){

                    // 已经显示按钮
                    if(util.hasClass(this, 'move-out-click')) {

                        // 向右滑动，超过位移系数一半就隐藏按钮
                        if(moveX > 0){
                            var x = moveX > (moveCount / 2) ? 0 : -moveCount;
                            this.style.webkitTransform = 'translateX(' + x + 'px)';
                            this.style.transform = 'translateX(' + x + 'px)';
                            if (x === 0) {
                                util.removeClass(this, 'move-out-click');
                            }
                        }
                    } else {
                        // 向左滑动，超过位移系数一半就显示按钮
                        if (moveX < 0) {
                            var x = -moveX > moveCount / 2 ? -moveCount : 0;
                            this.style.webkitTransform = 'translateX(' + x + 'px)';
                            this.style.transform = 'translateX(' + x + 'px)';
                            if (x !== 0) {
                                util.addClass(this, 'move-out-click');
                            }
                        }
                    }

                    // 恢复初始化状态
                    moveStart = null;
                    moveX = 0;
                });
            }
        }
    };

    return MoveToDelete;
}));