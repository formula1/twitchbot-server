var NetworkHost = require("../abstract/network/NetworkHost");
var Tree = require("./phytree");
var notifier = new NetworkHost();

var running = false;
var canvas = document.getElementById("thecanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.globalAlpha = 1;
var r = canvas.width/2;


notifier.add("follower",newFollower)

newFollower();

function newFollower(who){
  running = true;
  var obj = new Tree(canvas,getTreeColors(),r);
  rnfn = obj.draw.bind(obj);
  var drawI = setInterval(function(){
    try{
      obj.draw();
    }catch(e){
      clearInterval(drawI);
      obj= document.createElement("img");
      obj.src = canvas.toDataURL();
      drawI = setInterval(function(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.globalAlpha -= 0.01;
        if(ctx.globalAlpha <= 0.01){
          canvas.width = canvas.width;
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.globalAlpha = 1;
          clearInterval(drawI);
          running = false;
          console.log("done");
          return;
        }
        ctx.drawImage(obj,0,0);
      },1)
    }
  },1);
}



function getTreeColors(){
    var t_2_b = [];
    var i = 0;
    while(0xFF - i * 0x0F >= 0x78){
      t_2_b[i] = "#"+(
        ((0xFF) << 16 )
        | ((0x78 + i * 0x0F) << 8)
        | (0x00)
      ).toString(16);
      i++;
    }

    var b_2_l = [];
    i = 0;
    while(0xFF - i * 0x0F >= 0x78){
      b_2_l[i] = "#" +(
        (0xFF - i * 0x1E) << 16
        | (0xFF << 8)
        | (0x00)
      ).toString(16);
      i++;
    }

    return  t_2_b.concat(b_2_l);
}
