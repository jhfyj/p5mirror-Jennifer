let particles = [];
let hexArray = ["##ace1ef", "#f5aec6", "#c2f1c0", "#faf7c4", "#fdd5b6", "#efacac", "#c4b2f7", "#b2f7d3", "#b2dcf7"];

let currentColor = "#ffffff";

function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < 10; i++) {
    let x = random(width / 2 - 200, width / 2 + 200);
    let y = random(height / 2 - 150, height / 2 + 150);
    particles.push(new Particle(x, y));
  }
}

function draw() {
  background(197, 244, 255, 50);

  for (let i = 0; i < particles.length; i++) {
    let particleA = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let particleB = particles[j];
      particleA.collide(particleB);
    }
  }

  
  
  for (let particle of particles) {
    
    let currentColor = particle.color;
    particle.update();
    particle.edges();
    fill(currentColor);
    particle.show();
  }
}
