'use strict';
var maxW        = $('body').width() - 1,
    maxH        = $(document).height() - $('#top').height() - 5;

$('#height').val(maxH);
$('#width').val(maxW);

var height      = maxH,
    width       = maxW,
    black       = false,
    white       = true,
    antColor    = 'red',
    up          = new Int8Array([1])[0],
    left        = up << 1,
    bot         = left << 1,
    right       = bot << 1,
    map         = {},
    loop        = 0,
    pos         = {x: null, y: null},
    dir         = up,
    time        = null,
    stackLoop   = 300,
    count       = 0,
    halfW       = Math.ceil(width / 2),
    halfH       = Math.ceil(height / 2),
    toRedraw,
    color;

var pctWhite    = 1,
    pause       = false,
    pxDim       = 1;

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
    l.html(count);
    curHeight.html(height);
    curWidth.html(width);
    curWhite.html(pctWhite);
    curTime.html(time * 100);
};

var showLoader = function(b, cb){
    setTimeout(function(){
        if(b){
            $('#mainFrame').hide(0);
            $('#loader').show(0);
        }else{
            $('#loader').hide(0);
            $('#mainFrame').show(0);
        }
        if(cb){
            setTimeout(function(){ cb(); }, 500);
        }
    },0);
};

var fulfill = function(){
    pause = true;
    halfW = Math.ceil(width / 2);
    halfH = Math.ceil(height / 2);
    showLoader(true, function(){
        for (var x = 0; x < width; x++) {
            map[x] = {};
            for (var y = 0; y < height; y++) {
                var r = Math.floor((Math.random() * 100) + 1);
                map[x][y] = (r <= pctWhite) ? {c: white} : {c: black};
            }
        }
        fr.attr('height', (height * pxDim));
        fr.attr('width', (width * pxDim));
        pos.x = halfW;
        pos.y = halfH;
        dir = up;
        buildCanvas(function(){
            displayVals();
            showLoader(false);
            pause = false;
        });
    });
};


var fill = function(c, x, y){
    ctx.fillStyle = (c == black) ? 'black': 'white';
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

var startTheGame = function(){
    color       = map[pos.x][pos.y].c;
    var x       = pos.x,
    y           = pos.y,
    isWhite     = (color && white),
    dirAd       = (dir << 1),
    dirSub      = (dir >> 1),
    newCol      = (isWhite) ? black : white;
    dir         = (isWhite) ? ((dirAd > right) ? up : dirAd) : ((dirSub >= 1) ? dirSub : right);
    map[x][y].c = newCol;
    toRedraw    = {x: x, y: y, color: newCol};
    pos.x       = (dir == left) ? x - 1 : ((dir == right) ? x + 1 : x);
    pos.y       = (dir == up)   ? y - 1 : ((dir == bot)   ? y + 1 : y);
    reDraw(toRedraw);
    ++loop;
    if(!pause) again();
    return;
};

var again = function(){
    if(!map[pos.x] || !map[pos.x][pos.y]){
        pos.x = halfW;
        pos.y = halfH;
        setTimeout(function(){
            count += stackLoop;
            l.html(count);
            startTheGame();
        },0);
    }
    if(loop == stackLoop){
        loop = 0;
        setTimeout(function(){ //clear queue to not reach maximum call stack size.
            count += stackLoop;
            l.html(count);
            startTheGame();
        },0);
    }else startTheGame();
};


//auto init
$(document).ready(function(){
    $('#timer').val(stackLoop / 100);
    fulfill();
});