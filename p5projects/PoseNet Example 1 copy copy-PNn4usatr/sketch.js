// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let pose2; 
let skeleton;
let skeleton2;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    // make sure to comment out print statements to improvement performance
    // print("length: ", poses.length)
    // print(poses)
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if(poses.length > 1) {
      pose2 = poses[1].pose;
      skeleton2 = poses[1].skeleton;
    }
    else {
      pose2 = null;
      skeleton2 = null;
    }
  }
  else {
    pose = null;
    skeleton = null; 
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);
  
  // draw person 1 - red 
  if (pose) {
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, 50);
  }
  // draw person 2 - green 
  if(pose2) {
    fill(0, 255, 0);
    ellipse(pose2.nose.x, pose2.nose.y, 50);
  }
  
}