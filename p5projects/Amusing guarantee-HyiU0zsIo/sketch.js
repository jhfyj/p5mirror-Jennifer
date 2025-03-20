let unibaby;
let logo;
let x = 0;
let y = 0;
//this is important to declare it outside of this function

function preload(){
  //unibaby = loadImage("clapping.jpg");
  logo = loadImage("LOGO COLOR.png");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  x ++;
  y ++;
  //image(unibaby, x, y, 300, 230);
  image(logo, 0, 0);
  //fourth and fifth variables change the image to fit the canvas size. Compress or stretch
}