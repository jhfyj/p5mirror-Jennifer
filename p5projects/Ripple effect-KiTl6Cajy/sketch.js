
let particles = []; let num = 50;

function setup() {
  createCanvas(400, 400);
  p = new Particle(width/2, height/2);
}

function draw() {
  background(0,0,0,150);
  
  //particles.push(new Particle(width/2, height/2));
  
  for (let i = particles.length - 1; i >= 0; i--){
    particles[i].update();
    particles[i].display();
    
    if (particles[i].done){
      particles.splice(i, 1);
    } 
  }
  
}

function mouseClicked(){
  for(let i = 0; i < num; i++){
    particles.push(new Particle(mouseX, mouseY));
  }
}
    
