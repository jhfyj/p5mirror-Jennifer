
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/TbX6qOHde/";

// Video
let video;
let label = "";
let Circle;
let Heart;
let Rhombus;
let Triangle;
let fullscreenStarted = false;
let currentVideo = null;

//////////////////////////
//simplified template. for longer story //https://editor.p5js.org/rios/sketches/wtZvFIkW5
//
const askForPort = true; //true first time to pick port, then change to false
const serial = new p5.WebSerial();
let portButton;
let inData;
let outData;


// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json", {
    flipped: true,
  });
  
  Circle = createVideo(['circle.mp4']);
  Heart = createVideo(['heart.mp4']);
  Rhombus = createVideo(['rhombus.mp4']);
  Triangle = createVideo(['triangle.mp4']);
  Circle.hide(); 
  Rhombus.hide(); 
  Triangle.hide(); 
  Heart.hide(); 
}

function setup() {
  // setInterval(classifyVideo, 1000);
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO, { flipped: true });
  video.size(320, 240);
  video.hide();
  classifier.classifyStart(video, gotResult);
  
  Circle.onended(() => currentVideo = null);
  Heart.onended(() => currentVideo = null);
  Rhombus.onended(() => currentVideo = null);
  Triangle.onended(() => currentVideo = null);
  
  /////////////////////////////////////
    if (askForPort) {
    makePortButton();
  } else {
    serial.getPorts(); //skip the button use port from last time
  }
  serial.on("portavailable", openPort);
  serial.on("data", serialEvent);
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  image(video, width/2, height/2);
  background(0);
  imageMode(CENTER);
  
  if (currentVideo === null) {
    if (label === "rhombus") {
      currentVideo = Rhombus;
      serial.write("40\n");
    } else if (label === "circle") {
      currentVideo = Circle;
      serial.write("20\n");
    } else if (label === "triangle") {
      currentVideo = Triangle;
      serial.write("30\n");
    } else if (label === "heart") {
      currentVideo = Heart;
      serial.write("10\n");
    } else if(label === "nothing"){
      currentVideo = Heart;
      serial.write("10\n");
    }
    
    
    
    // Play the current video if it’s been set and display it on the canvas
    if (currentVideo) {
      currentVideo.play();
    }
  }
    if (currentVideo) {
    image(currentVideo, width / 2, height / 2);
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(results) {
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
}

function keyPressed() {
  if (!fullscreen()) {
    fullscreen(true);
    fullscreenStarted = true; // Track if fullscreen has started
  }
}
//////////////////////////
/////////////////////////////
// A CALLBACK FUNCTION CALLED WHEN DATA COMES IN  ///  
/////////////////////////////

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString) {
    inData = split(inString, ",");
  }
}

/////////////////////////////////////////////
// UTILITY FUNCTIONS TO MAKE CONNECTIONS  ///
/////////////////////////////////////////////


function openPort() {
  serial.open()
  if (portButton) portButton.hide();
}

// This is a convenience for picking from available serial ports:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(() =>serial.requestPort());
}

