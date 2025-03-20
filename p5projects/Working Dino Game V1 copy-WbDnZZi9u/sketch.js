let video;
let bodyPose;
let poses = [];
let connections;
let previousY = null;
let previousKneeHipDistance = null;
let jumpDetected = false;
let rectY = 300;
let velocityY = 0; // Vertical velocity
let gravity = 0.2; // Simulating gravity
let jumpStrength = -10; // Initial jump velocity
let dodge = false;
let rheight;
let dodgeHeight = 30;
let inMotion = false; 
let motionCooldown = 0; 
let particles = []; 
let framecount = 0;
let gameOver = false; 
let isJumping = false; 

let mountain;
let cloud1, cloud2;
let ground1, ground2;
let interval = 500;
let lastSwitch = 0;
let showFirst = true;
let gameStarted = false; 
let isCentered = false;
let paused = false; 
let jumpNoise;
let rectTop = 0;
let endgamesound;

let particleSpeed = -1; // Starting speed
let speedIncreaseRate = 0.0005; // Rate at which speed increases
let cloud1x = 20;
let cloud2x = 400;
let rectr;
let rectg;
let rectb;


function preload() {
  bodyPose = ml5.bodyPose();
  mountain = loadImage("/mountain.png");
  ground1 = loadImage("ground1.png");
  ground2 = loadImage("ground2.png");
  jumpNoise = loadSound("jump.mp3");
  endgamesound = loadSound("endgame.mp3");
  cloud1 = loadImage("cloud1.png");
  cloud2 = loadImage("cloud2.png");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  rectb = random(0, 255);
  rectg = random(0, 255);
  rectr = random(0, 255);
}

function draw() {
  if (!gameStarted) {
    checkPlayerCentered();
    image(video, 0, 0, width, height);
    fill(255);
    noStroke();
    rect(width/2 - 300, height/2 - 20, 600, 70)
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Stand with your head in the center to start", width / 2, height / 2);
    textSize(20);
    text("Jump and dodge the incoming particles!", width / 2, height / 2 + 30);
    noFill();
    stroke(0);
    strokeWeight(4);
    circle(width / 2, 100, 60);
    return;
  }

  if (gameOver) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    return;
  }

  if (!isCentered) {
    paused = true;
    Recenter();
    return;
  }
  
  paused = false;

  video.hide();
  background(123, 184, 255);
  image(mountain, 0, 0);
  
  cloud1x --;
  cloud2x --;
  if(cloud1x <= -200 && cloud2x <= 260){
    cloud1x = 640;
  }
  
    if(cloud2x <=-200 && cloud1x <= 260){
    cloud2x = 640;
  }
  
  image(cloud1, cloud1x, 50);
  image(cloud2, cloud2x, 80);
  
  
  
  
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

  if (motionCooldown > 0) {
    motionCooldown--;
  }

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    if (pose.keypoints) {
      let pose = poses[0];
      let head = pose.keypoints[0];
      let headY = head.y;

      if (head) {
        if (motionCooldown === 0) {
          if (headY <= 40 && !isJumping && !dodge) {
            console.log("Jump Detected!");
            jumpNoise.play();
            isJumping = true;
            velocityY = jumpStrength; // Apply jump velocity
            inMotion = true;
            motionCooldown = 120;
          }

          if (headY >= 180 && !dodge && !isJumping) {
            console.log("Dodge Detected!");
            dodge = true;
          } else if (headY <= 130 && dodge) {
            console.log("Standing Up!");
            dodge = false;
            inMotion = false;
          }
        }
      }
    }
  }

  fill(0);
  noStroke();

  dodgeHeight = dodge ? 0 : 30;
  rheight = 50 + dodgeHeight;

  // Apply gravity and movement
  velocityY += gravity;
  rectY += velocityY;

  // Ground collision
  if (rectY >= 300) {
    rectY = 300;
    velocityY = 0;
    isJumping = false;
    inMotion = false;
  }
  
rectTop = rectY + (30 - dodgeHeight);
  fill(rectr, rectg, rectb);
  rect(100, rectTop, 50, rheight);

  framecount++;
  if (framecount % 500 === 0) {
    createNewParticle();
  }

  updateAndShowParticles();
  checkCollisions();
}

function createNewParticle() {
  particles.push(new Particle());
}

function updateAndShowParticles() {
  particleSpeed -= speedIncreaseRate;
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].speedX = particleSpeed; // Apply speed to all particles
    particles[i].update();
    particles[i].show();
    if (particles[i].offScreen()) {
      particles.splice(i, 1);
    }
  }
}

function checkCollisions() {
  let rectX = 100;
  let rectBottom = rectY + rheight;
  let rectRight = rectX + 50;

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    if (p.x >= rectX && p.x <= rectRight && p.y + 10 >= rectTop && p.y <= rectBottom) {
      endgamesound.play();
      console.log("Game Over: Particle hit the rectangle!");
      gameOver = true;
      break;
    }
  }
}

function checkPlayerCentered() {
  if (poses.length > 0) {
    let pose = poses[0];
    let head = pose.keypoints[0];
    let feet = pose.keypoints[15];
    let headY = head.y;
    let headX = head.x;

    if (head && feet) {
      if (headY >= 90 && headY <= 110 && headX >= width / 2 - 10 && headX < width / 2 + 10) {
        isCentered = true;
        gameStarted = true;
      }
    }
  }
}

function gotPoses(results) {
  poses = results;
}

function Recenter() {
  video.show();
  image(video, 0, 0, width, height);
  fill(0);
  textSize(24);
  noStroke();
  textAlign(CENTER, CENTER);
  text("Stand with your head in the center to continue", width / 2, height / 2);
  noFill();
  strokeWeight(4);
  stroke(0);
  circle(width / 2, 100, 60);

  if (poses.length > 0) {
    let pose = poses[0];
    let head = pose.keypoints[0];
    let feet = pose.keypoints[15];
    let headY = head.y;
    let headX = head.x;

    if (head && feet) {
      if (headY >= 90 && headY <= 110 && headX >= width / 2 - 10 && headX < width / 2 + 10) {
        isCentered = true;
        paused = false;
      }
    }
  }
}
