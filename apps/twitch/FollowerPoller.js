var sa = require("superagent");
var ee = require("events").EventEmitter;

var last_check = void(0);
var interval = void(0);
var tocheck = [];

function FollowerPoller(channelname){
  if(!channelname) throw new Error("A channelname is required");
  ee.call(this);
  this.cn = channelname;
  this.interval = void(0)
  this.lastCheck = Math.POSITIVE_INFINITY;
}

FollowerPoller.prototype = Object.create(ee.prototype);
FollowerPoller.prototype.constructor = FollowerPoller;

FollowerPoller.prototype.start = function(){
  if(this.interval) throw new Error("you are already polling");
  var _this = this;
  this.interval = setInterval(function(){
    sa.get("https://api.twitch.tv/kraken/channels/"+this.cn+"/follows")
    .set('Accept','application/vnd.twitchtv.v2+json')
    .set('Client-ID', config.twitch.clientid)
    .end(function(err,res){
      if(err) return console.error(err);
      var followers = res.body.follows;
      i = 0;
      var d = new Date(followers[0].created_At);
      var first = d.getTime()
      while(d.getTime() < _this.lastCheck && i < followers.length){
        _this.emit("follower",followers[i])
        i++;
        d = new Date(followers[i].created_At);
      }
      _this.lastCheck = first;
    });
  },1000);
}

FollowerPoller.prototype.stop = function(){
  if(!this.interval) throw new Error("You are not polling");
  clearInterval(this.interval);
}

module.exports = FollowerPoller;
