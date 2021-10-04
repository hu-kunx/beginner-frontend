var blue = (function () {
    var oBox = document.getElementsByClassName('board')[0],
        //显示当前级别点击次数
        aEm = document.getElementsByTagName('em'),
        //三个按钮
        aBtn = document.getElementsByTagName('input'),
        //点击次数
        click = 0,
        //累计到本回合开始的点击次数
        clickN = parseInt(getCookie('clickN')) || 0,
        //当前等级 和 横排方块数目
        parent = parseInt(getCookie('parent')) || 1;
    //初始化  生成方块
    function init() {
        oBox.innerHTML = '';
        if(parent>6 && parent<=14){
            oBox.classList.add('bone');
        }else if (parent>14){
            oBox.classList.add('btwo');
        }
        oBox.style.width = ~~(600/parent)*parent+'px';
        oBox.style.height = ~~(600/parent)*parent+'px';
        for (var i = 0; i<parent; i++){
            var oDiv = document.createElement('div');
            for(var y = 0; y<parent; y++){
                var son = document.createElement('div');
                if(parent>6 && parent<=14){
                    son.classList.add('one');
                }else if(parent>14){
                    son.classList.add('two');
                }
                son.style.height = ~~(600/parent)+'px';
                son.style.width = ~~(600/parent)+'px';
                //用于验证点击是否为方块
                son.blue = true;
                //添加索引
                son.index = y;
                oDiv.appendChild(son);
            }
            oBox.appendChild(oDiv);
        }
    }
    init();
    //检测是否过关
    function ifchenk() {
        var aBox = oBox.getElementsByClassName('blue');
        aEm[1].innerHTML = click;
        aEm[2].innerHTML = clickN+click;
        setTimeout(function () {
            //判断拥有 class 的方块是不是 符合
            if(aBox.length == parent*parent){
                if(parent < 20){
                    alert('恭喜过关');
                    parent++;
                    clickN+=click;
                    setCookie('parent',parent,300);
                    setCookie('clickN',clickN,300);
                    click = 0;
                    init();
                    aEm[1].innerHTML = 0;
                    aEm[0].innerHTML = parent;
                }else{
                    alert('恭喜,您已经通关!');
                }
            }
        },1000/5);
    }
    function setCookie(name,value,iDay){
        var oDate = new Date();
        oDate.setDate(oDate.getDate()+iDay);
        if(iDay){
            document.cookie = name+'='+value+';expires='+oDate;
        }
        else{
            document.cookie = name+'='+value;
        }
    }
    setCookie('parent',parent,300);
    setCookie('clickN',clickN,300);
    function getCookie(name){
        var cookie = document.cookie.split('; ');
        for(var i=0;i<cookie.length;i++){
            var arr = cookie[i].split('=');
            if(arr[0] === name){
                return arr[1];
            }
        }
        return '';
    }
    function reCookie(name) {
        setCookie(name,'iii',-1);
    }
    return {
        event : function () {
            aEm[0].innerHTML = parseInt(getCookie('parent'));
            aEm[2].innerHTML = parseInt(getCookie('clickN'));
            init();
            oBox.onclick = function (e) {
                console.log(document.cookie);
                var e = e || window.event;
                if (e.target.blue) {
                    var target = e.target,
                        index = target.index,
                        par = target.parentNode,
                        top = par.previousElementSibling,
                        bon = par.nextElementSibling,
                        left = target.previousElementSibling,
                        right = target.nextElementSibling;
                    target.classList.toggle('blue');
                    left && left.classList.toggle('blue');
                    right && right.classList.toggle('blue');
                    if (top) {
                        var topSon = top.getElementsByTagName('div');
                        topSon[index].classList.toggle('blue');
                    }
                    if (bon) {
                        var bonSon = bon.getElementsByTagName('div');
                        bonSon[index].classList.toggle('blue');
                    }
                    click++;
                    ifchenk();
                }
            };
            aBtn[0].onclick = function (e) {
                parent = 1;
                reCookie('parent');
                init();
                aEm[0].innerHTML = 1;
                aEm[1].innerHTML = 0;
                aEm[2].innerHTML = 0;
                click = 0;
                clickN = 0;
            };
            aBtn[1].onclick = function (e) {
                init();
                click = 0;
                aEm[1].innerHTML = 0;
                aEm[2].innerHTML = clickN;
            };
        }
    }
})();
blue.event();