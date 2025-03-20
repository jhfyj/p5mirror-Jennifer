
let particles = [];

function setup() {
  createCanvas(400, 400);
  p = new Particle(width/2, height/2);
}

function draw() {
  background(220);
  
  particles.push(new Particle(width/2, height/2));
  
  for (let i = 0; i<particles.length; i++){
    particles[i].update();
    particles[i].display();
  }
  
  print(particles.length);
}
