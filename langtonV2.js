var height =  200,
    width = 200,
    black = 'black',
    white = 'white',
    antColor = 'red',
    map = {},
    pos = {x: null, y: null};

var pctWhite = 70,
    squareSize = 4;

var c = document.getElementById('mainFrame'),
    fr = $('#mainFrame'),
    ctx = c.getContext('2d');

$('#fulfill').click(function(){fulfill();});
// $('#timer').change(function(){time=$(this).val();});
$('#placeAnt').click(function(){placeAnt();});

$('#start').click(function(){startTheGame();});

$('#zoom').change(function(){
    var val = $(this).val();
    console.log(val);
    squareSize=val;
});



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
    buildCanvas();
};

var buildCanvas = function(){

    fr.attr('height', (height * squareSize));
    fr.attr('width', (width * squareSize));
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var color = map[x][y].c;
            ctx.fillStyle = color;
            ctx.fillRect((x*squareSize), (y*squareSize), squareSize, squareSize);
        }
    }
};

var placeAnt = function(){
    pos.x = Math.ceil(width / 2);
    pos.y = Math.ceil(height / 2);
    console.log(pos);
    ctx.fillStyle = antColor;
    ctx.fillRect((pos.x*squareSize), (pos.y*squareSize), squareSize, squareSize);
};
