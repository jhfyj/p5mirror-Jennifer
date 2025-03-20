// How much wiggle-room is allowed when matching the color?
let tolerance = 5;
let numCircles = 500;
let fullscreenStarted = false;
let colorToMatch;
let video;
let showVideo = true;
let videoX = 640 / 5;
let videoY = 480 / 5;
let gifs = [];
let gifPositions = [];
let gifCount = 5; // Starting number of GIFs
let gifWidths = [];
let gifHeights = [];
let opacities = [];
const circleRadius = 500; // Radius of the circle
const spawnInterval = 1000; // Time in milliseconds between spawns

function preload() {
  gifs[0] = loadImage("Demon.gif", (img) => {
    gifWidths[0] = img.width;
    gifHeights[0] = img.height;
  });
  gifs[1] = loadImage("Ghost.gif", (img) => {
    gifWidths[1] = img.width;
    gifHeights[1] = img.height;
  });
  gifs[2] = loadImage("Skeleton.gif", (img) => {
    gifWidths[2] = img.width;
    gifHeights[2] = img.height;
  });
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  // An initial color to look for
  colorToMatch = color(255, 150, 0);

  // Webcam capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function spawnGif() {
  let gifWidth = 100;
  let gifHeight = (gifWidth / gifWidths[0]) * gifHeights[0]; // Use the first GIF's dimensions for simplicity

  let xgif, ygif;
  // Generate positions outside of the circle
  do {
    xgif = random(0, windowWidth - gifWidth);
    ygif = random(0, windowHeight - gifHeight);
  } while (
    dist(xgif + gifWidth / 2, ygif + gifHeight / 2, width / 2, height / 2) <
    circleRadius
  );

  gifPositions.push(createVector(x, y));
  opacities.push(255); // Start fully opaque
  for (let i = 0; i < gifCount; i++) {
    spawnGif();
  }
  // Start spawning GIFs every second
  setInterval(spawnGif, spawnInterval);
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
    // drawingContext.shadowBlur = 30; // Adjust the blur intensity
    // drawingContext.shadowColor = color(255,10); // White glow effect

    //////////////////////////////////////GRAPHIC////////////////////////
    let centerX = firstPx.x + cos(angle) * distanceFromCenter * 1.5;
    let centerY = height / 2 + sin(angle) * distanceFromCenter * 3.3;

    // Move and draw GIFs
    for (let i = 0; i < gifPositions.length; i++) {
      let pos = gifPositions[i];

      // distance to the center
      let dx = centerX - (pos.x + 50); // Offset to the center of the GIF
      let dy = centerY - (pos.y + 50); // Offset to the center of the GIF
      let distanceToCenter = dist(pos.x + 50, pos.y + 50, centerX, centerY); // Calculate distance

      // Move towards the center
      pos.x += dx * 0.001; // Adjust the speed (0.05 for faster movement)
      pos.y += dy * 0.001;

      // Gradually decrease opacity until the GIF disappears at the edge of the circle
      if (distanceToCenter < circleRadius + 250) {
        let NdistanceToCenter = distanceToCenter - 250;
        // 250 represent the radius of the inner circle
        opacities[i] = map(NdistanceToCenter, distanceToCenter, 0, 255, 0); // Fade out completely when at the edge
      }

      // Calculate width and height for rendering
      let gifWidth = 100; // Desired width for resizing
      let gifHeight =
        (gifWidth / gifWidths[i % gifWidths.length]) *
        gifHeights[i % gifHeights.length]; // Maintain aspect ratio

      // Set the fill color with opacity
      tint(255, max(opacities[i], 0)); // Set the opacity for the GIF, ensuring it doesn't go below 0
      image(gifs[i % gifs.length], pos.x, pos.y, gifWidth, gifHeight); // Draw the GIF

      // Stop drawing the GIF if it's fully transparent
      if (opacities[i] <= 0) {
        opacities[i] = 0;
      }
      }
    }
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
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      // Current pixel color
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // If our color detection has no wiggle-room (either the color matches perfectly or isn't seen at all) then it won't work very well in real-world conditions to overcome this, we check if the rgb values are within a certain range – if they are, we consider it a match
      if (
        r >= matchR - tolerance &&
        r <= matchR + tolerance &&
        g >= matchG - tolerance &&
        g <= matchG + tolerance &&
        b >= matchB - tolerance &&
        b <= matchB + tolerance
      ) {
        // Send back the x/y location immediately (faster, since we stop the loop)
        return createVector(x, y);
      }
    }
  }

  // If no match was found, return 'undefined'
  return undefined;
}

function noCanvasScroll() {
  document.body.style.overflow = "hidden";
}

function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
    videoX = 1;
    videoY = 1;
  }
}
