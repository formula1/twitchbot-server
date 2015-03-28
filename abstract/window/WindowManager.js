var EventEmitter = require("events").EventEmitter;
var FrameContext = require("./FrameContext.js");

function WindowManager(configs){
  EventEmitter.call(this);
  this.configs = [];
  this.windows = {};
  if(configs)
    setTimeout(this.load.bind(this,configs),1);
}
WindowManager.prototype = Object.create(EventEmitter);
WindowManager.prototype.constructor = WindowManager;

WindowManager.prototype.load = function(configs){
  configs.forEach(this.registerWindow.bind(this));
  this.emit("load");
  return this;
};

WindowManager.prototype.register = function(config,ctx,cb){
  var win;
  if(!(config instanceof FrameContext)){
    win = new FrameContext(this, config);
  }else if(config.id in this.windows){
     return;
  }
  this.windows[config.id] = win;
  this.configs.push(config);
  this.emit("registered", win);
  if(ctx){
    return win.open(ctx,cb);
  }
  return win;
};

module.exports = WindowManager;
