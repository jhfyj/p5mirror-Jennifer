const askForPort = true;
let portButton;
let inData;
//let sensor1 = 0;
let position;
let fullscreenStarted = false;
let port;
let reader;
let trail = [];

async function setup() {
  createCanvas(400, 400);
  textSize(32);

  if (!("serial" in navigator)) {
    alert("WebSerial is not supported. Please use Chrome.");
    return;
  }

  if (askForPort) {
    makePortButton();
  } else {
    getPorts(); // Retrieve previous port if available
  }
}

function draw() {
  background(0);
  if (!isNaN(inData)) {  // Check if inData is a valid number
    position = map(inData, 0, 400, 0, width); // Adjust range if needed
    text("Distance: " + inData + " cm", 100, 100);
  } else {
    text("Waiting for data...", 100, 100);
  }
  

   background(0);
    fill(255, 50);
    noStroke(0);
    
    // Center position
    let centerX = width / 2;
    let centerY = height / 2;
    let numCircles = 120; 
    
    // Loop to draw circles in a circular pattern
    for (let i = 0; i < numCircles; i++) {
        // Calculate angle for current circle
        let angle = map(i, 0, numCircles, 0, TWO_PI); // map to a full circle
      let circleRadius = random(5, 13); 
      let distanceFromCenter = random(80, 100); 


        let x = position + cos(angle) * distanceFromCenter;
        let y = centerY + sin(angle) * distanceFromCenter;
        
        // Draw the smaller circle
        circle(x, y, circleRadius);
    }
      drawingContext.shadowBlur = 30; // Adjust the blur intensity
    drawingContext.shadowColor = color(255); // White glow effect
}


//function serialEvent(value) {
 // inData = value.split(",");
//}

function serialEvent(value) {
  console.log("Received data:", value); // Check if data is being received
  inData = parseInt(value.trim()); // Convert to an integer
}

async function openPort(selectedPort) {
  try {
    port = selectedPort;
    await port.open({ baudRate: 9600 });
    if (portButton) portButton.hide();

    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    readSerialData(); // Begin reading data
  } catch (error) {
    console.error("Failed to open serial port:", error);
    alert("Failed to open serial port. Please try again.");
  }
}

async function readSerialData() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("Stream closed.");
      reader.releaseLock();
      break;
    }
    serialEvent(value.trim());
  }
}

function makePortButton() {
  portButton = createButton("Choose Port");
  portButton.position(10, 10);
  portButton.mousePressed(requestPort);
}

async function requestPort() {
  try {
    const selectedPort = await navigator.serial.requestPort();
    openPort(selectedPort);
  } catch (error) {
    console.error("Port selection was canceled.");
  }
}
