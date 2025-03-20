let osc, fft;
let radi = 100;
let fullscreenStarted = false;
let ba;
var myImage;

function preload(){
    myImage = loadImage('Background.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(0.5);
  fft = new p5.FFT();
  osc.start();
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  
  background(0);
  
  tint(255, ba);
  image(myImage, -3, -3, windowWidth,windowHeight);

  // Check if fullscreen has started
  if (fullscreenStarted) {
    stroke(207, 7, 99);
    strokeWeight(4);
    noFill();
    
    drawingContext.shadowBlur = 32;
    drawingContext.shadowColor = color(207, 7, 99);
    
    translate(width / 2, height / 2);

    let wave = fft.waveform();

    // Draw circular waveform visualization
    for (var t = -1; t <= 1; t += 2) {
      beginShape();
      for (var i = 0; i <= 150; i++) {
        var index = floor(map(i, 0, 150, 0, wave.length - 1));
        var r = map(wave[index], -1, 1, 300, 500);
        var x = r * sin(i) * t;
        var y = r * cos(i);
        vertex(x, y);
      }
      endShape();
    }

    // Get the distance from the mouse to the center of the screen
    let distToMouse = dist(mouseX, mouseY, width / 2, height / 2);

    // Check if the mouse is inside the circle with a radius of 480 / 2
    if (distToMouse <= 500 / 2) {
      // Calculate the angle theta relative to the center
      let theta = atan2(mouseY - height / 2, mouseX - width / 2);
      
      ba = 0;

      // Adjust theta to range from 0 to TWO_PI
      if (theta < 0) {
        theta += TWO_PI;
      }
  let frequ;
    if (theta <= PI){
    frequ = map(theta, 0, PI, 25, 200); // Frequency mapped to full range
    } else {frequ = map(theta, PI, TWO_PI, 200, 25)
           }
  
    osc.freq(frequ);
    

    let amp1;
    if (theta <= PI){
    amp1 = map(theta, 0, PI, 0.01, 1); // Frequency mapped to full range
    } else {amp1 = map(theta, PI, TWO_PI, 1, 0.01);}
  
    osc.amp(amp1);

      console.log('Amp:', amp1);
      console.log('Freq:', frequ);
    } else (ba = 255);
  }
}

// This function is triggered by mouse clicks
function mousePressed() {
   
  if (dist(mouseX, mouseY, width / 2, height / 2) <= 500 / 2) {
     ba = 0 ;
  }else{
    ba = 255;
  } 
     
  // Enter fullscreen when mouse is pressed
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; 
    
  }
}

// Optional: you can also trigger fullscreen using a key press
function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
  }
}