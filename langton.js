$(document).ready(function(){
var c = document.getElementById('mainFrame'),
    fr = $('#mainFrame'),
    ctx = c.getContext('2d'),
    size = {height: fr.attr('height'), width: fr.attr('width')},
    pos = {x: null, y: null},
    oldPos = {x: null, y: null},
    underColor = null,
    direction = 0,
    time = 0,
    drawSize = 2,
    loop = 0,
    pctWhite = 20,
    innerDir = $('#current');

$('#fulfill').click(function(){fulfill();});
$('#placeAnt').click(function(){placeAnt();});
$('#start').click(function(){startTheGame();});
$('#timer').change(function(){time=$(this).val();});


var fulfill = function(){
    var color;
    for (var i = 0; i < size.width; i += drawSize) {
        for (var j = 0; j < size.height; j += drawSize) {
            var r = Math.floor((Math.random() * 100) + 1);
            if(r <= pctWhite){
                color = 'white';
            }else{
                color = 'black';
            }
            ctx.fillStyle = color;
            ctx.fillRect(i, j, drawSize, drawSize);
        }
    }
};

var placeAnt = function(){
    pos.x = Math.ceil((size.width / 2) / drawSize) * drawSize;
    pos.y = Math.ceil((size.height / 2) / drawSize) * drawSize;
    getColor(function(color){
        underColor = color;
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, drawSize, drawSize);
    });
};

var getColor = function(cb){
    var p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
    cb((p[0] > 150) ? 'white' : 'black');
};

var moveLeft = function(cb){
    if(direction === 0){
        direction = 1;
    }else if (direction == 1){
        direction = 2;
    }else if (direction == 2){
        direction = 3;
    }else{
        direction = 0;
    }
    moveAnt(function(){
        cb();
    });
};

var moveRight = function(cb){
    if(direction === 0){
        direction = 3;
    }else if (direction == 1){
        direction = 0;
    }else if (direction == 2){
        direction = 1;
    }else{
        direction = 2;
    }
    moveAnt(function(){
        cb();
    });
};

var moveAnt = function(cb){
    oldPos.x = pos.x;
    oldPos.y = pos.y;
    switch (direction) {
        case 0:
            pos.y -= drawSize;
            break;
        case 2:
            pos.y += drawSize;
            break;
        case 1:
            pos.x -= drawSize;
            break;
        case 3:
            pos.x += drawSize;
            break;
    }
    cb();
};

var draw = function(cb){
    var color = (underColor == 'black') ? 'white' : 'black';
    ctx.fillStyle = color;
    ctx.fillRect(oldPos.x, oldPos.y, drawSize, drawSize);
    getColor(function(color){
        underColor = color;
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, drawSize, drawSize);
        cb();
    });
};

var moveDir = function(cb){
    if(underColor == 'white'){
        moveLeft(function(){
            cb();
        });
    }else{
        moveRight(function(){
            cb();
        });
    }
};

var startTheGame = function(){
    loop++;
    innerDir.html(loop);
    moveDir(function(){
        draw(function(){
            // setTimeout(function(){
                startTheGame();
            // }, time);
        });
    });
};

});
