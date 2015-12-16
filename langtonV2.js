var height = 800,
    width = 1500,
    black = 'black',
    white = 'white',
    antColor = 'red',
    map = {},
    up = 1, left = 2, bot = 3, right = 4,
    loop = 0,
    pos = {x: null, y: null},
    direction = up,
    time = null,
    stackLoop = 3000;

var pctWhite = 100,
    squareSize = 1;

var toRedraw, color;

var c = document.getElementById('mainFrame'),
    fr = $('#mainFrame'),
    ctx = c.getContext('2d');

$('#fulfill').click(function(){fulfill();});
$('#timer').change(function(){
    time=$(this).val();
    displayVals();
});
// $('#placeAnt').click(function(){placeAnt();});
$('#start').click(function(){startTheGame();});
$('#zoom').change(function(){
    fr.attr('height', (height * squareSize));
    fr.attr('width', (width * squareSize));
    squareSize = $(this).val();
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
            if(r <= pctWhite){
                map[x][y] = {c: white};
            }else{
                map[x][y] = {c: black};
            }
        }
    }
    fr.attr('height', (height * squareSize));
    fr.attr('width', (width * squareSize));
    pos.x = Math.ceil(width / 2);
    pos.y = Math.ceil(height / 2);
    direction = up;
    buildCanvas();
    displayVals();
};

var buildCanvas = function(cb){
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var color = map[x][y].c;
            ctx.fillStyle = color;
            ctx.fillRect((x*squareSize), (y*squareSize), squareSize, squareSize);
        }
    }
    placeAnt();
    if(cb){
        cb();
    }
};

var placeAnt = function(){
    ctx.fillStyle = antColor;
    ctx.fillRect((pos.x*squareSize), (pos.y*squareSize), squareSize, squareSize);
};

var reDraw = function(r){
    ctx.fillStyle = antColor;
    ctx.fillRect((pos.x*squareSize), (pos.y*squareSize), squareSize, squareSize);
    ctx.fillStyle = r.color;
    ctx.fillRect((r.x*squareSize), (r.y*squareSize), squareSize, squareSize);
};

var buildMore = function(){
    if(pos.x <= 0) pos.x = 0;
    if(pos.y <= 0) pos.y = 0;
    if(pos.x >= height) pos.x = height - 1;
    if(pos.y >= width) pos.y = width - 1;
};

var startTheGame = function(){
    color = map[pos.x][pos.y].c;
    if(color == white) direction = ((direction + 1) > 4) ? 1 : (direction + 1);
    else direction = ((direction - 1) >= 1) ? (direction - 1) : 4;
    map[pos.x][pos.y].c = (color == white) ? black : white;
    toRedraw = {x: pos.x, y: pos.y, color: (color == white) ? black : white};
    if(direction == up) pos.y = pos.y - 1;
    else if (direction == left) pos.x = pos.x - 1;
    else if (direction == bot) pos.y = pos.y + 1;
    else pos.x = pos.x + 1;
    reDraw(toRedraw);
    ++loop;
    again();
    return;
};

var again = function(){
    if(!map[pos.x] || !map[pos.x][pos.y]){
        console.log('reposition');
        pos.x = Math.ceil(width / 2);
        pos.y = Math.ceil(height / 2);
        setTimeout(function(){
            l.html(loop);
            startTheGame();
        },0);
    }
    if((loop % stackLoop) === 0){
        //clear queue to not reach maximum call stack size.
        setTimeout(function(){
            l.html(loop);
            startTheGame();
        },0);
    }else{
        startTheGame();
    }
};
