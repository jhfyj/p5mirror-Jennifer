class Particle {
  constructor(x, y){
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.acc = p5.Vector.random2D();
    this.acc.mult(0.02);
    this.life = 255;
    this.done = false;
    this.hueValue = 0;
    this.color1 = 170;
    this.color2 = 185;
  }
  
  update(){
    if(this.pos <= 8 || this.pos >= 8){
      this.acc * -1;
      this.vel * -1;
    }
    
    this.finished();
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    this.life -= 1.6;
  }
  display(){
    noStroke();
    fill(this.color1, this.color2, 160, this.life);
    ellipse(this.pos.x, this.pos.y, 8, 8);
  }

  finished(){
    if (this.life < 0){
      this.done = true;
    } else {
      this.done = false;
    }
  }
} 