class Background {
  constructor(x, y){
    this.radius = createVector(x, y)
    this.size = createVector(1, 1)
    this.life = 255;
    this.done = false; 
  }
  
  update(){
    if(this.radius <= 50 || this.radius >= 50){
      this.size * -1;
    }
    
    this.finished();
    this.radius.add(this.size);
    this.life -= 1.6;
  }
  display(){   
    noStroke();
    fill(random(160, 180), random(160,180), 160, this.life);
    circle(random(0, width), random(0, height), this.radius);
  }

  finished(){
    if (this.life < 0){
      this.done = true;
    } else {
      this.done = false;
    }
  }
} 