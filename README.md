# slide left action

基于原生js实现的左滑显示操作按钮的小插件

## use like this
```javascript
var sla = new slideLeftAction({
    container: '.quan-media-box',
    moveCount: 120, //和按钮的宽度总和相等
    buttons: [{
        text: '删除',
        class: 'item_btn_del',
        click: function (e) {
            var el = e.target.parentNode;
            console.log('click删除', el);
            el.remove();
        }
    },{
        text: '取消',
        class: 'item_btn_cancel',
        click: function (e) {
            var el = e.target.parentNode;
            console.log('click取消', el);
            el.classList.remove('move-out-click');
            sla._transform(el, 'transitionDuration', '125ms');
            sla._transform(el, 'transform', 'translateX(0px)');
        }
    }]
});
```

## preview
> * [click here](https://yangyuji.github.io/slide-left-action/demo.html)
> * ![qrcode](https://github.com/yangyuji/slide-left-action/blob/master/qrcode.png)
