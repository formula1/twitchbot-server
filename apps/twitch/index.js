var ee = require("events").EventEmitter;
var FollowerPoller = require("./FollowerPoller");


function Channel(channel){
  if(!channel) throw new Error("A channelname is required");
  ee.call(this);
  this.fb = new FollowerPoller(channel);
  this.fb.on("follower",this.emit.bind(this,"follower"));
}

Channel.prototype = Object.create(ee.prototype);
Channel.prototype.constructor = Channel;

Channel.prototype.start = function(){
  this.fb.start();
}

Channel.prototype.stop = function(){
  this.fb.stop();
}

module.exports = Channel;
