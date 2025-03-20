let handPose;
let video;
let hands = [];
let painting;
let px = 0;
let py = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  painting = createGraphics(640, 480);
  painting.clear();
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    painting.fill(255, 0, 255);
    painting.noStroke();
    let x = (index.x + thumb.x)/2
    let y = (index.y + thumb.y)/2;
    
    let d = dist(index.x, index.y, thumb.x, thumb.y);
    
    if(d < 20){
      painting.stroke(0, 0, 255);
      painting.strokeWeight(8);
      painting.line(px, py, x, y);
    }
    px = x;
    py = y;
  }
  image(painting, 0, 0);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
