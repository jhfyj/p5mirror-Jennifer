const replicateProxy = "https://replicate-api-proxy.glitch.me/create_n_get/"
let feedback;

function setup() {
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

}


async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    feedback.html("Waiting for reply from API...");
    const data = {
        "version": "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
        input: {
            prompt:  "give me hex codes for html colors the reflect the emotions in this prompt: " + p_prompt + ". Please return the hex codes as json of the following structure: {\"hexCodes\": [\"hex code 1\", \"hex code 2\", \"hex code 3\"]} Don't return any text except for the JSON. Don't give an explaination after"
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
       let JSONResponse = JSON.parse(incomingText);
      console.log(JSONResponse.hexCodes[0]);
        createP(incomingText);
    }
    document.body.style.cursor = "auto";
}
