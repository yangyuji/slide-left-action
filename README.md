# slide left action

基于原生js实现的左滑显示操作按钮的小插件

## use like this
```javascript
slideLeftAction.init({
    container: '.quan-media-box',
    moveCount: 120, // 和按钮的宽度总和相等
    buttons: [{
        text: '删除',
        class: 'item_btn_del',
        click: function (e) {
            console.log('click删除');
            e.target.parentNode.remove();
        }
    },{
        text: '取消',
        class: 'item_btn_cancel',
        click: function (e) {
            console.log('click取消');
            e.target.parentNode.classList.remove('move-out-click');
            e.target.parentNode.style.webkitTransitionDuration = '125ms';
            e.target.parentNode.style.transitionDuration = '125ms';
            e.target.parentNode.style.webkitTransform = 'translateX(0px)';
            e.target.parentNode.style.transform = 'translateX(0px)';
        }
    }]
});
```

## preview
> * [click here](https://yangyuji.github.io/slide-left-action/demo.html)
> * ![qrcode](https://github.com/yangyuji/slide-left-action/blob/master/qrcode.png)
