var ct = {
	0:1,
	15:Math.cos(Math.pi/12),
	30:Math.sqrt(3)/2,
	45:(Math.sqrt(2)/2),
	60:1/2,
	75:Math.cos(5*Math.pi/12),
	90:0,
	105:-Math.cos(5*Math.pi/12),
	120:-1/2,
	135:-(Math.sqrt(2)/2),
	150:-Math.sqrt(3)/2,
	165:-Math.cos(Math.pi/12),
	180:-1,
	195:-Math.cos(Math.pi/12),
	210:-Math.sqrt(3)/2,
	225:-(Math.sqrt(2)/2),
	240:-1/2,
	255:-Math.cos(5*Math.pi/12),
	270:0,
	285:Math.cos(5*Math.pi/12),
	300:1/2,
	315:(Math.sqrt(2)/2),
	330:Math.sqrt(3)/2,
	345:Math.cos(Math.pi/12)
};

function calcCos(angle, op, ow){


	while(angle < 0)	angle += 360;
	angle = angle%360;
	return ow*ct[angle]+op;

}

ActionStack = require("./async-stack");

function PhyTree(canvas,colors, radius){
	console.log("constructed tree");

	this.stack = new ActionStack("lifo", false);

	var ww = radius*2||canvas.width;
	w = ww/9;
	var wh = w*5.5;
	var sp = {x:ww/2, y:wh-w/2};

	var numit = 0;
	var i = w;
	while(i > 1){
		i = i*Math.sqrt(2)/2;
		numit++;
	}

	var ctx = canvas.getContext('2d');

	var polygons = [];
	polygons[0] = {"point":sp, "angle":0};

	var that = this;



	this.draw_the_tree  = function(startpoint, angle, scale, ntnum){
		if(scale < 1) return;
		var sqps = [
			calcCos(45+angle, startpoint.x, scale), calcCos(45+90+angle, startpoint.y, scale)
			,calcCos(45+90+angle, startpoint.x, scale), calcCos(45+90+90+angle, startpoint.y, scale)
			,calcCos(45+180+angle, startpoint.x, scale), calcCos(45+90+180+angle, startpoint.y, scale)
			,calcCos(45+270+angle, startpoint.x, scale), calcCos(45+90+270+angle, startpoint.y, scale)
		];
		var tps = [
			sqps[0], sqps[1],
			sqps[2], sqps[3],
			calcCos(90+angle, startpoint.x, scale/2*(1+Math.sqrt(3))) ,calcCos(90+90+angle, startpoint.y,scale/2*(1+Math.sqrt(3)))
		];



		var tempc = colors[Math.floor(colors.length*ntnum/numit)];

		ctx.fillStyle = tempc;
		ctx.beginPath();
		ctx.moveTo(sqps[0], sqps[1]);
		for( i=2 ; i < sqps.length-1 ; i+=2 ){ctx.lineTo( sqps[i] , sqps[i+1] )}
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = tempc;
		ctx.beginPath();
		ctx.moveTo(tps[0], tps[1]);
		for( i=2 ; i < tps.length-1 ; i+=2 ){ctx.lineTo( tps[i] , tps[i+1] )}
		ctx.closePath();
		ctx.fill();


		var lr = Math.round(Math.random());
		this.stack.add(function(){
			that.draw_the_tree(
				{
					x:calcCos(lr*180+angle, tps[4],scale*Math.sqrt(2)/2),
					y:calcCos(lr*180+90+angle, tps[5], scale*Math.sqrt(2)/2)
				},
				angle+(-1+2*lr)*45,
				scale*Math.sqrt(2)/2,
				ntnum+1
			)
		});
		this.stack.add(function(){
			that.draw_the_tree(
				{
					x:calcCos((1-lr)*180+angle, tps[4],scale*Math.sqrt(2)/2),
					y:calcCos((1-lr)*180+90+angle, tps[5], scale*Math.sqrt(2)/2)
				},
				angle+(1-2*lr)*45,
				scale*Math.sqrt(2)/2,
				ntnum+1
			)
		});

		this.stack.run();


	};


	this.stack.add(function(){
		that.draw_the_tree(sp, 0, w, 0);
	});
}


PhyTree.prototype.draw = function(){
	this.stack.run();
}

module.exports = PhyTree;
