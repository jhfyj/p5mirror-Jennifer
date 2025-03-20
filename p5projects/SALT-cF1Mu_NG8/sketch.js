      let numCircles = 120; 

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);
    fill(255, 50);
    noStroke(0);

    
    // Center position
    let centerX = width / 2;
    let centerY = height / 2;
    
    // Loop to draw circles in a circular pattern
    for (let i = 0; i < numCircles; i++) {
        // Calculate angle for current circle
      let angle = map(i, 0, numCircles, 0, TWO_PI); // map to a full circle
      let circleRadius = random(5, 13); 
      let distanceFromCenter = random(80, 100); 


        let x = mouseX + cos(angle) * distanceFromCenter;
        let y = centerY + sin(angle) * distanceFromCenter;
        
        // Draw the smaller circle
        circle(x, y, circleRadius);
    }
      drawingContext.shadowBlur = 30; // Adjust the blur intensity
    drawingContext.shadowColor = color(255); // White glow effect
}