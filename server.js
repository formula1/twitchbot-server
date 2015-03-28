var http = require("http");
var express = require("express");
var ProxyDuplex = require("./abstract/message/ProxyDuplex");
var Client = require("./abstract/clientserver/server2client");
var TwitchChannel = require("./apps/twitch");
var browserify = require("browserify");
var b = browserify(__dirname+"/browser");

global.config = require("./config.json");

console.log(config);

var httprouter = express();
var streamer = new ProxyDuplex(false,true);
var channel = new TwitchChannel(config.twitch.channel)

var server = new http.Server();
server.on("request",httprouter);
server.on("upgrade",function(req,socket,body){
  req.body = body;
  var c = new Client(req,socket);
  c.on("error",function(){
    socket.destroy();
    streamer.close(c);
  });
  streamer.open(c);
});

channel.on("follower",function(follower){
  streamer.trigger("follower",follower);
});
channel.on("follower",function(follower){
  streamer.trigger("follower",follower);
});


httprouter.get("/",function(req,res){
  res.sendFile(__dirname+"/browser/index.html");
})

httprouter.get("/browser.js",function(req,res){
  res.status(200).setHeader('content-type', 'application/javascript');
  b.bundle().pipe(res);
})


httprouter.use(function(err,req,res,next){
  if(err) return console.error(err);
  res.redirect("/");
});

server.listen(process.argv[2]||3000);
channel.start();
