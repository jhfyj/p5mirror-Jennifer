let Petals;
let Layers = 10;
let Radius = 30;
let increaseRadius = 20;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES); // Use degrees for easier rotation calculation
  
  PetalsSlider = createSlider(3, 20, 8, 1);
  PetalsSlider.position(10, height + 10);
  PetalsSlider.size(200);
  
  LayersSlider = createSlider(1, 10, 2, 1);
  LayersSlider.position(10, height + 30);
  LayersSlider.size(200);
  
  IRSlider = createSlider(5, 30, 20, 2.5);
  IRSlider.position(10, height + 50);
  IRSlider.size(200);
  

}

function draw() {
  background(0);
  
  Petals = PetalsSlider.value();
  Layers = LayersSlider.value();
  increaseRadius = IRSlider.value();
  
  
  
  translate(width / 2, height / 2); // Move to the center of the canvas

  stroke(150, 50, 200); // Set line color
  strokeWeight(2); // Line thickness

  for (p = Layers; p > 0; p--) {
    let currentRadius = Radius + increaseRadius * (p - 1);
    for (i = 0; i < Petals; i++) {
      fill(
        150 + p * (105 / (Layers + 0.5)),
        50 + p * (205 / (Layers + 0.5)),
        200 + p * (45 / (Layers + 0.5))
      );

      curve(
        -currentRadius,
        0,
        0,
        0,
        0,
        currentRadius,
        -currentRadius,
        currentRadius
      );

      curve(
        currentRadius,
        0,
        0,
        0,
        0,
        currentRadius,
        currentRadius,
        currentRadius
      );

      rotate(360 / Petals);
    }
    if (p % 2 === 0) {
      rotate(360 / (2 * Petals)); // Offset rotation for even layers
    }
  }

  fill(200, 180, 0);
  noStroke();
  ellipse(0, 0, 20, 20);
}
