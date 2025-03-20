let handPose;
let video;
let hands = [];
let painting;
let px = 0;
let py = 0;
let nextDrawTime;
let circles = [];
let womb;
let fullscreenStarted = false;
let soundFile;
let pitchShifter;

function preload() {
  handPose = ml5.handPose();
  particleImage = loadImage('hand_point.png')
  loadImage('hand_left.png')
  womb = loadImage('womb.png')
  soundFile = loadSound('touch_sound.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // painting = createGraphics(640, 480);
  // painting.clear();

  video = createCapture(VIDEO);
  video.hide();
  handPose.detectStart(video, gotHands);
  
  // pitchShifter = new p5.PitchShift(); // Initialize pitch shifter after loading p5
  // soundFile.disconnect(); // Ensure the sound is disconnected initially
  // soundFile.connect(pitchShifter); // Connect sound file to pitch shifter
  
  nextDrawTime = frameCount + int(random(60, 180));
}

function draw() {
  video.size(windowWidth, windowHeight);
resizeCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  background(0);
  
  // Draw video to canvas
  image(video, width / 2, height / 2, windowWidth, windowHeight);
  // tint(255, 188);
  // image(womb, width / 2, height / 2, height - 80, height - 80);
  noStroke();

  for (let i = circles.length - 1; i >= 0; i--) {
    let obj = circles[i];
    obj.display();
    // console.log(obj.x, obj.y);
      // pitchShifter.shift(pitchValue);
    
    if (obj.finished()) {
      circles.splice(i, 1); // Remove the circle if it has faded out
      nextDrawTime = frameCount + int(random(60, 180));
    }
  }

  if (frameCount === nextDrawTime) {
    let newObj = new Circle(
      random(windowWidth / 2 - windowHeight/2 + 120, windowWidth / 2 + windowHeight/2 - 120),
      random(120, windowHeight - 120),
      random(20, 30)
    );
    circles.push(newObj);
  }

  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip; // Get the index finger tip
    // console.log(index.x, index.y);

    // Scale the coordinates to match canvas dimensions

    for (let i = 0; i < circles.length; i++) {
      let obj = circles[i];

      if (dist(obj.x, obj.y, index.x, index.y) < 70) {
        obj.checkOver();
      }
    }
  }
  filter(BLUR, 3);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
  }
}