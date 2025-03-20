/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let quadMap0,
  quadMap1,
  quadMap2,
  quadMap3,
  quadMap4,
  quadMap5,
  quadMap6,
  quadMap7;

let img;

function preload() {
  img = loadImage("assets/catnap.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // create mapper object
  pMapper = createProjectionMapper(this);
  
  quadMap0 = pMapper.createQuadMap(400, 400);
  quadMap1 = pMapper.createQuadMap(400, 400);
  quadMap2 = pMapper.createQuadMap(400, 400);
  quadMap3 = pMapper.createQuadMap(400, 400);
  quadMap4 = pMapper.createQuadMap(400, 400);
  quadMap5 = pMapper.createQuadMap(400, 400);
  quadMap6 = pMapper.createQuadMap(400, 400);
  quadMap7 = pMapper.createQuadMap(400, 400);
  
  
  // loads calibration in the "maps" directory
  pMapper.load("maps/map.json");
}

function draw() {
  background(0);

  quadMap0.displayTexture(img);
  quadMap1.displayTexture(img);
  quadMap2.displayTexture(img);
    quadMap3.displayTexture(img);
    quadMap4.displayTexture(img);
    quadMap5.displayTexture(img);
    quadMap6.displayTexture(img);
    quadMap7.displayTexture(img);







}

function drawCoords(pg) {
  pg.clear();
  pg.push();
  pg.background(0, 255, 0);
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
      pMapper.load("maps/map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
