var Strength = 40;
var v = 40;
let numMax = 10;
let t = 0;
let h = 0.001;
let particles = [];
let particlecount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  setInterval(numMaxincrease, 500);
  for (let i = 0; i < numMax; i++) {
    let valX = random(-width / 2, width / 2);
    let valY = random(-height / 2, height / 2);
    particles[i] = new Particle(valX, valY, t, h);
  }
}

function draw() {
  noCursor();
  cursor(HAND);

  translate(width / 2, height / 2);
  fill(0, 20);
  stroke(0);
  strokeWeight(2);
  rect(-width / 2, -height / 2, width, height);

  t += h;

  // Add new particles if numMax increases
  while (particles.length < numMax) {
    let valX = random(-width / 2, width / 2);
    let valY = random(-height / 2, height / 2);
    particles.push(new Particle(valX, valY, t, h));
  }
  
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (
      p.x > width / 2 ||
      p.y > height / 2 ||
      p.x < -width / 2 ||
      p.y < -height / 2
    ) {
      particles.splice(i, 1);
      particles.push(new Particle(-width / 2, random(-height / 2, height / 2), t, h));
      particlecount ++;
      console.log(particlecount);
      
    }
  }
}

class Particle {
  constructor(_x, _y, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(0.4, 2);
    this.h = _h;
    this.op = random(199, 200);
    this.r = 255;
    this.g = random(60, 140);
    this.b = random(60, 140);
    this.speedX = random(1, 3);
    this.speedY = random(-1, 1);
    this.acceleration = random(0.01, 0.05);
    this.angle = random(TWO_PI);
  }

  update() {
    this.speedX += this.acceleration;
    this.x += this.speedX;
    this.y += sin(this.angle) * 2; // Sine wave vertical motion
    this.angle += 0.05; // Continuous smooth oscillation
    this.time += this.h;
  }

  display() {
    fill(this.r, this.b, this.g, this.op);
    noStroke();
    ellipse(-this.x, this.y, 2 * this.radius, 2 * this.radius);
  }
}

function doubleClicked() {
  background(0);
}

function numMaxincrease(){
  if(particlecount >= 6000){
    numMax --;
  } else if(particlecount <= 0){
      numMax = pow(numMax, 5);
  }
}