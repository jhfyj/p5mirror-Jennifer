/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let quad0, quad1, quad2, quad3, quad4, quad5, quad6, quad7; // my quad surfaces
let myVideo;
let videoPlaying = false;

let myFont;
let myImage;

//dataset related variables:
let seaData;
let seaDataIndex = 100;
let prevMillis = 0;
let interval = 2000;
let currentDataPoint = 60;

function preload() { // load images, fonts and videos
  myImage = loadImage("sea1.png");
  myFont = loadFont("assets/Roboto.ttf");
  myVideo = createVideo('water2.mp4'); 
  seaData = loadTable('sealevel.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);

  // create mapper object
  pMapper = createProjectionMapper(this);

  quad0 = pMapper.createQuadMap(400, 400);
  quad1 = pMapper.createQuadMap(400, 400);
  quad2 = pMapper.createQuadMap(200, 700);
  quad3 = pMapper.createQuadMap(400, 400);
  quad4 = pMapper.createQuadMap(400, 400);
  quad5 = pMapper.createQuadMap(400, 400);
  quad6 = pMapper.createQuadMap(400, 400);

  // loads calibration in the "maps" directory
  pMapper.load("map.json");
  myVideo.hide(); // hide the video element
}

function draw() {
  background(0);

  quad0.displaySketch(playVideo);
  quad1.displayTexture(myImage);// display a still image
  quad2.display(color('blue'));
  quad4.display(color('orange'));
  
  quad3.displaySketch(waterLevel);
  quad5.displaySketch(waterLevel);
  quad6.display(color('blue'));
  //quad0.displaySketch(mySketch);
  //quad0.displayTexture(myImage);
  //quad0.displaySketch(playVideo);
}

function mySketch(pg){
  pg.clear();
  pg.push();
  // your sketch goes between push and pop. remember to use the 'pg.' prefix for all p5 functions
  pg.background(color('white'));
  pg.textFont(myFont);
  pg.textAlign(CENTER,CENTER);
  pg.textSize(70);
  pg.fill(color('black'));
  pg.text('hello world',200,175);
  // ends here
  pg.pop();
}

function playVideo(pg){
  pg.clear();
  pg.push();
  if(videoPlaying == false){
    pg.background(255);
    pg.fill(0);
    pg.textAlign(CENTER,CENTER);
    pg.textSize(30);
    pg.text("click to start video",200,200);
  } else {
    pg.image(myVideo,0,0,400,400);
  }
  pg.pop();
}

function waterLevel(pg){
  pg.clear();
  pg.push();
  // your mini sketch goes here!
  
  pg.background(255);
  
  if(millis()>(prevMillis+interval)){
    seaDataIndex++;
    prevMillis = millis();
    if(seaDataIndex == seaData.rows.length){
      seaDataIndex = 0;
    }
  }
  
  pg.rectMode(CORNERS);
  
  currentDataPoint = lerp(currentDataPoint, seaData.rows[seaDataIndex].obj.sealevel, 0.1);
  
  
  let h = map(currentDataPoint,0,12,0,400);
  pg.fill(0,0,255);
  pg.rect(0,400,400,(400-h));
  pg.fill(255);
  pg.textSize(25);
  pg.textAlign(CENTER,CENTER);
  pg.text(currentDataPoint.toFixed(2)+" inches",200,(400-h)+25);
  
  // and ends here!
  pg.pop();
}

function waterYear(pg){
    pg.clear();
    pg.push();
      pg.background(0,0,255);
      pg.textSize(100);
      pg.fill(255);
      pg.textFont(myFont);
      pg.textAlign(CENTER,CENTER);
      pg.text(seaData.rows[seaDataIndex].obj.Year,200,100);
    pg.pop();
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 15, -height / 2 + 50);
}

function mousePressed(){ // videos need to start on click
  videoPlaying = true;
  myVideo.loop();
}