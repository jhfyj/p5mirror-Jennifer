

// How much wiggle-room is allowed when matching the color?
let tolerance = 5;
let numCircles = 500;
let fullscreenStarted = false;
let colorToMatch;
let video;
let showVideo = true;
let videoX = 640/5;
let videoY = 480/5;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // An initial color to look for
  colorToMatch = color(255,150,0);

  // Webcam capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}


function draw() { 
  resizeCanvas(windowWidth, windowHeight);
  noCanvasScroll();
  image(video, 0, 0, videoX, videoY); // Draw the video
  video.hide();
  push();
  background(0, 80);

  // Get the first matching pixel in the image
  let firstPx = findColor(video, colorToMatch, tolerance);
  
  // Ff we got a result (is not undefined) then draw a circle in that location
  if (firstPx !== undefined) {
    fill(255, 90);
    noStroke();
    for (let i = 0; i < numCircles; i++) {
      // Calculate angle for current circle
      let angle = map(i, 0, numCircles, 0, TWO_PI); // map to a full circle
      let circleRadius = random(5, 13);
      let distanceFromCenter = random(80, 100);

      let x = firstPx.x + cos(angle) * distanceFromCenter * 1.5;
      let y = height / 2 + sin(angle) * distanceFromCenter * 3.3;
      x = map(x, 0, 640, 0, windowWidth);
      circle(x, y, circleRadius);
    }
    // drawingContext.shadowBlur = 30; // Adjust the blur intensity
    // drawingContext.shadowColor = color(255,10); // White glow effect
  }
}

// Use the mouse to select a color to track
function mousePressed() {
  loadPixels();
  colorToMatch = get(mouseX, mouseY);

  // Note we use get() here, which is probably ok since it's one pixel – could def do this with pixels[index] too
}


// Find the first instance of a color in an image and return the location
function findColor(input, c, tolerance) {
  
  // If we don't have video yet (ie the sketch just started), then return undefined
  if (input.width === 0 || input.height === 0) {
    return undefined;
  }

  // Grab rgb from color to match
  let matchR = c[0];
  let matchG = c[1];
  let matchB = c[2];

  // Look for the color! In this case, we look across each row working our way down the image – depending on your project, you might want to scan across instead
  input.loadPixels();
  for (let y=0; y<input.height; y++) {
    for (let x=0; x<input.width; x++) {
 
      // Current pixel color
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];

      // If our color detection has no wiggle-room (either the color matches perfectly or isn't seen at all) then it won't work very well in real-world conditions to overcome this, we check if the rgb values are within a certain range – if they are, we consider it a match
      if (r >= matchR-tolerance && r <= matchR+tolerance &&
          g >= matchG-tolerance && g <= matchG+tolerance &&
          b >= matchB-tolerance && b <= matchB+tolerance) {

          // Send back the x/y location immediately (faster, since we stop the loop)
          return createVector(x, y);
      }
    }
  }

  // If no match was found, return 'undefined'
  return undefined;
}


function noCanvasScroll() {
  document.body.style.overflow = 'hidden';
}

function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
    videoX = 1;
    videoY = 1;
  }
}