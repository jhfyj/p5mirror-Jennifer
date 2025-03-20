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
let laugh = [];
let playCount = 0;
let targetOpacity = 200; // Target opacity for decrease
let opacityIncrement = 200; // Increase opacity on heartbeat
let pulsing = 50;

/////////////arduino side/////////////////
const askForPort = false; //true first time to pick port, then change to false
let serial;
let portButton;
let inData = [];
let outData;
let noFinger = true;

let bpmHistory = [];
const bpmWindowSize = 10; // Number of samples to average
let minBPM = 60; // Minimum BPM to consider for opacity changes

function preload() {
  handPose = ml5.handPose();

  womb = loadImage("womb.png");
  soundFile = loadSound("touch_sound.mp3");
  
    // Adjust this if you have a different number of files
    laugh.push(loadSound("laugh 1.mp3"), loadSound("laugh 2.mp3"), loadSound("laugh 3.mp3"), loadSound("laugh 4.mp3"), loadSound("laugh 5.mp3")); // Names should match the files in the folder
  }

function setup() {
  createCanvas(windowWidth, windowHeight);
  // painting = createGraphics(640, 480);
  // painting.clear();

  video = createCapture(VIDEO);
  video.hide();
  handPose.detectStart(video, gotHands);
  serial = new p5.WebSerial();

  // pitchShifter = new p5.PitchShift(); // Initialize pitch shifter after loading p5
  // soundFile.disconnect(); // Ensure the sound is disconnected initially
  // soundFile.connect(pitchShifter); // Connect sound file to pitch shifter

  nextDrawTime = frameCount + int(random(60, 180));
  
  if (!navigator.serial) {
    alert("WebSerial is not supported Try Chrome ");
  }
  //first time you connect create button to identify port
  if (askForPort) {
    makePortButton();
  } else {
    serial.getPorts(); //skip the button use port from last time
  }
  serial.on("portavailable", openPort);
  serial.on("data", serialEvent);
  textSize(32);
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);

  video.size(width, height);
  imageMode(CENTER);
  translate(video.width, 0); // Move to the right edge of the video
  scale(-1, 1);
  image(video, width / 2, height / 2, width - 230, height);
  // background(0);
  // // tint(255, 10); 
  image(womb, width / 2 - 140 , height / 2, height - 80, height - 80);
  stroke(8);
  
  fill(0, 0, 0, pulsing);
  square(-width, -height, width * 10);  

  for (let i = circles.length - 1; i >= 0; i--) {
    let obj = circles[i];
    obj.display();
    // text(obj.x, width / 2, height / 2 - 50);
    // text(obj.y, width / 2, height / 2);

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
      random(width / 2 - height / 2 + 120, width / 2 + height / 2 - 120),
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
      if (dist(obj.x, obj.y, index.x, index.y) < 40) {
        obj.checkOver1();
      }
    }
  }

  }
  if (inData.length > 0) {
    console.log(inData);
    //turn it into JSON
    let asJSON = {};
    for (let i = 0; i < inData.length; i++) {
      let nameValuePair = inData[i].split("=");
      asJSON[nameValuePair[0].trim()] = int(nameValuePair[1]);
    }
    // text(JSON.stringify(asJSON), 0, 100);

    if (asJSON.IR) {
            // Assuming you have a way to convert IR data to BPM
      let currentBPM = map(asJSON.IR, 80000, 95000, 60, 120); // Example mapping
      bpmHistory.push(currentBPM);

      // Keep only the most recent `bpmWindowSize` values
      if (bpmHistory.length > bpmWindowSize) {
        bpmHistory.shift();
      }

      // Calculate average BPM
      let averageBPM = bpmHistory.reduce((sum, bpm) => sum + bpm, 0) / bpmHistory.length;

      // Map the average BPM to pulsing opacity
      let opacityFromBPM = map(averageBPM, minBPM, 120, 50, 255); // Map BPM to opacity range
      pulsing = constrain(opacityFromBPM, 50, 255); // Set pulsing to the new opacity

      // Gradually decrease opacity over time
      pulsing = lerp(pulsing, targetOpacity, 0.05);
    }
  }
}

function gotHands(results) {
  hands = results;
}

function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
    resizeCanvas(windowWidth, windowHeight);
  }
}
//////////////////////////////////////////////
function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString) {
    noFinger = inString.includes("No finger");
    if (!noFinger) {
      // console.log(inString);
      inData = split(inString, ",");
    }
  }
}

function openPort() {
  serial.open();
  if (portButton) portButton.hide();
}

// This is a convenience for picking from available serial ports:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(() => serial.requestPort());
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


function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString) {
    noFinger = inString.includes("No finger");
    if (!noFinger) {
      // console.log(inString);
      inData = split(inString, ",");
    }
  }
}

function openPort() {
  serial.open();
  if (portButton) { // Only hide if portButton is defined
    portButton.hide();
  }
}

// This is a convenience for picking from available serial ports:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(() => serial.requestPort());
}