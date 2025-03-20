let colors;

function setup() {
  createCanvas(400, 400);
  colors = [
    color("#ace1ef"),
    color("#f5aec6"),
    color("#c2f1c0")
  ];
}

function draw() {
  background(255);

  // Set center and radius for the circle
  let x = width / 2;
  let y = height / 2;
  let radius = 100;

  // Draw a smooth gradient by blending colors
  for (let i = 0; i <= 360; i++) {
    let interColor;
    if (i < 120) {
      interColor = lerpColor(colors[0], colors[1], i / 120);
    } else if (i < 240) {
      interColor = lerpColor(colors[1], colors[2], (i - 120) / 120);
    } else {
      interColor = lerpColor(colors[2], colors[0], (i - 240) / 120);
    }

    stroke(interColor);
    strokeWeight(2);
    let angle = radians(i);
    let x1 = x + cos(angle) * radius;
    let y1 = y + sin(angle) * radius;
    line(x, y, x1, y1);
  }
}