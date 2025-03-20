let gravity; 
let fireworks = [];
let colors = [];
let trail = [];
let music, amplitude;

function preload() {
  // Load your music file here (make sure the file path is correct)
  music = loadSound('1021.MP3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.1);
  colors = ["#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9"];
  
  // Start the music and create amplitude analyzer
  music.play();
  music.setVolume(0.5);
  amplitude = new p5.Amplitude();
}

function draw() {
  background(50); 
  
  // Get the amplitude level from the music
  let level = amplitude.getLevel();
  
  // Use music amplitude to control fireworks frequency
  if (level > 0.05 && random(1) < level) {
    fireworks.push(new Firework(random(width), height));
  }

  // Update and display fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    
    if (fireworks[i].done) {
      fireworks.splice(i, 1);
    }
  }

  // White ball tracking mouse on X-axis with trailing effect
  let ball = createVector(mouseX, height / 2);
  trail.push(ball);
  
  // Limit trail length to 50
  if (trail.length > 50) {
    trail.splice(0, 1);
  }

  noFill();
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i];
    let size = map(i, 0, trail.length, 10, 30);
    fill(255, 255 - i * 5);
    ellipse(pos.x, pos.y, size, size);
  }
}

// Firework class
class Firework {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-5, -10));
    this.c = color(random(colors));
    this.explode = false;
    this.firework = new Particle(this.pos.x, this.pos.y, this.vel.x, this.vel.y, this.explode, this.c);
    this.particles = [];
    this.num = 50;
    this.done = false;
  }
  
  update() {
    if (!this.explode) {
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded();
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].finished();
        this.particles[i].update();

        if (this.particles[i].done) {
          this.particles.splice(i, 1);
        }
      }
    }
  }
  
  display() {
    if (!this.explode) {
      this.firework.display();
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].display();
      }
    }
  }
  
  exploded() {
    this.explode = true;
    for (let i = 0; i < this.num; i++) {
      this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, random(-2, 2), random(-5, 5), true, this.c));
    }
  }
  
  done() {
    return this.explode && this.particles.length === 0;
  }
}

// Particle class for fireworks
class Particle {
  constructor(x, y, vx, vy, explode, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.c = c;
    this.explode = explode;
    this.size = this.explode ? 2 : 10;
    this.life = 255;
    this.done = false;
  }
  
  update() {
    this.vel.add(gravity);
    this.pos.add(this.vel);
    this.life -= 2;
  }
  
  display() {
    noStroke();
    fill(this.c, this.life);
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(this.c);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  
  finished() {
    if (this.life < 0) {
      this.done = true;
    }
  }
}
