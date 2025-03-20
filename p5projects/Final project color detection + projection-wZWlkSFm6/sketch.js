let video;
let positions = [];
let colorData = [null, null, null, null];
let originalColor = [null, null, null, null];
let colorFrozen = [false, false, false, false];
let freezeTime = [null, null, null, null];
let fullscreenStarted = false;
let bgo = 0;
let checkInterval = 500; // Interval in milliseconds for pixel loading
let lastCheckTime = 0;

// Individual video variables
let video0, video1, video2;
let currentVideo = null; // Tracks the current video being played
let videoStarted = false;
let delayTimer;
let clickCount = 0; // Counter to track the number of clicks

let images = [];
let imageCount = 7
let flowersVisible = false; // Controls whether flowers are shown

////////////////////////////////////
////////////////////////
//simplified template. for longer story //https://editor.p5js.org/rios/sketches/wtZvFIkW5

const askForPort = true; //true first time to pick port, then change to false
const serial = new p5.WebSerial();
let portButton;
let inData;
let outData;


function preload() {
  // Load videos individually
  video0 = createVideo("./Video0.mp4");
  video1 = createVideo("./Video1.mp4");
  video2 = createVideo("./Video2.mp4");

  for (let i = 5; i <= 11; i++) {
    images.push(loadImage(`flowers${i}.png`)); // Replace with your image path if needed
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);

  video.size(width, height);
  video.hide();
  colorMode(RGB, 255);

  // Setup individual videos
  setupVideo(video0);
  setupVideo(video1);
  setupVideo(video2);


//     ///////////////////////////////////
//     if (askForPort) {
//       makePortButton();
//     } else {
//       serial.getPorts(); //skip the button use port from last time
//     }
//     serial.on("portavailable", openPort);
//     serial.on("data", serialEvent);
}

function setupVideo(vid) {
  vid.size(700, 525);
  vid.hide(); // Hide video elements
  vid.onended(handleVideoEnd); // Handle video end
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  console.log(windowHeight);
  // Only load pixels at specified intervals
  if (millis() - lastCheckTime > checkInterval) {
    video.loadPixels(); // Ensure we're working with the latest frame
    lastCheckTime = millis();
  }

  // Display the webcam feed on the canvas
  image(video, 0, 0, width, height);

  // Loop through the positions and store the most recent color for each circle
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];
    let colorAtPos = getAverageColor(pos.x, pos.y); // Get averaged color

    if (!colorFrozen[i]) {
      if (originalColor[i]) {
        let colorDiff = colorDifference(originalColor[i], colorAtPos);
        if (colorDiff > 50 && freezeTime[i] === null) {
          freezeTime[i] = millis();
        }
      } else {
        originalColor[i] = colorAtPos;
      }

      if (freezeTime[i] !== null && millis() - freezeTime[i] > 1500) {
        colorFrozen[i] = true;
      }

      if (!colorFrozen[i]) {
        colorData[i] = colorAtPos;
      }
    }

    // Draw a circle at the sample position to show where we're sampling
    fill(colorData[i] || colorAtPos);
    stroke(0);
    strokeWeight(4);
    ellipse(pos.x, pos.y, 20, 20);
  }

  // Draw four rectangles using the stored color from each color array
  let rectWidth = width / 4;
  for (let i = 0; i < 4; i++) {
    if (colorData[i]) {
      fill(colorData[i]);
      noStroke();
      rect(i * rectWidth, height - 100, rectWidth, 100);
    }
  }
  background(0, bgo);
  // Set background to black and start video when fourth color freezes
  if (colorFrozen[3] && !videoStarted) {
    bgo = 255;
    videoStarted = true;
    setTimeout(() => {
      playVideo(video0); // Start the first video
    }, 5000);
  }



  // Display the current video if started
  if (videoStarted && currentVideo) {
    imageMode(CENTER);
    // Update position based on the current video
    if (currentVideo === video0) {
      // serial.write(1);
      image(currentVideo, 350, windowHeight / 2); // Position video to the left
    } else if (currentVideo === video1) {
      image(currentVideo, windowWidth - 350, windowHeight / 2); // Position video in the center
    } else if (currentVideo === video2) {
      image(currentVideo, windowWidth - 350, windowHeight / 2); // Position video to the right
    }
  }
  if (flowersVisible) {  
      for (let i = 0; i < 3; i++) {
        if (images[i] && colorData[i]) {
          tint(colorData[i]); // Apply the corresponding color from colorData
          imageMode(CENTER);
          image(images[i], 300, windowHeight / 2 - 50, 1280 * 7/16, 1602 * 7/16); // Adjust size as needed
        }
    }
    noTint(); // Clear the tint effect after drawing flowers
  }
}

