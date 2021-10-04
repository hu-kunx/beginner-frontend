var min =(function () {
    var canvas = document.getElementById('can'),
        context = canvas.getContext('2d'),
        btn = document.getElementById('btn'),
        select = document.getElementsByTagName('select')[0],
        option = document.getElementsByTagName('option'),
        oTime = document.getElementById('time'),
        strong = document.getElementsByTagName('strong');
    //存储地雷信息和 标记信息 格子是否打开
    var mineArray = new Array(),
        //存储地雷数目的数组
        NuberArray = new Array(),
        openArray = new Array(),
        markArray = new Array();
    var width = 9,
        height = 9,
        mineNum = 10, //地雷数吗
        lineColor = '#b4b4b4',
        fillColor = '#cecece',
        openNum = 0, //打开的格子数目
        markNum = 0, //标注数目
        bom = 0,    //第一次点击
        ti = 1,  //时间
        timer = null,//计时器
        button = 0,//左右键
        //游戏状态码
        state = 1; // 游戏中  2 游戏失败 3 胜利

    //倒计时
    function time() {
        oTime.innerHTML = ti;
        (function t() {
            if(state ==1){
                ti++;
                setTimeout(function () {
                    oTime.innerHTML = ti;
                    t();
                },1000);
            }else{
                if(ti>0){
                    oTime.innerHTML = ti;
                }
            }
        })();
    }
    //默认为初级 初始化点击事件
    init();
    //初始化游戏
    initGame();
    //初始画布数据
    function initGame() {
        canvas.width = width*30+2;
        canvas.height = height*30+2;
        markNum = mineNum;
        strong[0].innerHTML = markNum;
        //初始化数组
        initArray();
        //生成地雷
        createMine();
        //计算空格
        isMineNub();
        //绘制游戏区
        drawLine();
        //绑定事件
        bindEvent();
        ti = 0;
    }
    //响应游戏难度初始化
    function init() {
        //游戏的进行状态 %3 0重新开始 1开始游戏 2结束游戏
        btn.onclick = function (ev) {
            btn.style.opacity = 0.3;
            btn.style.color = 'red';
            context.clearRect(0,0,canvas.width,canvas.height);
            var value = option[select.selectedIndex].value;
            if(value == '初级难度'){
                width = 9;
                height = 9;
                mineNum = 10;
            }else if(value=='中级难度'){
                width = 16;
                height = 16;
                mineNum = 40;
            }else if(value == '高级难度'){
                width = 30;
                height = 16;
                mineNum = 99;
            }
            openNum = 0; //打开的格子数目
            bom = 0;    //第一次点击
            //游戏状态码
            state = 0;
            initGame();
        }
    }
    //计算判断游戏结束
    function over() {
        if((width)*(height) - openNum   ==  mineNum){
            alert('恭喜');
            state = 3;
            btn.innerHTML='再来一局';
        }
    }
    //游戏失败
    function die() {
        state = 2;//游戏结束状态
        bom = 0;
        showMine();
        setTimeout(function () {
            alert('BOOM');
        },1000/5);
        btn.innerHTML='再来一把';
        btn.style.opacity = 1;
    }
    //绑定事件
    function bindEvent() {
        canvas.onclick = function (ev) {
            bom++;
            if(bom==1){
                state = 1;
                oTime.innerHTML = 0;
                time();
            }
            //判断点击位置是否有效 有效应该返回 索引值
            //游戏状态
            if(state ==2 ){
                alert('游戏已经结束');
            }else if(state==3){
                alert('再来一局?');
            }else if(ifClick(ev)){
                var index = ifClick(ev);
                ifBom(index.x, index.y);
            }
        };
        //右键标记
        canvas.oncontextmenu = function (ev) {
            //取消默认右键菜单行为
            ev.preventDefault();
            //游戏状态
            if(state ==2 ){
                alert('游戏已经结束');
            //判断点击位置是否有效 有效应该返回 索引值
            }else if(state==3){
                alert('再来一局?');
            }else if(ifClick(ev)){
                var index = ifClick(ev);
                //绘制标记
                ifMark(index.x,index.y);
            }
        };
    }
    //如果第一次点到地雷了就初始化
    function oneClick(x,y) {
        //初始化数组
        mineArray = [];
        NuberArray = [];
        for(var i=0; i<height+2;i++){
            mineArray[i] = new Array(width+2);
            NuberArray[i] = new Array(width+2);
        }
        //生成的雷
        createMine();
        //计算数值
        isMineNub();
        //判断位置是不是还是雷
        if(mineArray[y][x] == 1){
            oneClick(x,y);
        }else if(NuberArray[y][x] > 0){
            clearShadow(x,y);
            drawNum(x,y);
        }else {
            find(x,y);
        }
    }
    //响应点击扫雷事件
    function ifBom(x, y) {
        //判断没有放置标注 且格子没有打开
        if(openArray[y][x] != 1 && markArray[y][x] !=1){
            //是不是地雷
            if (mineArray[y][x] == 1){
                //判断是否第一次点击
                if(bom == 1){
                    var x =x,y=y;
                    //第一次触雷 重新 布雷
                    oneClick(x,y)
                    console.log('该重新布局呢');
                } else{
                    //失败
                    die();
                }
            //数字大于 0 没有标记 没有打开
            }else if(NuberArray[y][x] != 0){
                clearShadow(x,y);
                drawNum(x,y);
                openArray[y][x] = 1;
                openNum++;
                over();
            //点击的周围没有地雷 没有标记 没有打开
            }else if(NuberArray[y][x] == 0){
                find(x, y);
            }
        }
    }
    //计算是否有效点击  返回 x y 索引
    function ifClick(e) {
        var offY = e.offsetY,
            offX = e.offsetX;
        //是否点击在游戏里
        if(offX < 30*width && offY < 30*height){
            //限制一个区域 不能点击在边框上
            var borX = offX/3%10,
                borY = offY/3%10;
            //是否点击的边框上 <0.75  >9.25 都是离边框很近
            if(borX < 9.25 && borX > 0.25 && borY < 9.25 && borY > 0.25){
                //返回 相对于数组的索引
                //加一让棋盘
                return {
                    x : ~~(offX/30)+1,
                    y : ~~(offY/30)+1
                }
            }
        }
    }
    //初始化数组
    function initArray() {
        for(var i=0; i<height+2; i++){
            mineArray[i] = new Array(width+2);
            NuberArray[i] = new Array(width+2);
            openArray[i] = new Array(width+2);
            markArray[i] = new Array(width+2);
        }
    }
    //随机布雷
    function createMine() {
        var i,x,y;
        for(i=0; i<mineNum; i++){
            while (true){
                //随机生成 1~9 的数字  因为 我在地雷盘外加了一圈所以 0 和最外不能有地雷
                x = ~~(Math.random()*width)+1;
                y = ~~(Math.random()*height)+1;
                if(mineArray[y][x]!= 1){
                    mineArray[y][x] = 1;
                    break;
                }
            }
        }
    }
    //计算地雷数目数组
    function isMineNub() {
        var h,w;
        for (h=0; h<height+2; h++){
            for(w=0; w<width+2; w++){
                NuberArray[h][w] = 0;
                //初始绘制阴影
                drawShadow(w,h);
                var num = 0;
                if(w > 0 && h > 0 && w < width+1 && h < height+1){
                    //左
                    if (mineArray[h][w-1] == 1)num++;
                    //右
                    if (mineArray[h][w+1] == 1)num++;
                    //上
                    if (mineArray[h-1][w] == 1)num++;
                    //下
                    if (mineArray[h+1][w] == 1)num++;
                    //左上
                    if (mineArray[h-1][w-1] == 1)num++;
                    //右上
                    if (mineArray[h-1][w+1] == 1)num++;
                    //左下
                    if (mineArray[h+1][w-1] == 1)num++;
                    //右下
                    if (mineArray[h+1][w+1] == 1)num++;
                    //给数组填充周围地雷数目
                    NuberArray[h][w] = num;
                }
            }
        }
    }
    //画线条
    function drawLine() {
        //绘制竖线
        for (var h=0; h<width+1; h++){
            context.beginPath();
            context.moveTo(30*h+1.5,1.5);
            context.lineTo(30*h+1.5,30*height+1.5);
            context.strokeStyle = lineColor;
            context.stroke();
        }
        //绘制横线
        for(var w=0; w<height+1; w++){
            context.beginPath();
            context.moveTo(1.5,30*w+1.5);
            context.lineTo(30*width+1.5,30*w+1.5);
            context.strokeStyle = lineColor;
            context.stroke();
        }
    }
    //绘制数字
    function drawNum(x, y) {
        //判断数字值 给定相应的颜色
        var color = 'black';
        //获取数字
        var num = NuberArray[y][x];
        //判断
        switch (num){
            case 1 :
                color = 'blue';
                break;
            case 2 :
                color = 'green';
                break;
            case 3 :
                color = 'red';
                break;
            case 4 :
                color = 'Purple';
                break;
            case 5 :
                color = '#F5FFFA';
                break;
            case 6 :
                color = '#808000';
                break;
        }
        context.fillStyle = color;
        context.font="24px Arial";
        //因为开始为了计算将地图索引转换为数组索引了+1 所以绘图要-1 转回去
        x--;y--;
        context.fillText(num, 9.5 + x * 30, 26.5 + y * 30);
    }
    //绘制阴影
    function drawShadow(x, y) {
        context.fillStyle = fillColor;
        //因为开始为了计算将地图索引转换为数组索引了+1 所以绘图要-1 转回去
        x--;y--;
        context.fillRect(3.5 + x * 30, 3.5 + y * 30, 26, 26);
    }
    //清除阴影
    function clearShadow(x, y) {
        // context.fillStyle = '#fff';
        //因为开始为了计算将地图索引转换为数组索引了+1 所以绘图要-1 转回去
        x--;y--;
        // context.fillRect(3.5 + x * 30, 3.5 + y * 30, 26, 26);
        context.clearRect( 3.5 + x * 30, 3.5 + y * 30, 26, 26);
    }
    //绘制地雷
    function drawMine(x, y) {
        context.fillStyle = 'black';
        context.font="60px Arial";
        //因为开始为了计算将地图索引转换为数组索引了+1 所以绘图要-1 转回去
        x--;y--;
        context.fillText('*', 5.5 + x * 30, 51.5 + y * 30);
    }
    //绘制标记
    function drawMark(x, y) {
        context.fillStyle = 'red';
        context.font="25px Arial";
        //因为开始为了计算将地图索引转换为数组索引了+1 所以绘图要-1 转回去
        x--;y--;
        context.fillText('!', 13.5+ x * 30, 25 + y * 30);
    }
    //响应右键事件
    function ifMark(x, y) {
        //判断标记是否用完 用完不能再次标记
        if(markNum != 0){
            //判断是否已经插旗子 插了就去掉
            if(markArray[y][x] != 1 && openArray[y][x] != 1){
                //绘制旗子
                drawMark(x,y);
                //给数组对应位置添加已经插旗标注
                markArray[y][x] = 1;
                //已经插旗数目加1
                markNum--;
                strong[0].innerHTML = markNum;

            //判断是否有旗子 有旗子就去掉
            }else if(markArray[y][x] == 1){
                //重绘阴影覆盖旗子
                drawShadow(x,y);
                //数组去掉插旗
                markArray[y][x] = 0;
                //已经插旗数减1
                markNum++;
                strong[0].innerHTML = markNum;
            }
        }
    }
    //爆炸将所有地雷显示出来
    function showMine() {
        var i,y;
        for(i=1; i<height+1; i++){
            for(y=1; y<width+1; y++){
                if(mineArray[i][y] == 1){
                    //遍历清除所有阴影
                    clearShadow(y,i);
                    //绘制地雷
                    drawMine(y,i);
                    //判断地雷有没有被标记 有就画一个标记覆盖
                    if(markArray[i][y] == 1){
                        drawMark(y,i);
                    }
                }
            }
        }
    }
    //递归清除格子
    function find(x,y){
        if(x > 0 && y > 0 && x < width+1 && y < height+1 && markArray[y][x] != 1 && openArray[y][x] != 1){
            //判断是否 所在位置周围没有地雷
            if(NuberArray[y][x] == 0){
                clearShadow(x,y);
                openArray[y][x] = 1;
                openNum++
                //递归开始
                find(x+1,y);
                find(x-1,y);
                find(x,y+1);
                find(x,y-1);

                if(openArray[y-1][x-1] != 1 && markArray[y-1][x-1] != 1){
                    clearShadow(x-1,y-1);
                    if(NuberArray[y-1][x-1] ==0){
                        find(x-1,y-1);
                    }else {
                        drawNum(x-1,y-1);
                        openArray[y-1][x-1] = 1;
                        openNum++
                        over();
                    }
                }
                if(openArray[y-1][x+1] != 1 && markArray[y-1][x+1] != 1){
                    clearShadow(x+1,y-1);
                    if(NuberArray[y-1][x+1] ==0){
                        find(x+1,y-1);
                    }else {
                        drawNum(x+1,y-1);
                        openArray[y-1][x+1] = 1;
                        openNum++
                        over();
                    }
                }
                if(openArray[y+1][x-1] != 1 && markArray[y+1][x-1] != 1){
                    clearShadow(x-1,y+1);
                    if(NuberArray[y+1][x-1] ==0){
                        find(x-1,y+1);
                    }else{
                        drawNum(x-1,y+1);
                        openArray[y+1][x-1] = 1;
                        openNum++
                        over();
                    }
                }
                if(openArray[y+1][x+1] != 1 && markArray[y+1][x+1] != 1){
                    clearShadow(x+1,y+1);
                    if(NuberArray[y+1][x+1] ==0){
                        find(x+1,y+1);
                    }else {
                        drawNum(x+1,y+1);
                        openArray[y+1][x+1] = 1;
                        openNum++
                        over();
                    }
                }
            }else if(NuberArray[y][x] != 0){
                clearShadow(x,y);
                drawNum(x,y);
                openArray[y][x] = 1;
                openNum++
                over();
            }
        }
    }
})();
