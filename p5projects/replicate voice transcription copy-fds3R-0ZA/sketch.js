const replicateProxy = "https://replicate-api-proxy.glitch.me";
const replicateProxy1 = "https://replicate-api-proxy.glitch.me/create_n_get/";
let img;
let feedback;
let transcription = ""; // Global variable to store transcription
let textOpacity = 0;
let colorstrue = false;
let colors = ["#FF0000", "#00FF00", "#0000FF"];
let startTime; // To store the start time
let ballsStartMoving = false; // To control when the balls start moving
let ballYPositions;
let elapsedTime;
let rectY;

function setup() {
  createElement("br");
  feedback = createP("");
  createElement("br");
  feedback.position(10, 90);
  let canvas = createCanvas(512, 512);
  canvas.position(0, 120);
  setupParticles(); // Initialize particles array
  setupAudio();
  ballYPositions = [height / 2, height / 2, height / 2]; // Initial positions of the balls
  rectY = height;
}

function draw() {
  background(0);
  if (img) image(img, 0, 0);

  textSize(40);
  textAlign(CENTER);
  textSize(20);
  fill(255, textOpacity);
  textWrap(WORD); // Wrap text at word boundaries
  text(transcription, width / 2 - 150, height / 2, 300);

  if (colorstrue && transcription) {
    textOpacity = constrain(textOpacity - 2, 0, 255);
    if (textOpacity <= 0) {
      for (let i = 0; i < 3; i++) {
        fill(colors[i]);
        circle(width / 2 - 80 + i * 80, ballYPositions[i], 40);
        
        setTimeout(() => {
        ballsStartMoving = true;
      }, 4000);
        
        if (ballsStartMoving) {
          ballYPositions[i] += 2;
          fill(40, 233, 211);
          rectMode(CENTER);
          
          if (rectY > 00){ 
          rectY --;
          }
          rect(width/2, rectY, 300, 100);

        }
      }
    }
  } else if (transcription) {
    textOpacity = constrain(textOpacity + 3, 0, 255);
  }

  if (colorstrue) {
    // Draw circles with specified colors
  }
}

// Function to initialize particles with default colors
function setupParticles() {
  particles = Array.from({ length: 10 }, () => ({ color: "#FFFFFF" }));
  console.log("Particles initialized:", particles);
}

async function askWithAudio(audio) {
  document.body.style.cursor = "progress";

  const b64Audio = await convertBlobToBase64(audio);
  feedback.html("Waiting for reply from Replicate Audio...");
  let data = {
    fieldToConvertBase64ToURL: "audio",
    fileFormat: "wav",
    version: "4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2",
    input: {
      audio: b64Audio,
    },
  };

  const url = replicateProxy + "/create_n_get/";
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const openAI_json = await response.json();
    transcription = openAI_json.output.transcription; // Store transcription globally
    console.log("Audio Response Transcription:", transcription);
    feedback.html(openAI_json.output.transcription);
    document.body.style.cursor = "auto";
  } catch (error) {
    console.error("Error in askWithAudio:", error);
    feedback.html("An error occurred while processing the audio.");
    document.body.style.cursor = "auto";
  }
}

async function convertBlobToBase64(audioBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsDataURL(audioBlob);
  });
}

async function askForWords() {
  document.body.style.cursor = "progress";

  const data = {
    version: "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
    input: {
      prompt:
        "give me hex codes for html colors that reflect the emotions in this prompt: " +
        transcription +
        "If the prompt is positive, give me bright and vibrant colors. And, if the prompt is negative or not appropriate, give me cool and dark toned color hex codes instead and do not give me bright or vibrant colors. If the prompt trigger nostalgia, please give the colors associated with the items, such as pink for strawberry ice cream. If the prompt contains emotions such as anger, please give red hex code. Always provide hexcodes in your ouput",
    },
  };

  console.log("Prompt Data Sent to API:", data);

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  const url = replicateProxy + "/create_n_get/";
  console.log("words url", url, "words options", options);
  const words_response = await fetch(url, options);
  //turn it into json
  const proxy_said = await words_response.json();
  console.log("words_json", proxy_said);
  if (proxy_said.output.length == 0) {
    feedback.html("Something went wrong, try it again");
  } else {
    feedback.html("");
    console.log("proxy_said", proxy_said.output.join(""));
    let incomingText = proxy_said.output.join("");
    const string = incomingText;
    const hexColors = findHexColor(string);
    colors = hexColors;
    colorstrue = true;
  }
  document.body.style.cursor = "auto";
}

// Helper function to extract hex colors from a string
function findHexColor(str) {
  const regex = /#[0-9a-fA-F]{6}/g;
  const matches = str.match(regex);
  return matches || [];
}

function setupAudio() {
  const audioContext = new AudioContext();
  let mediaStream;
  let mediaRecorder;

  const startButton = document.createElement("button");
  startButton.id = "start-recording";
  startButton.textContent = "Start Recording";
  startButton.style.position = "absolute";
  startButton.style.top = "50px";
  startButton.style.left = "10px";
  document.body.appendChild(startButton);

  const stopButton = document.createElement("button");
  stopButton.style.position = "absolute";
  stopButton.style.top = "50px";
  stopButton.style.left = "160px";
  stopButton.id = "stop-recording";
  stopButton.textContent = "Stop Recording";
  document.body.appendChild(stopButton);

  stopButton.addEventListener("click", function () {
    mediaRecorder.stop();
  });

  startButton.addEventListener("click", async function () {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let mrChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", (event) => {
      mrChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async function () {
      const recordedData = new Blob(mrChunks, { type: "audio/webm" });
      console.log("Recording stopped", recordedData);

      let av = document.createElement("VIDEO");
      let audioURL = window.URL.createObjectURL(recordedData);
      av.src = audioURL;
      av.width = 100;
      av.height = 20;
      document.body.appendChild(av);
      av.play();

      await askWithAudio(recordedData);
      askForWords(); // Ensure this is called after transcription
    });

    mediaRecorder.start();
    console.log("Recording started");
  });
}
