
let ps = [];
function setup() {
  createCanvas(400, 400);
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
  ps.push(new System(mouseX, height/2));
}