let ps = []; // this is for the system
//let backgrounds = [];
let repeatCount = 0;
let maxRepeats = 7;
let delay = 1000;
let ledcount1 = 0;
let ledcount2 = 0;
let ledcount3 = 0;
let ledcount4 = 0;
let p = null;
/////////////////////


function setup() {
  createCanvas(windowWidth, windowHeight);
  // colorMode(HSB, 255);
}

function mousePressed() {
  let mousePositionX = mouseX;
  let mousePositionY = mouseY;

  p = new Particle(mousePositionX, mousePositionY);

  ps.push(new System(mousePositionX, mousePositionY));
  for (let i = 0; i < 3; i++) {
    setTimeout(
      () => ps.push(new System(mousePositionX, mousePositionY)),
      200 + i * 200
    );
  }
}

function draw() {
  background(0, 0, 0, 150);
  for (let i = ps.length - 1; i >= 0; i--) {
    ps[i].update();
    ps[i].display();

    if (ps[i].done) {
      ps.splice(i, 1);
    }
  }
}

function keyPressed() {
   fullscreen(true);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class System{
  constructor(x,y){
    this.x = x;
    this.y = y;
    
    this.particles = []; 
    this.num = 150;
    for(let i = 0; i < this.num; i++){
    this.particles.push(new Particle(this.x, this.y));
  }
    //console.log("hello");
    this.done = false;
}


update(){
  this.finished();
    for (let i = this.particles.length - 1; i >= 0; i--){
    this.particles[i].update();
    
    if (this.particles[i].done){
      this.particles.splice(i, 1);
    } 
  }
}

display(){
  for(let i = 0; i < this.particles.length; i ++){
    this.particles[i].display();
 }
}
  
  finished(){
    if(this.particles.length == 0){
      this.done = true;
    } else {
    this.done = false;
    }
  }
}

