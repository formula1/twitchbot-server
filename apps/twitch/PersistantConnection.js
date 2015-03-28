var Duplex = require("streams").Duplex;
var url = require("url");
var net = require("net");

var DEAD = -1, UNBORN = 0, ALIVE = 1, RECOVER = 2;

function RegeneratingConnection(uri){
  if(!(this instanceof RegenratingCOnnection)){
    return new RegeneratingConnection(uri);
  }
  Duplex.call(this);
  if(uri) this.connect(uri);
}

RegeneratingConnection.prototype = Object.create(Duplex.prototype);
RegeneratingConnection.prototype.constructor = RegeneratingConnection;

RegeneratingConnection.prototype._write = function(data,encode,next){
  if(this.state < ALIVE){
    throw new Error("Cannot write when not connected or destoryed");
  }
  if(this.state === RECOVER){
    this.buffer = Buffer.concat(this.buffer,data);
    return next()
  }
  this.socket.write(data);
};

RegeneratingConnection.prototype.connect = function(uri,cb){
  if(this.state == DEAD) throw new Error("cannot connect to dead connection");
  if(typeof uri == "function"){
    cb = uri;
    uri = this.uri
  }else{
    this.uri = typeof uri == "object"?uri:url.parse(uri);
  }
  this.state = RECOVER;
  var self = this;
  var el = function(e){
    self.state = DEAD;
    self.socket.destory();
    if(cb) return cb(e);
    self.emit("error",e);
  };
  this.socket = net.connect(uri.port, uri.host, function() {
    self.state = ALIVE;
    self.pipe(self.socket).pipe(self);
    self.socket.removeListener("error",el);
    self.socket.on("disconnect",function(){
      self.emit("disconnect",e);
      if(state < ALIVE ) return;
      self.socket.destroy();
      state = RECOVER;
      self.connect();
    })
    self.emit("connect",e);
    if(cb) return cb();
  });
  this.socket.on("error",el);
}

RegeneratingConnection.prototype.destroy = function(){
  this.state = DEAD;
  this.socket.destroy();
}
