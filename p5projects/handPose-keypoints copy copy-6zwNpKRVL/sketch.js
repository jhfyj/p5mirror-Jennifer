let ps = []; // this is for the system
//let backgrounds = [];
let repeatCount = 0;
let maxRepeats = 7;
let p = null;
let Speed = 1;

let handPose;
let video;
let hands = [];
let open = false;
let pushed = false;

let prevHandPos = null; // Stores previous position of keypoint 9
let moveThreshold = 140; // Distance threshold for detecting movement

let particleGenerated = false; // Track if a particle has been generated for movement

let backgroundVideo;

let water1, water2, water3, water4;
let water = [];

let started = false;
let font;
let a = 255;
let increasing = true;

let backgroundmusic;
let backgroundmusicplaying = false;

function preload() {
   backgroundmusic = loadSound("guzhen.MP3", () => {
    console.log("Background music loaded");
  });
  handPose = ml5.handPose();
  water1 = loadSound("water1.MP3");
  water2 = loadSound("water2.MP3");
  water3 = loadSound("water3.MP3");
  water4 = loadSound("water4.MP3");

  water = [water1, water2, water3, water4];
  backgroundVideo = createVideo("background.mp4"); // Ensure the file exists
  font = loadFont("KingsguardCalligraphy.otf", () => {
    console.log("font loaded");
  });
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  backgroundVideo.size(windowWidth, windowHeight);
  backgroundVideo.loop(); // Ensures the video plays continuously
  backgroundVideo.hide(); // Prevents default HTML video display
  backgroundVideo.volume(0);
}

function draw() {
  // Draw the webcam video
  resizeCanvas(windowWidth, windowHeight);
  background(0, 0, 0, 255);
  
  push();
  translate(width, 0); // Move origin to right
  scale(-1, 1); // Flip horizontally
  rectMode(CORNER);

  // backgroundVideo.play();
  backgroundVideo.speed(Speed);
  image(backgroundVideo, 0, 0, windowWidth, windowHeight);

  for (let i = ps.length - 1; i >= 0; i--) {
    ps[i].update();
    ps[i].display();

    if (ps[i].done == true) {
      this.resetTimeout = setTimeout(() => {}, 7000);
      console.log("Speed reset to 1 after 3 seconds");
      Speed = 1;
    }

    if (ps[i].done) {
      ps.splice(i, 1);
    }
  }
  


  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    // for (let j = 0; j < hand.keypoints.length; j++) {
    //   let keypoint = hand.keypoints[j];
    //   fill(0, 255, 0);
    //   noStroke();
    //   circle(keypoint.x, keypoint.y, 10);
    // }
    if (isHandOpen(hand)) {
      // fill(255, 0, 0);
      // textSize(32);
      // text("Hand is OPEN", 50, 50);
      open = true;
    } else {
      // fill(0, 0, 255);
      // textSize(32);
      // text("Hand is CLOSED", 50, 50);
      open = false;
      pushed = false;
    }

    if (open == true && pushed == false) {
      let handposition = hand.keypoints[9];

      p = new Particle(handposition.x, handposition.y);
      ps.push(new System(handposition.x, handposition.y));
      for (let i = 0; i < 3; i++) {
        setTimeout(
          () => ps.push(new System(handposition.x, handposition.y)),
          200 + i * 200
        );

        Speed = 4;
        pushed = true;

        let soundIndex = floor(random(0, 3));
        if (!water[soundIndex].isPlaying()) {
          water[soundIndex].play();
        }
      }
    }
    let currentHandPos = hand.keypoints[9];

    fill(255);

    if (open) {
      stroke(255);
      strokeWeight(5);
      noFill();
      circle(currentHandPos.x, currentHandPos.y, 15, 15);
    } else if (!open) {
      circle(currentHandPos.x, currentHandPos.y, 10, 10);
      // Speed = 1;
    }

    if (prevHandPos) {
      // Calculate distance moved
      let distanceMoved = dist(
        currentHandPos.x,
        currentHandPos.y,
        prevHandPos.x,
        prevHandPos.y
      );

      // Check if movement is significant
      if (distanceMoved > moveThreshold && open == true) {
        // fill(0, 255, 0);
        // textSize(32);
        // text("Hand MOVED", 50, 100);

        for (let i = 0; i < 3; i++) {
          setTimeout(
            () => ps.push(new System(currentHandPos.x, currentHandPos.y)),
            200 + i * 200
          );
          particleGenerated = true;
        }

        Speed = 4;
        let soundIndex = floor(random(0, 3));
        if (!water[soundIndex].isPlaying()) {
          water[soundIndex].play();
        }
      } else if (distanceMoved < moveThreshold * 0.8) {
        particleGenerated = false;
      }
    }
    // Update previous hand position for next frame
    prevHandPos = { x: currentHandPos.x, y: currentHandPos.y };
  }
    pop();
  noStroke();
  if (started == false) {
    textSize(35);

    if (a >= 255) {
      increasing = false;
    } else if (a <= 150) {
      increasing = true;
    }

    if (increasing) {
      a = a + 1.5;
    } else {
      a = a - 1.5;
    }

    fill(255, a);
    textAlign(CENTER, CENTER);
    textFont(font);
    text(
      "Click to enter a new realm. Open, close, and wave one hand to interact",
      windowWidth / 2,
      windowHeight / 2 - 30
    );
    text(
      "'Finding peace within yourself and the world around you is the greatest achievement of all'",
      windowWidth / 2,
      windowHeight / 2 + 30
    );
  }

  
}

function isHandOpen(hand) {
  let threshold = 100; // Adjust based on testing

  let thumbTip = hand.keypoints[4];
  let indexTip = hand.keypoints[8];
  let middleTip = hand.keypoints[12];
  let ringTip = hand.keypoints[16];
  let pinkyTip = hand.keypoints[20];

  let indexKnuckle = hand.keypoints[5];
  let middleKnuckle = hand.keypoints[9];
  let ringKnuckle = hand.keypoints[13];
  let pinkyKnuckle = hand.keypoints[17];

  // Measure distances
  let indexDist = dist(indexTip.x, indexTip.y, indexKnuckle.x, indexKnuckle.y);
  let middleDist = dist(
    middleTip.x,
    middleTip.y,
    middleKnuckle.x,
    middleKnuckle.y
  );
  let ringDist = dist(ringTip.x, ringTip.y, ringKnuckle.x, ringKnuckle.y);
  let pinkyDist = dist(pinkyTip.x, pinkyTip.y, pinkyKnuckle.x, pinkyKnuckle.y);

  // If most fingers are extended, consider the hand open
  if (
    indexDist > threshold &&
    middleDist > threshold &&
    pinkyDist > threshold
  ) {
    return true; // Hand is open
  } else {
    return false; // Hand is closed
  }
}

function mousePressed() {
      if (!backgroundmusicplaying) {
        backgroundmusic.loop();
        backgroundmusicplaying = true;
    }
    backgroundVideo.play();
    fullscreen(true);
    started = true;
}

class System {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.particles = [];
    this.num = 150;
    for (let i = 0; i < this.num; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
    //console.log("hello");
    this.done = false;
  }

  update() {
    this.finished();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();

      if (this.particles[i].done) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }

  finished() {
    if (this.particles.length == 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
}

function startVideo() {
  let videoElement = document.getElementById("backgroundVideo");
  if (videoElement && videoElement.paused) {
    videoElement
      .play()
      .catch((error) => console.log("Autoplay blocked:", error));
  }
}

// Modify gotHands() to trigger startVideo() when a hand appears
function gotHands(results) {
  hands = results;
}
