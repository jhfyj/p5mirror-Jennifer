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

/////////////arduino side/////////////////
const askForPort = false; //true first time to pick port, then change to false
const serial = new p5.WebSerial();
let portButton;
let inData = []; 
let outData  ;
let noFinger = true; 


function preload() {
  handPose = ml5.handPose();
  particleImage = loadImage("hand_point.png");
  loadImage("hand_left.png");
  womb = loadImage("womb.png");
  soundFile = loadSound("touch_sound.mp3");

  laugh.push(
    loadSound("laugh 1.mp3"),
    loadSound("laugh 2.mp3"),
    loadSound("laugh 3.mp3"),
    loadSound("laugh 4.mp3"),
    loadSound("laugh 5.mp3")
  ); // Names should match the files in the folder
}


function setup() {
  createCanvas(windowWidth, windowHeight);

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
  
  
  video = createCapture(VIDEO);
  video.hide();
  handPose.detectStart(video, gotHands);
  nextDrawTime = frameCount + int(random(60, 180));
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);

  video.size(width, height);
  imageMode(CENTER);
  translate(video.width, 0); // Move to the right edge of the video
  scale(-1, 1);
  image(video, width / 2, height / 2, width - 230, height);
  background(0);

  //////////////////arduino controlling opacity//////////////
  ///////////////////////////////////////////////////////////
  if (noFinger) {
    console.log("NO FINGER");
    return;
  }
  if (inData.length > 0) {
    //turn it into JSON
    let asJSON = {};
    for (let i = 0; i < inData.length; i++) {
      let nameValuePair = inData[i].split("=");
      asJSON[nameValuePair[0].trim()] = int(nameValuePair[1]);
    }
    // text(JSON.stringify(asJSON), 0,100);
    if (asJSON.IR) {
      let prepulsing = (asJSON.IR - 80000) / 7;
      pulsing = map(prepulsing, 85000, 100000, 50, 255);
      pulsing = constrain(pulsing, 50, 255);
    }
  }

  // let pulsingheart = map(pulsing, 0, )
  /////////////////////////end of arduino///////////////////////////
  tint(255, pulsing);
  image(womb, width / 2 - 140, height / 2, height - 80, height - 80);
  stroke(8);

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
      // text(index.x, width / 2 + 200, height / 2 - 50);
      // text(index.y, width / 2 + 200, height / 2);
      // let ?????
      // let zDifference = abs(this.z - indexZ);
      if (dist(obj.x, obj.y, index.x, index.y) < 40) {
        obj.checkOver1();
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

//////////////////////////////////////////////
function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString) {
    noFinger = inString.includes("No finger");
    if (!noFinger) {
      //console.log(inString);
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
