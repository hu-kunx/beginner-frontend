/**
 * Created by hukun on 2018/2/22.class index {}
 */

topBar();
banner();
downTime();

//搜索栏
function topBar() {
    var oBox = getEl('.topbar')[0],
        oBannerH = getEl('.banner')[0].clientHeight;
    window.addEventListener('scroll',function (ev) {
        var scrolltop = document.documentElement.scrollTop;
        oBox.style.backgroundColor = 'rgba(242, 48, 48,'+scrolltop/(oBannerH-oBox.offsetHeight)+')';
    },false);

}

//banner
function banner() {
    var index = 1,
        oBanner = getEl('.banner')[0], //最外的盒子
        oBox = getEl('.banner-pic',oBanner)[0], //图片 box
        aImg = getEl('img',oBox), // img
        aItmList = getEl('.btn-itm', oBanner), //span 小点
        len = aImg.length,
        width = aImg[0].offsetWidth,
        timer = null,
        speed = 3000, //时间间隔
        moveStartX = 0; //触摸开始
    //初始位置
    oBox.style.width = width*len+'px';
    oBox.style.left = -width+'px';

    //过度结束
    oBox.addEventListener('transitionend',function () {
        if(index >= len-1){
            index = 1;
            remTransition();
            oBox.style.left = -index*width+'px';
        }
        //滑动
        if(index <= 0){
            index = len-2;
            remTransition();
            oBox.style.left = -index*width+'px';
        }
        aItemBtnAdd();
    });

    //触摸开始
    oBox.addEventListener('touchstart',function (e) {
        clearTimeout(timer);
        moveStartX = e.touches[0].clientX;
    },false);

    //触摸移动
    oBox.addEventListener('touchmove',function (e) {
        var moveX = ~~(moveStartX - e.touches[0].clientX);
        //大于0 向右
        //小于0 向左
        remTransition();
        oBox.style.left = -index*width-moveX+'px';
    },false);

    //触摸结束
    oBox.addEventListener('touchend',function (e) {
        var moveEndX = moveStartX - e.changedTouches[0].clientX;

        if(Math.abs(moveEndX) >= width/3){
          if(moveEndX > 0){
              index++;
          }else{
              index--;
          }
          mover();
        }else {
            mover()
        }
        animation();
    },false);

    //定时
    function animation() {
        timer = setInterval(function () {
            index++;
            mover(-index * width);
        },speed);
    }
    animation();

    //删除过度
    function remTransition() {
        oBox.style.transition = 'all 0s';
    }

    //添加过度
    function addTransition() {
        oBox.style.transition = 'all .5s';
    }

    //单次动画
    function mover() {
        addTransition();
        oBox.style.left = -index*width+'px';
    }

    //更改下方小白点
    function aItemBtnAdd() {
        [].forEach.call(aItmList,function (val,i) {
            if(i === index-1){
                val.classList.add('on');
            }else {
                val.classList.remove('on');
            }
        });
    }
}

function downTime() {
    var oTimeBox = getEl('.js-time')[0],
        oHour = getEl('.time-hour',oTimeBox)[0],
        oMinute = getEl('.time-minute',oTimeBox)[0],
        oSecond = getEl('.time-second',oTimeBox)[0],
        timer = null;

    var time = 60*60*2;

    timer = setInterval(function () {
        time--;
        oHour.innerHTML = Math.floor(time/3600);
        oMinute.innerHTML = Math.floor(time%3600/60) ;
        oSecond.innerHTML = time%60;
    },1000);

}


//选择器
function getEl(str, context) {
    context = context || document;
    return context.querySelectorAll(str);
}