function mousePressed() {
  if (
    positions.length < 4 &&
    mouseX >= 0 &&
    mouseX < width &&
    mouseY >= 0 &&
    mouseY < height
  ) {
    positions.push(createVector(mouseX, mouseY));
  }

    // Increment the click counter
    clickCount++;

    // If 4 clicks have been registered, set bgo to 255
    // if (clickCount >= 4) {
    //   bgo = 255;
    // }
}

// Play the specified video
function playVideo(video) {
  currentVideo = video;
  // video.show();
  video.play();
}

// Handle video end to play the next video
function handleVideoEnd() {

  if (currentVideo === video0) {
    currentVideo.hide();
    setTimeout(() => {
      showFlowers(); // Show flowers after a delay
    }, 2000); // 2-second delay before showing flowers
    noTint();
    // serial.write(1);
    delayTimer = setTimeout(() => playVideo(video1), 7000); // 7-second delay before playing the next video
  } else if (currentVideo === video1) {
    // serial.write(1);
    imageMode(CENTER);
    image(currentVideo, windowWidth / 2, windowHeight / 2); // Position video at the center
    delayTimer = setTimeout(() => playVideo(video2), 2000);
  } else if (currentVideo === video2) {
    imageMode(CENTER);
    image(currentVideo, windowWidth - (290), windowHeight / 2); // Position video to the right

    currentVideo.hide(); // Hide the last video
    //serial.write(2);
  }
}

function showFlowers() {
  flowersVisible = true; // Set flowers to be visible
}

// Calculate color difference
function colorDifference(c1, c2) {
  let r1 = red(c1);
  let g1 = green(c1);
  let b1 = blue(c1);
  let r2 = red(c2);
  let g2 = green(c2);
  let b2 = blue(c2);

  return dist(r1, g1, b1, r2, g2, b2);
}

// Get averaged color at a position
function getAverageColor(x, y, size = 0) {
  let r = 0,
    g = 0,
    b = 0;
  let count = 0;
  for (let dx = -size; dx <= size; dx++) {
    for (let dy = -size; dy <= size; dy++) {
      let col = video.get(x + dx, y + dy);
      r += red(col);
      g += green(col);
      b += blue(col);
      count++;
    }
  }
  return color(r / count, g / count, b / count);
}


function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
  }
}

////////////////////////
///////////////////////////A CALLBACK FUNCTION CALLED WHEN DATA COMES IN  ///  
///////////////////////////

// function serialEvent() {
//   // read a string from the serial port
//   // until you get carriage return and newline:
//   let inString = serial.readStringUntil("\r\n");
//   //check to see that there's actually a string there:
//   if (inString) {
//     inData = split(inString, ",");
//   }
// }


// function openPort() {
//   serial.open()
//   if (portButton) portButton.hide();
// }

// // This is a convenience for picking from available serial ports:
// function makePortButton() {
//   // create and position a port chooser button:
//   portButton = createButton("choose port");
//   portButton.position(10, 10);
//   // give the port button a mousepressed handler:
//   portButton.mousePressed(() =>serial.requestPort());
// }

