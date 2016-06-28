var rect = {};
var drag = false;

function mouseDown(e) {
  rect.startX = e.pageX - this.offsetLeft;
  rect.startY = e.pageY - this.offsetTop;
  rect.w = 5;
  rect.h = 5;
  drag = true;
}

function mouseUp() {
  select();
  drag = false;
  rect = {};
}

function mouseMove(e) {
  if (drag) {
    rect.w = (e.pageX - this.offsetLeft) - rect.startX;
    rect.h = (e.pageY - this.offsetTop) - rect.startY ;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
  }
}

function draw() {
  ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  ctx.fillStyle = "red";
}

//TO BE REFORMATTED ONCE BUILDING AND OTHER UNITS ARE MADE
function select(){
    currentSelection = [];

    var playerEndX = player.pos[0] + player.sprite.size[0]/4;
    var playerEndY = player.pos[1] + player.sprite.size[1]/4;
      
    var rectEndX = rect.startX + rect.w;
    var rectEndY = rect.startY + rect.h;

    if (inRange(player.pos[0], playerEndX, rect.startX, rectEndX) && inRange(player.pos[1], playerEndY, rect.startY, rectEndY)){
      currentSelection.push(player);
      console.log("SELECTED: ", currentSelection);
    }

}
