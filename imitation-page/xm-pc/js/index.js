/**
 * Created by hukun on 2018/2/21.class index {}
 */

function g(s,cont) {
    cont = cont || document;
    return cont.querySelectorAll(s);
}

//轮播图
!function () {
    var oBox = g('.m-wheel .container')[0],
        aImg = g('.banner-pic img',oBox),
        oPrev = g('.prev-btn',oBox)[0],
        oNext = g('.next-btn',oBox)[0],
        aItm = g('.btn-list span',oBox),
        index = 0,
        timer,
        len = aImg.length,
        zIndex=100;


    [].forEach.call(aItm,function (val, index) {
        val.mark = index;
    });



    function mover(num) {
        zIndex++;
        num = num%len;

        aImg[num].style.opacity = 0;
        aImg[num].style.filter = 'Alpha(opacity=0)';


        if(num >= len-1 ){
            num = -1;
        }

        for(var i =0; i<len; i++){
            if(i === num+1){
                aItm[i].classList.add('on');
            }else {
                aItm[i].classList.remove('on');
            }
        }
        aImg[num+1].style.zIndex = zIndex;
        aImg[num+1].style.opacity = 1;
        aImg[num+1].style.filter = 'Alpha(opacity=100)';

    }
    oBox.onmouseover = function (ev) {
        clearInterval(timer);
    };
    oBox.onmouseout = function (ev) {
        animation();
    };

    oBox.onclick = function (ev) {
        var target = ev.target || window.event.target;
        if(target === oPrev){
            index--;
            if(index < 0){
                index = len-1;
            }
            mover(index);
        }else if(target === oNext){
            index++;
            mover(index)
        }else if(target.className.indexOf('itm') !== -1 ){
            var n = target.mark;
            if(n === 0){
                n=len;
            }
            mover(n-1);
        }
    };
    function animation() {
        timer = setInterval(function () {
            mover(index);
            index++;

        },3000);
    }
    animation();
}();
//商品切换 轮播
!function () {
    var oOne = g('.one')[0],
        oPre = g('.prev-btn',oOne)[0],
        oNex = g('.next-btn',oOne)[0],
        oBox = g('.banner',oOne)[0],
        tim;

    oPre.onclick = function () {
        if(this.className.indexOf('on') === -1){
            oBox.style.marginLeft = 0;
            oNex.classList.remove('on');
            this.classList.add('on');
        }
    };
    oNex.onclick = function () {
        if(this.className.indexOf('on') === -1){
            oBox.style.marginLeft = -oBox.offsetWidth+'px';
            oPre.classList.remove('on');
            this.classList.add('on');
        }
    };
    function annimation() {
        tim = setInterval(function () {
            if(oPre.className.indexOf('on') === -1){
                oBox.style.marginLeft = 0;
                oNex.classList.remove('on');
                oPre.classList.add('on');
            }else {
                oBox.style.marginLeft = -oBox.offsetWidth+'px';
                oPre.classList.remove('on');
                oNex.classList.add('on');
            }
        },5000);
    }
    annimation();
    oBox.onmouseover = function () {
        clearTimeout(tim);
    };
    oBox.onmouseout = function () {
        annimation();
    };
}();