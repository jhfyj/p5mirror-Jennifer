let ps = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);
}

function draw() {
  background(0,0,0,150);
  
  if(random() < 0.3){
    ps.push(new System(width/2, height/2));
  }
  
  for(let i = ps.length - 1; i >=  0; i--){
    ps[i].update();
    ps[i].display();
    
    if(ps[i].done){
      ps.splice(i, 1)
    }
  }
  
}
 
