/* 
Flow around a circle simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Written by Juan Carlos Ponce Campuzano, 12-Febt-2019
 https://jcponce.github.io
 */


///the user controls the size of the circle through mousePressed. The circle starts from a radius of 0.01 and is contrlled by the variable a. 
//The tracing effect is achieved by placing a black rectangle with minimal opacity under the sketch
// the particles flowing in the background is created using a class. 
//the warping is achieved through exponential function. There are two variables --> P and Q. 

var Strength = 40;
//controls the speed at which the particles move

var v = 40;
// work with strenght to control the threshold of the warp?


var a = 0.01;
let numMax = 800;
let t = 0;
//time
let h = 0.001;
//controls how fast the time is passing by. If H was bigger, particles would not necessarily move faster, but it's more a reflection of the entire process being sped up?
let particles = [];
let currentParticle = 0;

let trace = false;

let buttonTrace;

function setup() {

  createCanvas(windowWidth, windowHeight);
  background(0);
  //seting up particles
    for (let i=0; i<numMax; i++) {
        let valX = random(-width/2, width/2);
        let valY = random(-height/2, height/2);
        particles[i] = new Particle(valX, valY, t, h);
    }
	
	buttonTrace = createButton('Trace');
    buttonTrace.position(30, 30);
    buttonTrace.mousePressed(traceShow);

}

function draw() {
	noCursor();
	cursor(HAND);
  //changing the cursor from point to hand? Not sure what the point is
	
	//Initial message
  if (a <= 0.01) {
    fill(255);
    stroke(255);
		strokeWeight(0.3);
    textAlign(CENTER);
    textSize(28);
    text("Keep mouse pressed to grow.", width / 2, height / 2);
		 text("Double click to reset.", width / 2, height / 2+30);
    //the first time the viewer enters, a is set to 0. Displays the initial message letting users know how to interact with it
  }
    
  translate(width/2,height/2);
  //If the translation was not here, the particles would only be displayed at the top left corner of the screen. Might have to do with the way the equation is written
  
	if(trace == true){
  fill(0, 6);
	}else fill(0,100);
  stroke(0);
  strokeWeight(2);
  //translate(width/2,height/2);
  rect(-width/2, -height/2, width, height);
  //using the semi-transparent background to create the lingering effect
  
   t += h;
        
        for (let i=particles.length-1; i>=0; i-=1) {
            let p = particles[i];
            p.update();
            p.display();
            if ( p.x > width/2 ||  p.y > height/2 || p.x < -width/2 ||  p.y < -height/2 || ( pow(p.x+mouseX/2 - width/2, 2) + pow(p.y-mouseY/2 + height/2, 2) ) < a ) {
                particles.splice(i,1);
                currentParticle--;
                particles.push(new Particle(-width/2, random(-height/2, height/2),t,h) );
              //splicing the particle so it doesn't just keep creating new ones
            }
        }
  
  fill(0, 200);
  stroke(0);
  ellipse(mouseX-width/2, mouseY-height/2,(a-1)*2,(a-1)*2);
	
	if(mouseIsPressed && a < 210){
		a +=1;
      //using mousepressed to control the radius of the circle
	} else a+=0;
	
}

let P = (t, x, y) => Strength*( v- (v*(a*a)*(pow( x + mouseX-width/2, 2)-pow( y - mouseY+height/2, 2)))/((pow( x + mouseX-width/2, 2)+pow( y - mouseY+height/2, 2))*(pow( x + mouseX-width/2, 2)+pow( y - mouseY+height/2, 2)))  );


//pow(x + mouseX - width/2, 2) --> squared horizontal distance from a point to the center of the canvas
//pow( y - mouseY+height/2, 2))) --> squared vertical distance 
// v = velocity
//This represents a mathematical field — possibly an electric or gravitational potential — or a distortion field in graphics



let Q = (t, x, y) => Strength*(  (-2*v*(a*a)*(x+mouseX-width/2)*(y-mouseY+height/2))/((pow( x + mouseX-width/2, 2)+pow( y - mouseY+height/2, 2))*(pow( x + mouseX-width/2, 2)+pow( y - mouseY+height/2, 2))) );

//Define particles and how they are moved with Runge–Kutta method of 4th degree.
//This is a variation of the taylor series used to solve for differential equations. Here it's likely calculating the curve between the two points 
class Particle{
  //using class to push particles
    
   constructor(_x, _y, _t, _h){
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(3, 4);
     //radius of individual circles randomnized
    this.h = _h;
    this.op = random(199,200);
    this.r = random(10);
    this.g = random(164,255);
    this.b = random(255);
     //blue to greenish circles
	}
    
    update() {
        this.k1 = P(this.time, this.x, this.y);
        this.j1 = Q(this.time, this.x, this.y);
        this.k2 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.j2 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.k3 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.j3 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.k4 = P(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.j4 = Q(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.time += this.h;
      //this following the Runge–Kutta method of 4th degree
      //k1 = hf(x0, y0)

      //k2 = hf[x0 + (½)h, y0 + (½)k1]

      //k3 = hf[x0 + (½)h, y0 + (½)k2]

      //k4 = hf(x0 + h, y0 + k3)
    }
    
    display() {
        fill(this.r, this.b, this.g, this.op);
        noStroke();
        //this.updatex = map(this.x, -7, 7, -width, width);
        //this.updatey = map(-this.y, -5, 5, -height, height);
        ellipse(-this.x, this.y, 2*this.radius, 2*this.radius);
    }
    
}

function traceShow() {
  //function for toggling between the rectangles
		noCursor();
    if(trace==false) {
        trace = true;
    }else{
        trace = false;
    }
}

function doubleClicked() {
  //double click to reset the size of the black hole
  if (a > 10) {
    a = 0.02;
  }
}