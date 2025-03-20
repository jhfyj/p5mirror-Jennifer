let pos;
let vel;
let acc;

function setup() {
  createCanvas(400, 400);
  pos = createVector(width/2, height/2)
  vel = createVector(0, 0)
  acc = p5.Vector.random2D();
}

function draw() {
  background(220);
  vel.add(acc);
  pos.add(vel);
  ellipse(pos.x, pos.y, 10, 10);
}