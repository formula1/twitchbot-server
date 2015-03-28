

//	var shape = [
//					-Math.sqrt(2)/2,	-Math.sqrt(2)/2
//				,	Math.sqrt(2)/2,		-Math.sqrt(2)/2
//				,	Math.sqrt(2)/2,		Math.sqrt(2)/2
//				,	-Math.sqrt(2)/2,	Math.sqrt(2)/2
//				]


function KochCrystal(canvas, colors, radius, shape){
	if(typeof canvas === "undefined") throw new Error("need a canvas to draw on");
	console.log("constructed crystal");
	if(!shape){
		shape = [
			-Math.sqrt(3)/2,	-1/2,
			Math.sqrt(3)/2,	-1/2,
			0,				1
		];
	}
	var temp = this.establishShape(shape);

	this.stack = new ActionStack("fifo",false);
	var ctx=canvas.getContext("2d");
	radius = radius?radius:
					Math.floor(temp.radius) > 1?remp.radius:
					Math.min(canvas.height/2,canvas.width/2);

	var abs_c = {x:radius,y:radius};
	shape = temp.points;


	var num_sides = shape.length/2;

	var maxlength = 0;
	var sidelengths = [];
	var bot = -1;
	for(var i = 0;i<shape.length;i+=2){
		if(shape[i] > 1 || shape[i+1] > 1)
			throw new Error("Please use Cosin and sin as shape");
		sidelengths.push(
			Math.sqrt(
				Math.pow(shape[i]-shape[(i+2)%shape.length],2) +
				 Math.pow(shape[i+1]-shape[(i+3)%shape.length],2)
			)
		);
		if(bot == -1) bot = sidelengths[sidelengths.length - 1];

		maxlength = Math.max(maxlength,sidelengths[sidelengths.length - 1]);
	}


	var pangles = [];
	for(i=0;i<shape.length;i+=2){
		pangles[pangles.length] = Math.atan2(shape[i+1],shape[i]);
	}



	//Setting up center points and center distances
	var cangles = [];
	var cdist = [];
	var cbot = 0;
	for(i=0;i<num_sides;i++){
		cdist[i] = Math.sqrt(Math.pow((shape[i*2]+(shape[(i*2+2)%shape.length]))/2, 2) + Math.pow((shape[i*2+1]+(shape[(i*2+3)%shape.length]))/2, 2));
		if(cbot == 0) cbot = cdist[i];

		cangles[i] = Math.atan2((shape[i*2+1]+(shape[(i*2+3)%shape.length]))/2,(shape[i*2]+(shape[(i*2+2)%shape.length]))/2);
	}


	//figuring out the max num of iterations
	var numit = 0;
	var i = bot*radius;
	var porp = maxlength/bot;
	var nm = maxlength*radius;
	while(i > 10){
		i = nm - nm*2/num_sides;
		nm = i*porp;
		if(i > bot*radius)
			throw new Error(
				"This shape will grow bigger, not smaller" + i +", " + bot*radius
			);
		numit++;
	}
	var that = this;



	this.draw_full  = function(center, angle, scale, ntnum){
		if(typeof sibling == "undefined") sibling = false;
		if(ntnum > numit) return;

		ctx.translate(center.x,center.y);
//		ctx.rotate(angle)

//		ctx.fillStyle = colors[5-Math.round(5*ntnum/numit)];
		ctx.strokeStyle = colors[5-Math.round(5*ntnum/numit)];
		ctx.lineWidth = 1;//+numit-ntnum;

		var points = drawshape(scale,angle, center,ntnum);

		if(ntnum == -1){
		ctx.fillStyle = "blue";
		ctx.font = "bold 16px Arial";
		ctx.fillText(angle, 0, 0);
		}
//		ctx.rotate(-angle)
		ctx.translate(-center.x,-center.y);


		var next_scales = getNextScales(scale);
		var next_centers = getNextMidpoints(scale,next_scales,center,angle);
		var next_angles = getNextAngles(next_centers,angle);

		var pointA,pointB,smp, tinyscale;
		var start = 0//(ntnum == 0)?0:1;
		for(i=start; i< num_sides;i++){

			(function (center, angle, scale, ntnum) {
				that.stack.add(function(){
					that.draw_full(
						center,
						angle,
						scale,
						ntnum
					);
				});
			})( next_centers[i], next_angles[i], next_scales[i], ntnum+1);

			(function (center, angle, scale, ntnum) {
				that.stack.add(function(){
					that.draw_full(
						center,
						angle,
						scale,
						ntnum
					);
				});
			})( calculateMidpoint(scale, next_scales, center, Math.PI, angle, i), next_angles[i]+Math.PI, next_scales[i], ntnum+1);


				pointA = points[i];
				pointB = points[(i+1)%num_sides];

//				pointA = rotatePoint(points[i],next_angles[i],next_centers[i]);
//				pointB = rotatePoint(points[(i+1)%num_sides],next_angles[i],next_centers[i]);
//				drawPoint(pointA);
//				drawPoint(pointB);
				(function (pa,pb,s,angle,side_id,iteration){
					that.stack.add(function(){
						siblings(pa,pb,s,angle,side_id,iteration);
					});
				})(pointA, pointB, next_scales[i], next_angles[i], i, ntnum+2);

				(function (pa,pb,s,angle,side_id,iteration){
					that.stack.add(function(){
						siblings(pa,pb,s,angle,side_id,iteration);
					});
				})(pointB,pointA, next_scales[i], next_angles[i]+Math.PI, i, ntnum+2);


		}
	};

	function siblings(pointA, pointB, initscale, angle, side_id, iteration){
		var smallerScale = 	initscale*(sidelengths[side_id]/maxlength)*(1- 2/num_sides);



		var midpoint = {x:(pointA.x+pointB.x)/2,
					y:(pointA.y+pointB.y)/2};

//		var smp = {x:(pointA.x+midpoint.x-Math.cos(angle-cangles[i])*bot*smallerScale*radius/2)/2 + Math.cos(angle)*smallerScale*radius*cdist[i],
//			y:(pointA.y+midpoint.y-Math.sin(angle-cangles[i])*bot*smallerScale*radius/2)/2 + Math.sin(angle)*smallerScale*radius*cdist[i]};

//		amp = {	x:	smp.x + Math.cos(angle)*smallerScale*radius*cdist[side_id]
//			,	y:	smp.y + Math.sin(angle)*smallerScale*radius*cdist[side_id]
//			};
		var smp = {
					x:midpoint.x + Math.cos(angle)*bot*initscale*radius/2
				,
					y:midpoint.y + Math.sin(angle)*bot*initscale*radius/2
				};

		var amp={
			x:(pointA.x+smp.x)/2 + Math.cos(angle+Math.PI/2)*smallerScale*radius*cbot
		,
			y:(pointA.y+smp.y)/2 + Math.sin(angle+Math.PI/2)*smallerScale*radius*cbot
		};


		(function (center,angle,scale,ntnum){
			that.stack.add(function(){
				that.draw_full(
					center,
					angle,
					scale,
					ntnum
				);
			});
		})(amp,angle,smallerScale, iteration);
		(function (pa,pb,s,angle,side_id,iteration){
			that.stack.add(function(){
				siblings(pa,pb,s,angle,side_id,iteration);
			});
		})(pointA,smp, smallerScale, angle, side_id, iteration+1);
//		var smp = {x:(pointB.x+midpoint.x+Math.cos(angle-cangles[i])*bot*smallerScale*radius/2)/2 + Math.cos(angle)*smallerScale*radius*cdist[i],
//			y:(pointB.y+midpoint.y+Math.sin(angle-cangles[i])*bot*smallerScale*radius/2)/2 + Math.sin(angle)*smallerScale*radius*cdist[i]};


		smp = {
					x:midpoint.x - Math.cos(angle)*bot*initscale*radius/2
				,
					y:midpoint.y - Math.sin(angle)*bot*initscale*radius/2
				};

		amp = {
			x:(smp.x+pointB.x)/2 + Math.cos(angle+Math.PI/2)*smallerScale*radius*cbot
			,
			y:(smp.y+pointB.y)/2 + Math.sin(angle+Math.PI/2)*smallerScale*radius*cbot
		};
//		console.log(JSON.stringify(amp));
//		amp = {	x:	smp.x + Math.cos(angle-cangles[side_id])*smallerScale*radius*cdist[side_id]
//			,	y:	smp.y + Math.sin(angle-cangles[side_id])*smallerScale*radius*cdist[side_id]
//			};
		(function (center,angle,scale,ntnum){
			that.stack.add(function(){
				that.draw_full(
					center,
					angle,
					scale,
					ntnum,
					true
				);
			});
		})(amp,angle,smallerScale, iteration);
		(function (pa,pb,s,angle,side_id,iteration){
			that.stack.add(function(){
				siblings(pa,pb,s,angle,side_id,iteration);
			});
		})(smp,pointB, smallerScale, angle, side_id, iteration+1);
	}

	function drawshape(scale, angle, center, it){
		var points = [{x:radius*scale*Math.cos(pangles[0]+angle)+center.x, y:radius*scale*Math.sin(pangles[0]+angle)+center.y}];

		ctx.beginPath();
		ctx.moveTo(points[0].x-center.x, points[0].y-center.y);

		for( i=1 ; i < num_sides ; i++ ){
			points[i] ={
				x: radius*scale*Math.cos(pangles[i]+angle) +center.x,
				y: radius*scale*Math.sin(pangles[i]+angle) +center.y
			};
			ctx.lineTo(points[i].x - center.x, points[i].y-center.y);
		}
		ctx.lineTo(points[0].x - center.x, points[0].y-center.y);
		ctx.closePath();
		ctx.stroke();
//		ctx.fill();

//		ctx.stroke();
		return points;

	}

	function drawLine(pA,pB,color){
		ctx.moveTo(pA.x, pa.Y);
		ctx.lineTo(pB.x, pB.y);
		ctx.closePath();
		ctx.stroke();


	}

	function getNextScales(scale){
		var scales = [];
		for(var i=0;i<num_sides;i++){
			scales[i] = scale*sidelengths[i]/maxlength*(1- 2/num_sides);
		}
		return scales;
	}

	function getNextMidpoints(scale, scales,center, angle){
		var midpoint = [];
		for(var i=0;i<num_sides;i++){
			midpoint[i] = {
				x: Math.cos(cangles[i]+angle)*( scale*radius*cdist[i] + scales[i]*radius*cbot) + center.x
			,	y: Math.sin(cangles[i]+angle)*( scale*radius*cdist[i] + scales[i]*radius*cbot) + center.y
			};
		}
		return midpoint;
	}

	function calculateMidpoint(scale, scales, center,offang, angle, i){
		var midpoint = {
			x: Math.cos(cangles[i]+angle)*( scale*radius*cdist[i]) + Math.cos(cangles[i]+angle+offang)*(scales[i]*radius*cbot) + center.x
		,	y: Math.sin(cangles[i]+angle)*( scale*radius*cdist[i]) + Math.sin(cangles[i]+angle+offang)*(scales[i]*radius*cbot) + center.y
		};

		return midpoint;
	}

	function getNextAngles(midpoints, angle){
		angles = []
		for (var i = 0; i< num_sides; i++){
			angles[i] = cangles[i] + angle - Math.PI/2;
		}
		return angles;
	}

	function drawPoint(point){
		ctx.beginPath();
		ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = '#777700';
		ctx.fill();
	}

	function rotatePoint(point,angle,center){
		if(typeof center == "undefined") center = {x:0,y:0};
		point.x -= center.x;
		point.y -= center.y;

		var op = point;

		point.x = op.x*Math.cos(angle) - op.y*Math.sin(angle);
		point.y = op.y*Math.cos(angle) + op.x*Math.sin(angle);

		point.x += center.x;
		point.y += center.y;

		return point;
	}

	that.stack.add(function(){
		that.draw_full({x:radius-1,y:radius-1}, 0, 1, 0);
	});

	that.stack.run();

}

KochCrystal.prototype.establishShape = function(points){
	if(points.length%2 == 1) throw new Error("need even number to properly identify points");
	var center =[0,0];
	for(var i=0;i<points.length;i+=2){
		center[0] += 2*points[i]/points.length;
		center[1] += 2*points[i+1]/points.length;
	}
	console.log(center);
	var radius = 0;
	var temphyp;
	for(var i=0;i<points.length;i+=2){
		points[i] = points[i] - center[0];
		points[i+1] = points[i+1] - center[1];
		temphyp = Math.sqrt(Math.pow(points[i],2) + Math.pow(points[i+1],2))
		if(temphyp > radius) radius = temphyp;
		console.log(temphyp);
	}
	console.log(radius);
	center = [0,0];

	for(var i=0;i<points.length;i++) points[i] = points[i]/radius;
	return {points:points, radius:radius};
}


KochCrystal.prototype.draw = function(){
	this.stack.run();
}
