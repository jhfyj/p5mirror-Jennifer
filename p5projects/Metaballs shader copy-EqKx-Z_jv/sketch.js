const BLOBS = 10;
const MIN_VEL = 2;
const MAX_VEL = 5;
const MIN_RAD = 2000;
const MAX_RAD = MIN_RAD;


let theShader;

let list = [];

let running = true;

function preload(){
  theShader = loadShader('basic.vert', 'basic.frag');
}

function setup() {
  pixelDensity(1);
  const SIZE = floor(min(innerWidth, innerHeight)*0.9);
  createCanvas(SIZE, SIZE, WEBGL);
  noStroke();
    
  for (let i = 0; i < BLOBS; ++i) list.push(new Blobb(random(width), random(height)));
  
  (o=>setInterval(()=>o.html(frameRate().toFixed(2)), 100))(createElement('h3'));
}

mouseClicked = () => running = !running;

function draw() {
  background(0);
  
  theShader.setUniform('u_resolution', [width, height]);  
  theShader.setUniform('u_blobx', list.map(b=>b.x));  
  theShader.setUniform('u_bloby', list.map(b=>b.y));  
  
  shader(theShader);
  rect(0,0,width, height);
    
  if (running) list.forEach((b) => b.update());

}

class Blobb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    const ang = Math.random() * Math.PI * 2;
    const mag = Math.random() * (MAX_VEL-MIN_VEL) + MIN_VEL;
    this.vx = mag * Math.cos(ang);
    this.vy = mag * Math.sin(ang);

  }

  update() {
    if (this.x + this.vx < 0 || this.x + this.vx >= width) this.vx *= -1;
    if (this.y + this.vy < 0 || this.y + this.vy >= height) this.vy *= -1;
    this.x += this.vx;
    this.y += this.vy;
  }

  // show() {
  //   ellipse(this.x-width/2, this.y-width/2, 50, 50);
  // }
}

