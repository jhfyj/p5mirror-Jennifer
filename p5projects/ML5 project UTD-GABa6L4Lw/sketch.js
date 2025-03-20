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
let imageOpacity = 50;

function preload() {
  handPose = ml5.handPose();
  particleImage = loadImage("hand_point.png");
  loadImage("hand_left.png");
  womb = loadImage("womb.png");
  soundFile = loadSound("touch_sound.mp3");
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
  resizeCanvas(windowWidth, windowHeight);

  video.size(width, height);
  imageMode(CENTER);
  image(video, width / 2, height / 2, width, height);
  // background(0);
  tint(255, imageOpacity);
  image(womb, width / 2, height / 2, height - 80, height - 80);
  stroke(8);

  for (let i = circles.length - 1; i >= 0; i--) {
    let obj = circles[i];
    obj.display();
    text(obj.x, width/2, height/2 - 50);
    text(obj.y, width/2, height/2);
    
    if (obj.finished()) {
      circles.splice(i, 1); // Remove the circle if it has faded out
      nextDrawTime = frameCount + int(random(60, 180));
    }
  }
  
    for (let i = 0; i < circles.length - 1; i++) {
    circles[i].displayLine(circles[i + 1]);
  }

  if (frameCount === nextDrawTime) {
    let newObj = new Circle(
      random(
        width / 2 - height / 2 + 120,
        width / 2 + height / 2 - 120
      ),
      random(120, height - 120),
      random(20, 30)
    );
    circles.push(newObj);
  }

  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip; // Get the index finger tip
    for (let i = 0; i < circles.length; i++) {
      let obj = circles[i];
      text(index.x, width/2 + 200, height/2 - 50);
       text(index.y, width/2 + 200, height/2);
      // let ?????
      // let zDifference = abs(this.z - indexZ);
      if (dist(obj.x, obj.y, index.x, index.y) < 40) {
        obj.checkOver();
      }
    }
  }
  // filter(BLUR, 3);
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
