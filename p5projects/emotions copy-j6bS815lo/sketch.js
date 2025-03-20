const replicateProxy = "https://replicate-api-proxy.glitch.me";
let feedback;
let emotionsColor = "#FFFFFF"; // Default color for the circle

function setup() {
    createCanvas(600, 1000); // Create a canvas with a width of 600 and height of 1000
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
    background(220);
    fill(emotionsColor);
    circle(width / 2, height / 2 + 100, 100); // Draw the circle in the center of the canvas
}

async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    feedback.html("Waiting for reply from API...");
    
    const data = {
        "version": "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
        input: {
            prompt: "only give hex numbers that represent the color of the emotion of this prompt without any text before. Example: #FF5733 #00A86B #FFD700: " + p_prompt,
            max_tokens: 100,
            max_length: 100,
        },
    };

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    
    const url = replicateProxy + "/create_n_get/";
    const words_response = await fetch(url, options);
    const proxy_said = await words_response.text(); // Read the response as plain text

    // Use a regular expression to find all hex color codes in the plain text response
    let colorHexCodes = proxy_said.match(/#[A-Fa-f0-9]{6}/g); // Matches all hex color codes in the response

    if (colorHexCodes && colorHexCodes.length > 0) {
        emotionsColor = colorHexCodes[0]; // Use the first hex color found to set the circle color
        feedback.html("Received colors: " + colorHexCodes.join(", "));
    } else {
        feedback.html("No valid color hex codes found in the response.");
    }

    document.body.style.cursor = "auto";
}
