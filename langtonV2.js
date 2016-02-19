'use strict';

var height      = 800,
    width       = 1500,
    black       = 'black',
    white       = 'white',
    antColor    = 'red',
    up          = 1,
    left        = 2,
    bot         = 3,
    right       = 4,
    map         = {},
    loop        = 0,
    pos         = {x: null, y: null},
    dir         = up,
    time        = null,
    stackLoop   = 300;

var pctWhite    = 100,
    pause       = false,
    pxDim       = 1;

var toRedraw, color;

var c           = document.getElementById('mainFrame'),
    fr          = $('#mainFrame'),
    ctx         = c.getContext('2d'),
    l           = $('#loop'),
    curHeight   = $('#curHeight'),
    curWidth    = $('#curWidth'),
    curWhite    = $('#curWhite'),
    curTime     = $('#curTime');

$('#fulfill').click(function(){fulfill();});
$('#timer').change(function(){
    time=$(this).val();
    stackLoop = parseInt(time) * 100;
    displayVals();
});
// $('#placeAnt').click(function(){placeAnt();});
$('#start').click(function(){
    pause = false;
    startTheGame();
});

$('#stop').click(function(){
    pause = true;
});

$('#zoom').change(function(){
    fr.attr('height', (height * pxDim));
    fr.attr('width', (width * pxDim));
    pxDim = $(this).val();
    displayVals();
});
$('#height').change(function(){
    height = $(this).val();
    displayVals();
    fulfill();
});
$('#width').change(function(){
    width = $(this).val();
    displayVals();
    fulfill();
});
$('#pctWhite').change(function(){
    pctWhite = $(this).val();
    displayVals();
    fulfill();
});

var displayVals = function(){
    l.html(loop);
    curHeight.html(height);
    curWidth.html(width);
    curWhite.html(pctWhite);
    curTime.html(time * 100);
};

var fulfill = function(){
    for (var x = 0; x < width; x++) {
        map[x] = {};
        for (var y = 0; y < height; y++) {
            var r = Math.floor((Math.random() * 100) + 1);
            map[x][y] = (r <= pctWhite) ? {c: 'white'} : {c: 'black'};
        }
    }
    fr.attr('height', (height * pxDim));
    fr.attr('width', (width * pxDim));
    pos.x = Math.ceil(width / 2);
    pos.y = Math.ceil(height / 2);
    dir = up;
    buildCanvas();
    displayVals();
};


var fill = function(c, x, y){
    ctx.fillStyle = c;
    ctx.fillRect((x * pxDim), (y * pxDim), pxDim, pxDim);
};

var buildCanvas = function(cb){
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++)
            fill((map[x][y].c), x, y);
    }
    placeAnt();
    if(cb) cb();
};

var placeAnt = function(){ fill(antColor, pos.x, pos.y); };

/*
    Call loop:
  →→startTheGame ->
  ↑     determine new direction and color.
  ↑     reDraw ->
  ↑         fill -> draw one pixel
  ↑         fill -> draw one pixel
  ↑     again ->
  ↑         if(border reached or callStackMax) ->
  ↑             handle ant position.
  ↑             empty Stack through setTimeout({},0)
  ↑             display loop count
  ↑←←←←←←←←←←←←←startTheGame
  ↑         else
  ←←←←←←←←←←←←←←startTheGame

*/

var reDraw = function(r){
    fill(antColor, pos.x, pos.y);
    fill(r.color, r.x, r.y);
};

//to do in binary operations. :)
var startTheGame = function(){
    color       = map[pos.x][pos.y].c;
    var x       = pos.x,
    y           = pos.y,
    isWhite     = (color == white),
    dirAd       = (dir + 1),
    dirSub      = (dir - 1),
    newCol      = (isWhite) ? black : white;
    dir         = (isWhite) ? ((dirAd > right) ? up : dirAd) : ((dirSub >= 1) ? dirSub : right)
    map[x][y].c = newCol;
    toRedraw    = {x: x, y: y, color: newCol};
    pos.x       = (dir == left) ? x - 1 : ((dir == right) ? x + 1 : x);
    pos.y       = (dir == up)   ? y - 1 : ((dir == bot)   ? y + 1 : y);
    reDraw(toRedraw);
    ++loop;
    if(!pause) again();
    return;
};


var halfW = Math.ceil(width / 2), halfH = Math.ceil(height / 2);
var count = 0;
var again = function(){
    if(!map[pos.x] || !map[pos.x][pos.y]){
        pos.x = halfW;
        pos.y = halfH;
        setTimeout(function(){
            l.html(loop);
            startTheGame();
        },0);
    }
    if((loop % stackLoop) === 0){
        loop = 0;
        //clear queue to not reach maximum call stack size.
        setTimeout(function(){
            count += stackLoop;
            l.html(count);
            startTheGame();
            halfW = Math.ceil(width / 2); halfH = Math.ceil(height / 2);
        },0);
    }else{
        startTheGame();
    }
};
