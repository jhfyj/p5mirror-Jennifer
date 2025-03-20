let bright;
let bright1;
let r = 100;
let a = 255;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  stroke(a);
  noFill();

  let cx = width / 2;  // Center x
  let cy = height / 2; // Center y
  
  circle(cx, cy, r * 2);
  
  let dx = mouseX - cx;
  let dy = mouseY - cy;
  let distToMouse = dist(mouseX, mouseY, cx, cy);

  if (distToMouse <= r) {
    let theta = atan2(dy, dx);  // Angle from the center to the mouse
    
    a = 200;
  
    let x = r * cos(theta);
    let y = r * sin(theta);
  
    bright = map(abs(theta), 0, PI, 25, 200);
    bright1 = abs(map(abs(theta), PI, TWO_PI, 0.01, 1));
    
    console.log(bright);
    console.log(bright1);
  } else {
    a = 255;
  }
}