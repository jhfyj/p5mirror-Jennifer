/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */



/*
*
* PoseNet - Trained on Full Body poses - meaning points should be more 
* stable if you have your full body in the frame 
*
* You should test how far user should be away from the camera
*
* Poses do not have ids! So you can not track were a person moves, 
* person 1 and person 2 data can swap randomly 
* 
* Check lighting conditions, low lighting could result in less stable 
* pose detection
* 
* fun trick you can get approx distance of person from camera by calculating 
* the distance between the left eye and the right eye.
* remember to remove console output to speed up rendering
*
*/



let video;
let bodyPose;
let poses = [];
let connections;
let frameArray = [];
 let Rcolor1 = 50;
 let Gcolor1 = 50;
let Bcolor1 = 50;



function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);
  stroke(255, 255, 255);
  
  
  
  // get the approx dist from the camera by calculating the distance 
  // between the eyes. 
  for (let i = 0; i < poses.length; i++) {
    let leye = poses[i].left_eye;
    let reye = poses[i].right_eye;
    d = dist(leye.x, leye.y, reye.x, reye.y);
    fill(Rcolor1, Gcolor1, Bcolor1);
    stroke(Rcolor1, Gcolor1, Bcolor1);
    ellipse(poses[i].nose.x, poses[i].nose.y, 20);  
    
    // if(d > 25) {
    //   // console.log('move')
    //   stroke(0, 0, 0);
    //   strokeWeight(2);
    //   textSize(30);
    //   text("move further from camera", 150, 30)
    // }
  }
  
  //if we have 2 people we can id them by left and right people
  // by comparing nose x coordinates 
  
  if(poses.length > 1) {
  let leye1 = poses[0].left_eye;
  let reye1 = poses[0].right_eye;
  let leye2 = poses[1].left_eye;
  let reye2 = poses[1].right_eye;

  // Calculate the inter-eye distance for each person
  let eyeDistance1 = Math.abs(leye1.x - reye1.x);
  let eyeDistance2 = Math.abs(leye2.x - reye2.x);
    
    
  let person1heartX = (poses[0].left_shoulder.x - poses[0].right_shoulder.x)/2;
    console.log(person1heartX);
    
  //------------------------------------------
    
  let xDistance = Math.abs(poses[0].nose.x - poses[1].nose.x);
  let yDistance = Math.abs(poses[0].nose.y - poses[1].nose.y);
  let zDistance = eyeDistance1 / eyeDistance2;
    
  Rcolor1 = map(xDistance, 0, 620, 50, 255);
  Gcolor1 = map(yDistance, 0, 620, 50, 255);
  Bcolor1 = map(zDistance, 0, 8, 50, 255); //double check on this
  fill(Rcolor1, Gcolor1, Bcolor1);
    
    
    line(
(poses[0].left_shoulder.x + poses[0].right_shoulder.x)/2,(poses[0].left_shoulder.y + poses[0].right_shoulder.y)/2,(poses[1].left_shoulder.x + poses[1].right_shoulder.x)/2,(poses[1].left_shoulder.y + poses[1].right_shoulder.y)/2
    );
      
  }

  // Draw the skeleton connections
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      

      
      
      // Only draw a line if both points are confident enough
      if (pointA.confidence > 0.5 && pointB.confidence > 0.5) {
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }
  

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        // fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
              let personheartX = (poses[i].left_shoulder.x + poses[i].right_shoulder.x)/2;
    let personheartY = (poses[i].left_shoulder.y + poses[i].right_shoulder.y)/2;
    
    ellipse(personheartX, personheartY, 20);
    
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  
  // console.log('results: ', results)
  // Save the output to the poses variable
  poses = results;
  
}



// a data smoothing function 

// function getSmoothCoord(coord, frameArray) {
//     // the first time this runs we add the current x to the array n       number of times
//     if (frameArray.length < 1) {
//       for (let i = 0; i < this.smoothAmt; i++) {
//         frameArray.push(coord);
//       }
//       // every other time it runs we update only the most recent value in the array
//     } else {
//       frameArray.shift(); // removes first item from array
//       frameArray.push(coord); // adds new x to end of array
//     }
//     // add all the x values
//     let sum = 0;
//     for (let i = 0; i < frameArray.length; i++) {
//       sum += frameArray[i];
//     }
//     // return the average
//     return sum / frameArray.length;
//   }
// }