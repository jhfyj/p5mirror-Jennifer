class Particle {
  constructor(x, y){
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.acc = p5.Vector.random2D();
    this.acc.mult(0.02);
    this.life = 255;
    this.done = false;
    this.hueValue = 0;
  }
  
  update(){
    this.finished();
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    this.life -= 2;
  }
  display(){
    noStroke();
    fill(170, 170, 160, this.life);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  finished(){
    if (this.life < 0){
      this.done = true;
    } else {
      this.done = false;
    }
  }
} 