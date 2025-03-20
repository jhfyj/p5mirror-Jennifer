let offset = 0.0;

function setup(){
  createCanvas(960, 540);
  fill(255);
  stroke(255);
  strokeWeight(3);

  textAlign(CENTER, CENTER);
  textSize(128);
  pixelDensity(2); // High res, slows frame rate
  
  colorMode(RGB, 255, 255, 255, 255); // Set color mode to RGB
}

function draw(){
  frameRate(24);
  background(0);
  objectNeon(400, 400, color(255, 0, 100, 255));
}


function objectNeon(x, y, glowColor){
  glow(glowColor, 50); // Apply glow before drawing

  
  noStroke();
  fill(glowColor);
  circle(x, y, 20);
}

function glow(glowColor, blurriness){
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = glowColor;
}
