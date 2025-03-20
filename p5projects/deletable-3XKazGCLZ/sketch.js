const replicateProxy = "https://replicate-api-proxy.glitch.me"
let feedback;

function setup() {
    feedback = createP("");
    let input_field = createInput("Why should learn to use a machine learning API?");
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
        "version": "48df7b6affb51390d728da2372cb1cd19e5a89b59cbc86c2524420a67030c6cc",
        input: {
            prompt: "give me a hex number that represents the color of the emotion of this prompt:" + p_prompt,
        }
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
    const url = replicateProxy + "/create_n_get/"
    console.log("words url", url, "words options", options);
    const words_response = await fetch(url, options);
    //turn it into json
    const proxy_said = await words_response.json();
    console.log("words_json", proxy_said);
    if (proxy_said.output.length == 0) {
        feedback.html("Something went wrong, try it again");
    } else {
      
      console.log(proxy_said);
        // feedback.html("");
        // console.log("proxy_said", proxy_said.output.join(""));
        // let incomingText = proxy_said.output.join("");
        // createP(incomingText);
    }
    document.body.style.cursor = "auto";
}
