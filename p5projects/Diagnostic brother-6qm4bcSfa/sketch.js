let day1 = [
  0,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  2,
  2,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
];

let graphX = 50;
let graphY = 300;
let graphAmplitude = 5;
let graphPeriod = 100;
/////////////////////////////////////
let circleX = 200;
let circleY = 200;
let circleRadius = 100;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  let angle = PI / 12;

  for (i = 0; i < 25; i++) {
    if (day1[i] == 0) {
      arc(200, 200, 100, 100, (PI / 12) * i, (PI / 12) * i + PI / 12);
    } else {
    }

    noFill();
    stroke("red");

    beginShape();
    for (let c = 0; c <= TWO_PI + QUARTER_PI / 10; c += QUARTER_PI / 10) {
      for (let t = 0; t <= 50; t++) {
        let x = map(t, 0, 50, graphX, graphX + graphPeriod);
        let y = graphY - graphAmplitude * sin(t);
        let distance = dist(0, 0, x, y);
        console.log(distance);
        let pointX = circleX + distance * cos(c);
        let pointY = circleX - distance * sin(c);
        vertex(pointX, pointY);
      }
    }

    endShape();
    // beginShape();
    // for (let t = 0; t <= 50; t++) {
    //   let x = map(t, 0, 50, graphX, graphX + graphPeriod);
    //   let y = graphY - graphAmplitude * sin(t);
    //   vertex(x, y);
    // }
    // endShape();
  }
}
