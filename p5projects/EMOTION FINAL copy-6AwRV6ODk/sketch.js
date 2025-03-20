let particles = [];
let hexArray = [
  "#ace1ef",
  "#f5aec6",
  "#c2f1c0",
  "#faf7c4",
  "#fdd5b6",
  "#efacac",
  "#c4b2f7",
  "#b2f7d3",
  "#b2dcf7",
];
const replicateProxy = "https://replicate-api-proxy.glitch.me/create_n_get/";
let feedback;
let currentColor = "#ffffff";
let container;
let fading = false;
let fadeOpacity = 1.0;

let myFont;
let myFont1;
let showText = false;
let firstTextOpacity;

function preload() {
  myFont = loadFont("Anja Eliane accent002.ttf");
  myFont1 = loadFont("Mermaid Swash Caps.ttf");
}

function setup() {
  createCanvas(1179 / 3, 1859 / 3);
  for (let i = 0; i < 10; i++) {
    let x = random(width / 2 - 200, width / 2 + 200);
    let y = random(height / 2 - 150, height / 2 + 150);
    particles.push(new Particle(x, y));
  }

  textFont(myFont);
  feedback = createP("").style("text-align", "center");

  container = createDiv();
  container.style("position", "absolute");
  container.style("top", "50%");
  container.style("left", "50%");
  container.style("transform", "translate(-50%, -50%)");
  container.style("text-align", "center");

  let input_field = createElement("textarea");
  input_field.style("font-family", "Anja Eliane accent002");
  input_field.id("input_prompt");
  input_field.size(260, 120);
  input_field.parent(container);

  let myButton = createButton("Enter");
  myButton.style("font-family", "Anja Eliane accent002");
  myButton.style("color", "white");
  myButton.style("background-color", "lightblue");
  myButton.style("width", "90px");
  myButton.style("height", "30px");
  myButton.style("margin-top", "10px");
  myButton.parent(container);
  myButton.mousePressed(() => {
    firstTextOpacity = 0;
    askForWords(input_field.value());
    fading = true;
    setTimeout(() => {
      showText = true;
    }, 2000);
  });
  
  
}

function draw() {
  background(197, 244, 255, 50);

  for (let i = 0; i < particles.length; i++) {
    let particleA = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let particleB = particles[j];
      particleA.collide(particleB);
    }
  }

  for (let particle of particles) {
    let currentColor = particle.color;
    particle.update();
    particle.edges();
    fill(currentColor);
    particle.show();
  }

  if (fading) {
    fadeOpacity -= 0.02;
    container.style("opacity", fadeOpacity);
    if (fadeOpacity <= 0) {
      container.hide();
      fading = false;
    }
  }

  textSize(40);
  textAlign(CENTER);
  fill(0, 0, 0, firstTextOpacity);
  textFont(myFont);
  textSize(20);
  text("DESCRIBE A MEMORY OF YOURS", width / 2, height / 2 - 150);
  text("IN ONE OR TWO SENTENCES", width / 2, height / 2 - 130);
  textSize(15);
  text("It can be anything, but be descriptive!", width / 2, height / 2 - 95);
  text("And how did it make you feel?", width / 2, height / 2 - 75);

  if (showText) {
    rectMode(CENTER);
    fill(197, 244, 255, 150);
    rect( width/2, height/2 - 50, 320, 260)
    firstTextOpacity -= 2;
    textSize(40);
    textAlign(CENTER);
    fill(0, 0, 0);
    text("Thank you!", width / 2, height / 2 - 100);
    textSize(14);
    text("We'll take good care of your memories!", width / 2, height / 2 - 60);
    textAlign(LEFT);
    text("The colors of these particles now", 60, height / 2 - 30);
    text("represent the colors of your emotions.", 60, height / 2 - 10);
    text("Now, pick the poms poms that fits", 60, height / 2 + 10);
    text("these colors, and place them inside", 60, height / 2 + 30);
    text("of the blue box!", 60, height / 2 + 50);
    
  }
}

async function askForWords(p_prompt) {
  document.body.style.cursor = "progress";
  const data = {
    version: "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
    input: {
      prompt:
        "give me hex codes for html colors the reflect the emotions in this prompt: " +
        p_prompt +
        '. Please return the hex codes as json of the following structure: {"hexCodes": ["hex code ", "hex code 2", "hex code 3"]} Don\'t return any text except for the JSON. Don\'t give an explanation after. Don\'t say anything else after the curly bracket',
    },
  };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  const words_response = await fetch(replicateProxy, options);
  const proxy_said = await words_response.json();

  if (proxy_said.output.length == 0) {
    feedback.html("Something went wrong, try it again");
  } else {
    let incomingText = proxy_said.output.join("");
    let jsonMatch = incomingText.match(/\{.*\}/);
    if (jsonMatch) {
      try {
        let JSONResponse = JSON.parse(jsonMatch[0]);
        let hexCodes = JSONResponse.hexCodes;
        if (hexCodes && hexCodes.length >= 3) {
          hexArray = hexCodes.slice(0, 3);
        }
        for (let i = 0; i < particles.length; i++) {
          particles[i].color = hexArray[i % hexArray.length];
        }
      } catch (error) {
        feedback.html("There was an error parsing the JSON response.");
      }
    } else {
      feedback.html("No valid JSON found in the API response.");
    }
  }
  document.body.style.cursor = "auto";
}
