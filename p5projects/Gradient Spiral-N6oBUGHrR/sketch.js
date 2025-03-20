let cols, rows; let size = 10;
let threshold = 0.5; let t = 0;


function setup() {
  createCanvas(400, 400);
  cols = width/size;
  rows = height/size;
  textSize(size);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  
  for (let i = 0; i<cols; i ++){
    for(let j=0; j<rows;j++){
      let x = size/2 + i*size;
      let y = size/2 + j*size;
      let d = dist(x, y, width/2, height/2);
      let k = 10;
      
      let dx = x - width/2;
      let dy = y - height/2;
      let angle = atan2(dy, dx);
      
      let spiralPath = sin(d/k + angle + t);
      
      let distanceFactor = 100;
      let angleFactor = 5;
      let condition= sin(d / distanceFactor + angleFactor * angle);
      
      let symbol;
      if(spiralPath > condition) {
        symbol = "X";
        c = colorGradient(d);
      } else {
        symbol = "."
        c = color(255, 100);
      }
      
      fill(c);
      text(symbol, x, y )
    }
  }
  t -= 0.01;
}

function colorGradient(d){
  let colors = [color(252, 176, 69), color(131, 58, 180)];
  let colorRadius = 120;
  let amt = d % colorRadius / colorRadius;
  
  return lerpColor(colors[0],colors[1], amt);
}
