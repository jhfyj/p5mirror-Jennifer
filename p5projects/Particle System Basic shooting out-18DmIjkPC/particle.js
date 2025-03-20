class Particle {
  constructor(x, y){
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.acc = p5.Vector.random2D();
    this.acc.mult(0.05);
    this.life = 255;
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    this.life -= 5;
    this.done = false;
  }
  
  display(){
    fill(255, 0, 0, this.life);
    
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }

  finished(){
      if (this.life < 0){
       this.done = true;
      } else {this.done = false}
  }
} 