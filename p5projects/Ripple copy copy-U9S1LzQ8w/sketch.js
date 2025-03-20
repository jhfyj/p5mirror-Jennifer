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
const askForPort = true; //true first time to pick port, then change to false
const serial = new p5.WebSerial();
let portButton;
let inData;
let outData;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);

  if (askForPort) {
    makePortButton();
  } else {
    serial.getPorts(); //skip the button use port from last time
  }
  serial.on("portavailable", openPort);
  serial.on("data", serialEvent);
}

function mousePressed() {
  let mousePositionX = mouseX;
  let mousePositionY = mouseY;

  p = new Particle(mousePositionX, mousePositionY);

  ps.push(new System(mousePositionX, mousePositionY));
  for (let i = 0; i < 6; i++) {
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

    // Check if any particle hits the edge and print "hello"
    for (let j = 0; j < ps[i].particles.length; j++) {
      let particle = ps[i].particles[j];
      if (particle.positionX() <= 80 && particle.positionY() <= 125) {
        serial.write(10); // Communicate with Arduino or serial device
      } else if (particle.positionY() >= height - 145 && particle.positionX() <= 120) {
        serial.write(20);
      } else if (particle.positionY() <= 170 && particle.positionX() >= width - 140){
        serial.write(30);
      } else if(particle.positionY() >= height - 150 && particle.positionX() >= width - 140){
        serial.write(40);
    }
  }

    if (ps[i].done) {
      ps.splice(i, 1);
    }
  }
}

function keyPressed() {
  serial.write(65);
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString) {
    inData = split(inString, ",");
  }
}

/////////////////////////////////////////////
// UTILITY FUNCTIONS TO MAKE CONNECTIONS  ///
/////////////////////////////////////////////

function openPort() {
  serial.open();
  if (portButton) portButton.hide();
}

// This is a convenience for picking from available serial ports:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(() => serial.requestPort());
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

class Particle {
  constructor(x, y){
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.acc = p5.Vector.random2D();
    this.acc.mult(0.03);
    this.life = 255;
    this.done = false;
    this.hueValue = 0;
    this.color1 = 170;
    this.color2 = 185;
  }
  
  update(){
    if(this.pos.x <= 0 || this.pos.x >= width){
      //this.acc.x = this.acc.x * -1;
      this.vel.x = this.vel.x * -1;
    }
    
    if(this.pos.y <= 0 || this.pos.y >= height){
      //this.acc.y = this.acc * -1;
      this.vel.y = this.vel.y * -1;
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
  
  positionX(){
   return this.pos.x;
  } 
  
  positionY(){
   return this.pos.y;
  } 
  
} 
