const askForPort = true;
let portButton;
let inData;
//let sensor1 = 0;
let position;
let fullscreenStarted = false;
let port;
let reader;

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

  if (inData) {
    sensor1 = parseInt(inData[0]);
    let sensor2 = parseInt(inData[1]);
    text("Input " + inData + ", " + sensor2, 100, 100);
 
  }
 

  position = map(inData, 0, 1000, 0, 400);
  fill(255);
  circle(position, height / 2, 50);
  console.log(position);
}


//function serialEvent(value) {
 // inData = value.split(",");
//}

function serialEvent(value) {
  console.log("Received data:", value); // Check if data is being received
  inData = value.split(",");
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

