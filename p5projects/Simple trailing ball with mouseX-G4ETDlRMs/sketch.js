let trail = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  
  
  // Create a vector for the ball at the mouseX position
  let ball = createVector(mouseX, height / 2);
  trail.push(ball);
  noStroke();

  // Limit the trail length to 50
  if (trail.length > 50) {
    trail.splice(0, 1);
  }

  // Set up the glow and blur effect
  drawingContext.shadowBlur = 30; // Adjust the blur intensity
  drawingContext.shadowColor = color(255); // White glow effect

  // Draw the trail and the ball
  noFill();
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i];
    let size = map(i, 0, trail.length, 10, 30);  // Ball size changes with trail position
    fill(255, 255 - i * 5);  // Fading trail effect
    ellipse(pos.x, pos.y, size, size);
  }
}