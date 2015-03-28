


function Spiral(canvas, colors, radius){
  console.log("constructed spiral");
  this.ctx = canvas.getContext("2d");
  this.final_radius = radius||Math.max(canvas.width/2,canvas.height/2);
  this.colors = colors;
  this.draw();
}

Spiral.prototype.move = function(){
  this.ctx.translate(-1 + this.final_radius,-1 + this.final_radius);
  this.ctx.rotate(Math.PI*2/(12 * Math.pow(2,4)));
  this.ctx.translate(1 - this.final_radius,1 - this.final_radius);
  this.draw();
  this.ctx.translate(-1 + this.final_radius,-1 + this.final_radius);
  this.ctx.translate(1 - this.final_radius,1 - this.final_radius);
}

Spiral.prototype.draw = function(){


  var radius = void(0);
  var starting_ang = 0;
  var ending_ang = Spiral.quarter;

  this.ctx.translate(-1 + this.final_radius,-1 + this.final_radius);

  for(var i=2;i>=0;i--){


    this.ctx.rotate(Spiral.third);
    this.ctx.strokeStyle = this.colors[i];


      radius=1;
      spicen = [0,0];
      starting_ang = 0;//i*Spiral.quarter%Spiral.full;
      ending_ang = Spiral.quarter;//(i+1)*Spiral.quarter%Spiral.full;

      while(radius < this.final_radius*2){
        this.ctx.beginPath();
        this.ctx.arc(spicen[0],spicen[1],radius,starting_ang,ending_ang);

        old_r = radius;
        radius = radius*Spiral.gold_ratio;
        spicen[0] += -1*Math.cos(ending_ang)*(radius-old_r);
        spicen[1] += -1*Math.sin(ending_ang)*(radius-old_r);
        starting_ang = (starting_ang +Spiral.quarter)%Spiral.full;
        ending_ang = (ending_ang+Spiral.quarter)%Spiral.full;

        this.ctx.rotate(-Spiral.third);

        this.ctx.arc(spicen[0],spicen[1],radius,ending_ang,starting_ang,true);
        this.ctx.rotate(Spiral.third);
        this.ctx.closePath()
        this.ctx.stroke();
        this.ctx.fillStyle = this.colors[i];
        this.ctx.fill();
      }

  }
  this.ctx.globalAlpha = 1;

  var grd=this.ctx.createRadialGradient(0,0,1,0,0,this.final_radius);
  grd.addColorStop(0,'rgba(255,255,255,1)');
  grd.addColorStop(.495,'rgba(255,255,255,0)');
  grd.addColorStop(.505,'rgba(255,255,255,0)');
  grd.addColorStop(1,'rgba(255,255,255,1)');

  this.ctx.globalCompositeOperation = "destination-out";
  this.ctx.beginPath();
  this.ctx.fillStyle = grd;
  this.ctx.arc(0, 0, this.final_radius*2, 0, Math.PI*2, false);
    this.ctx.stroke();

  this.ctx.fill();
  this.ctx.globalCompositeOperation = "source-over";

  this.ctx.translate(1 - this.final_radius,1 - this.final_radius);

}

Spiral.quarter = Math.PI/2;
Spiral.third = Math.PI*2/3;
Spiral.full = Math.PI*2;
Spiral.gold_ratio = (1+Math.sqrt(5))/2;
