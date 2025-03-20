//simplified template. for longer story //https://editor.p5js.org/rios/sketches/wtZvFIkW5
//
const askForPort = true; //true first time to pick port, then change to false
const serial = new p5.WebSerial();
let portButton;
let inData;
let outData;

function setup() {
  createCanvas(windowWidth, windowHeight); // make the canvas
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
  ellipseMode(CENTER);
}

////////////
// DRAW  ///
////////////
function draw() {
  background(255);
  if (inData) {
    let sensor1 = inData[0];
    let size = map(sensor1, 0, 1024, 0, width);
    ellipse(width/2, height/2, size, size);
    fill(0,0,0);
    text("Input " + sensor1 + ", " + sensor2, 100, 100);
  }
}

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


function mouseDragged() {
  //send mouse to arduino
  //ceil makes it into an integer
  mpos = ceil(map(mouseX, 0, width, 0, 255));
  //mpos = constrain(mpos,0,255);
  serial.write(mpos);
  console.log(mpos);
  
}


/////////////////////////////////////////////
// UTILITY FUNCTIONS TO MAKE CONNECTIONS  ///
/////////////////////////////////////////////

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
