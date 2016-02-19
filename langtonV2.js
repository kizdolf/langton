var height = 800,
    width = 1500,
    black = 'black',
    white = 'white',
    antColor = 'red',
    map = {},
    up = 1, left = 2, bot = 3, right = 4,
    loop = 0,
    pos = {x: null, y: null},
    dir = up,
    time = null,
    stackLoop = 3000;

var pctWhite = 100,
    pxDim = 1;

var toRedraw, color;

var c = document.getElementById('mainFrame'),
    fr = $('#mainFrame'),
    ctx = c.getContext('2d');

$('#fulfill').click(function(){fulfill();});
$('#timer').change(function(){
    time=$(this).val();
    stackLoop = parseInt(time) * 100;
    displayVals();
});
// $('#placeAnt').click(function(){placeAnt();});
$('#start').click(function(){startTheGame();});
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
var l = $('#loop');
var displayVals = function(){
    l.html(loop);
    $('#curHeight').html(height);
    $('#curWidth').html(width);
    $('#curWhite').html(pctWhite);
    $('#curTime').html(time);
};

var fulfill = function(){
    for (var x = 0; x < width; x++) {
        map[x] = {};
        for (var y = 0; y < height; y++) {
            var r = Math.floor((Math.random() * 100) + 1);
            map[x][y] = (r <= pctWhite) ? {c: white} : {c: black};
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


var fill = function(x, y){ctx.fillRect(x, y, pxDim, pxDim); };

var buildCanvas = function(cb){
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var color = map[x][y].c;
            ctx.fillStyle = color;
            fill((x*pxDim), (y*pxDim));
        }
    }
    placeAnt();
    if(cb) cb();
};

var placeAnt = function(){
    ctx.fillStyle = antColor;
    fill((pos.x*pxDim), (pos.y*pxDim));
};

var reDraw = function(r){
    ctx.fillStyle = antColor;
    fill((pos.x*pxDim), (pos.y*pxDim));
    ctx.fillStyle = r.color;
    fill((r.x*pxDim), (r.y*pxDim));
};

//futur? build when the ant goes too far.
var buildMore = function(){
    pos.x = (pos.x <= 0) ? 0 : pos.x;
    pos.y = (pos.y <= 0) ? 0 : pos.y;
    pos.x = (pos.x >= height) ? height - 1 : pos.x;
    pos.y = (pos.y >= width) ? width - 1 : pos.y;
};

//to do in binary operations. :)
var startTheGame = function(){
    color = map[pos.x][pos.y].c;
    var isWhite = (color == white), dirAd = (dir + 1), dirSub = (dir - 1), x = pos.x, y = pos.y;
    dir = (isWhite) ? ((dirAd > 4) ? 1 : dirAd) : ((dirSub >= 1) ? dirSub : 4)
    map[x][y].c = (isWhite) ? black : white;
    toRedraw = {x: x, y: y, color: (isWhite) ? black : white};
    pos.x = (dir == left) ? x - 1 : ((dir == right) ? x + 1 : x);
    pos.y = (dir == up) ? y - 1 : ((dir == bot) ? y + 1 : y);
    reDraw(toRedraw);
    ++loop;
    again();
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
