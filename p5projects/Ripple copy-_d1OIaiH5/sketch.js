let ps = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);
}

function draw() {
  background(0,0,0,150);
  
  for(let i = ps.length - 1; i >=  0; i--){
    ps[i].update();
    ps[i].display();
    
    if(ps[i].done){
      ps.splice(i, 1)
    }
  } 
}

function mousePressed(){
    ps.push(new System(mouseX, mouseY));
  }
  
  //for(let i = 0; i < 150; i ++){
    //particle.color1[i] = random(150, 180);
    //particle.color2[i] = random(160, 190);
  //}


 
