let gifs = [1];
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
  createCanvas(2000, 2000);

  // Initialize GIFs
  for (let i = 0; i < gifCount; i++) {
    spawnGif();
  }
  
  // Start spawning GIFs every second
  setInterval(spawnGif, spawnInterval);
}

function spawnGif() {
  let gifWidth = 100;
  let gifHeight = (gifWidth / gifWidths[0]) * gifHeights[0]; // Use the first GIF's dimensions for simplicity

  let x, y;
  // Generate positions outside of the circle
  do {
    x = random(0, width - gifWidth);
    y = random(0, height - gifHeight);
  } while (dist(x + gifWidth / 2, y + gifHeight / 2, width / 2, height / 2) < circleRadius);

  gifPositions.push(createVector(x, y));
  opacities.push(255); // Start fully opaque
}

function draw() {
  background(0);

  // The center where gifs will gradually disappear
  let centerX = width / 2;
  let centerY = height / 2;


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
      let NdistanceToCenter = distanceToCenter - 250
      // 250 represent the radius of the inner circle
      opacities[i] = map(NdistanceToCenter, distanceToCenter, 0, 255, 0); // Fade out completely when at the edge
    }

    // Calculate width and height for rendering
    let gifWidth = 100; // Desired width for resizing
    let gifHeight = (gifWidth / gifWidths[i % gifWidths.length]) * gifHeights[i % gifHeights.length]; // Maintain aspect ratio

    // Set the fill color with opacity
    tint(255, max(opacities[i], 0)); // Set the opacity for the GIF, ensuring it doesn't go below 0
    image(gifs[i % gifs.length], pos.x, pos.y, gifWidth, gifHeight); // Draw the GIF

    // Stop drawing the GIF if it's fully transparent
    if (opacities[i] <= 0) {
      opacities[i] = 0; 
    }
  }
}


