let graphX = 200;
///////////////////// ^^ controls circle radius
let graphY = 200;
let graphAmplitude = 6;
let graphPeriod = 12;
//////^^ controls height
/////////////////////////////////////
let circleX = 100;
let circleY = 300;
let circleRadius = 70;

let Distance = 250;

let Background;

let shiftheight = 350;

function preload() {
  myJSON = loadJSON("data.json");
}

function setup() {
  createCanvas(1500, 900);
  Background = loadImage("Background.png");

  day = myJSON.day;
  sleep = myJSON.sleep;
  Month = myJSON.Month;
}

function draw() {
  background(0);
  image(Background, -8, 0);

  textAlign(CENTER);

  let angle = PI / 12;
  for (j = 0; j < 5; j++) {
    for (i = 0; i < 24; i++) {
      ////////////////////SLEEPTIME/////////////////////////
      stroke(55, 152, 232);
      strokeWeight(6);
      arc(
        (j + 1) * Distance,
        300,
        circleRadius * 1.4,
        circleRadius * 1.4,
        (TWO_PI / 24) * sleep[j][0] - PI / 2 - (sleep[j][1] * PI) / (12 * 60),
        (TWO_PI / 24) * sleep[j][2] - PI / 2 - (sleep[j][3] * PI) / (12 * 60)
      );

      ///////////////////WORDS///////////////////
      noStroke();
      fill(255);
      let textsize = 15;
      textSize(textsize);
      text(Month[j], (j + 1) * Distance, 300);
      ///////////////////////TIME/////////////////////////

      strokeWeight(2);
      stroke(255);
      if (i == 0) {
        line((j + 1) * Distance, 215, (j + 1) * Distance, 245);
        strokeWeight(1);
        textSize(10);
        text("0:00", (j + 1) * Distance, 205);
      } else if (i == 11) {
        line((j + 1) * Distance, 355, (j + 1) * Distance, 385);
        strokeWeight(1);
        textSize(10);
        text("12:00", (j + 1) * Distance, 405);
      } else if (i == 5) {
        line((j + 1) * Distance + 55, 300, (j + 1) * Distance + 85, 300);
        strokeWeight(1);
        textSize(10);
        text("6:00", (j + 1) * Distance + 100, 303);
      } else if (i == 17) {
        line((j + 1) * Distance - 55, 300, (j + 1) * Distance - 85, 300);
        strokeWeight(1);
        textSize(10);
        text("18:00", (j + 1) * Distance - 100, 303);
      }

      //////////////////////YAWNS/////////////////////////

      noFill();
      stroke(255, 132, 187);
      strokeWeight(4);

      if (day[j][i] == 0) {
        // arc(j * 150, 300, 100, 100, HALF_PI - ((PI / 12) * i), HALF_PI - ((PI / 12) * i) + PI / 12);
        arc(
          (j + 1) * Distance,
          300,
          circleRadius * 2,
          circleRadius * 2,
          (PI / 12) * i - PI / 2,
          (PI / 12) * i + PI / 12 - PI / 2
        );
      } else {
        beginShape();
        for (
          let c = (PI / 12) * i - PI / 2;
          c <= (PI / 12) * i + PI / 12 - PI / 2;
          c += 0.01
        ) {
          let extrusion = graphAmplitude * day[j][i];
          // if (extrusion > 50) {
          //   extrusion = 40;
          // }

          let sineOffset = extrusion * abs(sin(c * graphPeriod));
          let r = circleRadius + sineOffset; // Adjusted radius
          // console.log(distance);
          let shiftFactor = 0;
          if (extrusion > 50) {
            shiftFactor = map(extrusion, 50, 100, 0, 20);
          } else {
            shiftFactor = 0;
          }

          let pointX =
            circleX * (j + 1) * (Distance / 100) +
            r * cos(c) -
            shiftFactor * cos(c);
          let pointY = circleY + r * sin(c) - shiftFactor * sin(c);
          curveVertex(pointX, pointY);

          // let pointX = circleX * (j + 1) * 2 + r * cos(c);
          // let pointY = circleY + r * sin(c);
          // //////////////////MOUSEHOVER//////////////////////

          strokeWeight(2);
          let tolerance = 3;
          textSize(40);
          text("Number of Yawns = ", width / 2, 500);

          if (dist(mouseX, mouseY, pointX, pointY) < tolerance) {
            textSize(50);
            text(day[j][i], width / 2 + 200, 500);
          }
        }
        strokeWeight(4);
        endShape();
      }
    }
  }

  for (j = 5; j < 10; j++) {
    for (i = 0; i < 24; i++) {
      ////////////////////SLEEPTIME/////////////////////////
      stroke(55, 152, 232);
      strokeWeight(6);
      arc(
        (j + 1 - 5) * Distance,
        300 + shiftheight,
        circleRadius * 1.4,
        circleRadius * 1.4,
        (TWO_PI / 24) * sleep[j][0] - PI / 2 - (sleep[j][1] * PI) / (12 * 60),
        (TWO_PI / 24) * sleep[j][2] - PI / 2 - (sleep[j][3] * PI) / (12 * 60)
      );

      ///////////////////WORDS///////////////////
      noStroke();
      fill(255);
      let textsize = 15;
      textSize(textsize);
      text(Month[j], (j + 1 - 5) * Distance, 300 + shiftheight);
      ///////////////////////TIME/////////////////////////

      strokeWeight(2);
      stroke(255);
      if (i == 0) {
        line(
          (j + 1 - 5) * Distance,
          215 + shiftheight,
          (j + 1 - 5) * Distance,
          245 + shiftheight
        );
        strokeWeight(1);
        textSize(10);
        text("0:00", (j + 1 - 5) * Distance, 205 + shiftheight);
      } else if (i == 11) {
        line(
          (j + 1 - 5) * Distance,
          355 + shiftheight,
          (j + 1 - 5) * Distance,
          385 + shiftheight
        );
        strokeWeight(1);
        textSize(10);
        text("12:00", (j + 1 - 5) * Distance, 405 + shiftheight);
      } else if (i == 5) {
        line(
          (j + 1 - 5) * Distance + 55,
          300 + shiftheight,
          (j + 1 - 5) * Distance + 85,
          300 + shiftheight
        );
        strokeWeight(1);
        textSize(10);
        text("6:00", (j + 1 - 5) * Distance + 100, 303 + shiftheight);
      } else if (i == 17) {
        line(
          (j + 1 - 5) * Distance - 55,
          300 + shiftheight,
          (j + 1 - 5) * Distance - 85,
          300 + shiftheight
        );
        strokeWeight(1);
        textSize(10);
        text("18:00", (j + 1 - 5) * Distance - 100, 303 + shiftheight);
      }

      //////////////////////YAWNS/////////////////////////

      noFill();
      stroke(255, 132, 187);
      strokeWeight(4);

      if (day[j][i] == 0) {
        // arc(j * 150, 300, 100, 100, HALF_PI - ((PI / 12) * i), HALF_PI - ((PI / 12) * i) + PI / 12);
        arc(
          (j + 1 - 5) * Distance,
          300 + shiftheight,
          circleRadius * 2,
          circleRadius * 2,
          (PI / 12) * i - PI / 2,
          (PI / 12) * i + PI / 12 - PI / 2
        );
      } else {
        beginShape();
        for (
          let c = (PI / 12) * i - PI / 2;
          c <= (PI / 12) * i + PI / 12 - PI / 2;
          c += 0.01
        ) {
          let extrusion = graphAmplitude * day[j][i];
          // if (extrusion > 50) {
          //   extrusion = 40;
          // }

          let sineOffset = extrusion * abs(sin(c * graphPeriod));
          let r = circleRadius + sineOffset; // Adjusted radius
          // console.log(distance);
          let shiftFactor = 50;
          if (extrusion > 50) {
            shiftFactor = map(extrusion, 50, 100, 0, 20);
          } else {
            shiftFactor = 0;
          }

          let pointX =
            circleX * (j + 1 - 5) * (Distance / 100) +
            r * cos(c) -
            shiftFactor * cos(c);
          let pointY =
            circleY + r * sin(c) - shiftFactor * sin(c) + shiftheight;
          curveVertex(pointX, pointY);

          // let pointX = circleX * (j + 1) * 2 + r * cos(c);
          // let pointY = circleY + r * sin(c);
          // //////////////////MOUSEHOVER//////////////////////

          strokeWeight(2);
          let tolerance = 3;
          textSize(40);
          text("Number of Yawns = ", width / 2, 500);

          if (dist(mouseX, mouseY, pointX, pointY) < tolerance) {
            textSize(50);
            text(day[j][i], width / 2 + 200, 500);
          }
        }
        strokeWeight(4);
        endShape();
      }
    }
  }
}
