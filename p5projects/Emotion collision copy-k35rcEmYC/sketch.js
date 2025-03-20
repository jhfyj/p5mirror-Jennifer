let particles = [];
let hexArray = [
  "##ace1ef",
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

function setup() {
  createCanvas(640, 800);
  for (let i = 0; i < 10; i++) {
    let x = random(width / 2 - 200, width / 2 + 200);
    let y = random(height / 2 - 150, height / 2 + 150);
    particles.push(new Particle(x, y));
  }
  ///////////////////API/////////////////////////
  feedback = createP("").style("text-align", "center");

    // Center the container div
    let container = createDiv();
    container.style("position", "absolute");
    container.style("top", "50%");
    container.style("left", "50%");
    container.style("transform", "translate(-50%, -50%)");
    container.style("text-align", "center");

    // Create the input field inside the container
    let input_field = createElement("textarea");
    input_field.id("input_prompt");
    input_field.size(450, 100); // Set width and height for the textarea
    input_field.parent(container);

    // Create the button inside the container
    let myButton = createButton("Enter");
    myButton.style('color', 'white');
    myButton.style('background-color', 'lightblue');
    myButton.style('width', '90px');
    myButton.style('height', '30px');
    myButton.style('margin-top', '10px'); // Add some spacing above the button
    myButton.parent(container); // Place the button inside the container
    myButton.mousePressed(() => {
        askForWords(input_field.value());
    });

    feedback.parent(container); // Place feedback below the button
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
}

////////////////////API////////////////////////////
async function askForWords(p_prompt) {
  document.body.style.cursor = "progress";
  feedback.html("Waiting for reply from API...");
  const data = {
    version: "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
    input: {
      prompt:
        "give me hex codes for html colors the reflect the emotions in this prompt: " +
        p_prompt +
        '. Please return the hex codes as json of the following structure: {"hexCodes": ["hex code 1", "hex code 2", "hex code 3"]} Don\'t return any text except for the JSON. Don\'t give an explaination after',
    },
  };
  console.log("Asking for Words From Replicate via Proxy", data);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  console.log("words url", replicateProxy, "words options", options);
  const words_response = await fetch(replicateProxy, options);
  //turn it into json
  const proxy_said = await words_response.json();
  console.log("words_json", proxy_said);
  console.log(proxy_said[0]);
  if (proxy_said.output.length == 0) {
    feedback.html("Something went wrong, try it again");
  } else {
    
    console.log(proxy_said);
    feedback.html("");
    console.log("proxy_said", proxy_said.output.join(""));
    let incomingText = proxy_said.output.join("");

    ////////////////////////////////////////////////////
   // Remove any non-JSON text by extracting the JSON part with regex
    let jsonMatch = incomingText.match(/\{.*\}/);
    if (jsonMatch) {
      try {
        // Parse the JSON string
        let JSONResponse = JSON.parse(jsonMatch[0]);

        // Extract hex codes array
        let hexCodes = JSONResponse.hexCodes;
        
        console.log("Hex codes from API:", hexCodes);

        // Ensure hexArray is updated with at least the first 3 hex codes
        if (hexCodes && hexCodes.length >= 3) {
          hexArray = hexCodes.slice(0, 3);
          console.log("Updated hexArray:", hexArray);
        }

            background(0);
        for (let i = 0; i < particles.length; i++) {
          particles[i].color = hexArray[i % hexArray.length];
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        feedback.html("There was an error parsing the JSON response.");
      }
    } else {
      console.error("No JSON found in the response");
      feedback.html("No valid JSON found in the API response.");
    }
  }
  document.body.style.cursor = "auto";
}