const replicateProxy = "https://replicate-api-proxy.glitch.me/create_n_get/";
let feedback;
let emotionsColor = "#FFFFFF"; // Default color for the circle

function setup() {
    createCanvas(600, 1000); // Create a canvas with a width of 600 and height of 1000
    feedback = createP("");
    let input_field = createInput("A sunny day with friends on the grass");
    input_field.id("input_prompt");
    input_field.size(450);
    let myButton = createButton("AskWords");
    myButton.mousePressed(() => {
        askForWords(input_field.value());
    });
}

function draw() {
    background(220);
    fill(emotionsColor); // Set the circle's fill color to emotionsColor
    circle(width / 2, height / 2 + 100, 100); // Draw the circle in the center of the canvas
}

async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    feedback.html("Waiting for reply from API...");

    const data = {
        "version": "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
        input: {
            prompt: "give me hex codes for html colors that reflect the emotions in this prompt: " + p_prompt + ". Please return the hex codes as json. Please don't add a sentence before and after"
        },
    };

    console.log("Asking for Words From Replicate via Proxy", data);

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };

    console.log("words url", replicateProxy, "words options", options);
    const words_response = await fetch(replicateProxy, options);
    const proxy_said = await words_response.text(); // Get the response as text (not JSON)
    console.log("words_text", proxy_said);

    // Now that we have the raw text, check if it's in the correct format
    if (typeof proxy_said === "string" && proxy_said.trim()) {
        // Use a regular expression to find hex codes in the response text
        const hexCodeMatch = proxy_said.match(/#[A-Fa-f0-9]{6}/i); // Regex to find hex codes (case insensitive)

        if (hexCodeMatch && hexCodeMatch.length > 0) {
            emotionsColor = hexCodeMatch[0]; // Use the first hex code found
            feedback.html("Received color: " + emotionsColor); // Display the received color
        } else {
            feedback.html("No valid hex code found in the response.");
        }
    } else {
        feedback.html("The response is not in the expected format.");
    }

    document.body.style.cursor = "auto";
}
