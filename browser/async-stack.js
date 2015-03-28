
function ActionStack(type, asyncfunction){
  var stack = [];
  if(typeof asyncfunction == "undefined"){
    asyncfunction = 10;
  }
  if(typeof asyncfunction == "number"){
    asyncfunction = function(fn){
      setTimeout(fn,asyncfunction);
    };
  }else if(typeof asyncfunction == "string"){
    asyncfunction = window[asyncfunction];
  }else{
    asyncfunction = false;
  }

  this.add = function(callback){
    stack[stack.length] = callback;
  }

  var activate = function(){
    var item;
    if(type == "fifo") item = stack.shift();
    if(type == "lifo") item = stack.pop();
    if(type == "ro") item = stack.splice(
      Math.floor(Math.random() * stack.length),
      1
    )[0];
    item();
    if(!asyncfunction) return;
    asyncfunction(function(){
      activate();
    });
  };
  this.run = activate;
}

module.exports = ActionStack;
