let video;
let bodyPose;
let poses = [];
let connections;
let previousY = null;
let previousKneeHipDistance = null;
let jumpDetected = false;
let rectY = 300;
let jump = 0;
let dodge = false;
let rheight;
let dodgeHeight = 30;
let inMotion = false; // Prevents both actions from happening simultaneously
let motionCooldown = 0; // Timer to prevent rapid actions

let particles = []; // Array to hold all Particle objects
let framecount = 0; // Counter to track time (in frames)
let gameOver = false; // Flag to track if the game is over
let jumpDone = false;
let isJumping = false; // Flag to track the entire jump cycle

let mountain;

let ground1, ground2;
let interval = 500; // Switch every 500ms
let lastSwitch = 0;
let showFirst = true;

function preload() {
  bodyPose = ml5.bodyPose();
  mountain = loadImage('/mountain.png');
  ground1 = loadImage('ground1.png');
  ground2 = loadImage('ground2.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
}

function draw() {
  if (gameOver) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    return; // Stop the game loop if it's over
  }

  image(video, 0, 0, width, height);
  background(123, 184, 255);
  image(mountain, 0, 0);
  fill(255);
  rect(0, 380, width, 180);
  
    if (millis() - lastSwitch > interval) {
    showFirst = !showFirst;
    lastSwitch = millis();
  }

  if (showFirst) {
    image(ground1, 0, 10, width, height);
  } else {
    image(ground2, 0, 10, width, height);
  }
// Reduce cooldown if active
  if (motionCooldown > 0) {
    motionCooldown--;
  }

  // Handle pose detection for jump and squat
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    if (pose.keypoints) {
      let hip = pose.keypoints[12]; // Right hip keypoint
      let knee = pose.keypoints[14]; // Right knee

      if (hip && knee && hip.confidence > 0.1 && knee.confidence > 0.1) {
        let currentKneeHipDistance = knee.y - hip.y;

        if (previousKneeHipDistance !== null && motionCooldown === 0) {
          let jumpThreshold = 20;
          let squatRatioThreshold = 0.905; 

          // Jump Detection (Only detect if NOT already jumping)
          if (previousY - hip.y > jumpThreshold && !isJumping && !dodge) {
            console.log("Jump Detected!");
            isJumping = true; // Start full jump cycle
            inMotion = true;
            motionCooldown = 120; // 2 seconds cooldown (assuming 60 FPS)
          }

          // Dodge Detection (Squat)
          if (currentKneeHipDistance < previousKneeHipDistance * squatRatioThreshold && !dodge && !isJumping) {
            console.log("Dodge Detected!");
            dodge = true;
          } else if (currentKneeHipDistance > previousKneeHipDistance * 1.05 && dodge) {
            console.log("Standing Up!");
            dodge = false;
            inMotion = false;
          }
        }

        previousY = hip.y;
        previousKneeHipDistance = currentKneeHipDistance;
      }
    }
  }

  // Handle rectangle position (jump & dodge logic)
  fill(0);
  noStroke();

  dodgeHeight = dodge ? 0 : 30;
  rheight = 50 + dodgeHeight;

  if (isJumping) {
    if (!jumpDone) {
      jump -= 1.3; // Move up
    }
    
    if (jump <= -90) {
      jumpDone = true; // Start falling
    }

    if (jumpDone) {
      jump += 1.3; // Move down

      if (jump >= 0) {
        jump = 0;
        jumpDone = false;
        isJumping = false; // Reset only when fully landed
        inMotion = false;
      }
    }
  }

  rectY = 300 + jump + (30 - dodgeHeight);
  rect(100, rectY, 50, rheight);

  // Generate new particles every 500 frames
  framecount++;
  if (framecount % 500 === 0) {
    createNewParticle();
  }
  
  updateAndShowParticles();
  checkCollisions();
}

// Function to handle new particle creation (synchronously)
function createNewParticle() {
  particles.push(new Particle()); // Add a new particle
}

function updateAndShowParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(); // Update position
    particles[i].show(); // Display particle

    // Remove off-screen particles
    if (particles[i].offScreen()) {
      particles.splice(i, 1);
    }
  }
}

function checkCollisions() {
  let rectX = 100;
  let rectBottom = rectY + rheight;
  let rectRight = rectX + 50; // The rectangle's width is 50

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Check if particle is within the rectangle's boundaries
    if (
      p.x >= rectX &&
      p.x <= rectRight &&
      p.y + 10 >= rectY &&
      p.y <= rectBottom
    ) {
      console.log("Game Over: Particle hit the rectangle!");
      gameOver = true;
      break;
    }
  }
}

// Particle Class

// Function to handle pose detection
function gotPoses(results) {
  poses = results;
}