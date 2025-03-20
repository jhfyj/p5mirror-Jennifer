// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA

let snake;
let rez = 20;
let food;
let w;
let h;
let r = 255;
let g = 0;
let b = 0;
let eraser;
let mousePress = false;
let Canvas;

function preload() {
  Canvas = loadImage('Canvas.png');
}

function setup() {
  createCanvas(600, 600);
  background(0);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();

  foodLocation();
  eraserLocation();

  saveButton = createButton("Save Design");
  saveButton.position(150, height + 10);
  saveButton.mousePressed(saveDesign);
  
  image(Canvas, 0, 0);
}

function foodLocation() {
  let x = floor(10);
  let y = floor(20);
  food = createVector(x, y);
}

function eraserLocation() {
  let x1 = floor(15);
  let y1 = floor(15);
  eraser = createVector(x1, y1);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  } else if (key == " ") {
    snake.grow();
  }
}

function draw() {
  scale(rez);
  translate(0.5, 0.5);

  if (snake.eat(food)) {
    snake.r = r;
    snake.g = g;
    snake.b = b;
    foodLocation();
    r = random(0, 255);
    g = random(0, 255);
    b = random(0, 255);
  } else if (snake.eat(eraser)) {
    snake.r = 255;
    snake.g = 255;
    snake.b = 255;
    eraserLocation();
  }
  snake.update();
  snake.show();
  noStroke();
  //////////////////////////////

  fill(0, 0, 0);
  rect(food.x, food.y, 1, 1);
  fill(r, g, b);
  rect(food.x, food.y, 0.9, 0.9);
  fill(snake.r, snake.g, b);
  rect(snake.body.x, snake.body.y, 0.9, 0.9);

  /////////////////////////////

  fill(0, 0, 0);
  rect(eraser.x, eraser.y, 1, 1);
  fill(255);
  rect(eraser.x, eraser.y, 0.9, 0.9);
}

function saveDesign() {
  fill(255);
  rect(eraser.x, eraser.y, 1, 1);
  fill(r, g, b);
  rect(food.x, food.y, 1, 1);
  
  for (let segment of snake.body) {
    fill(snake.r, snake.g, snake.b); // Use the snake's color
    rect(segment.x, segment.y, 1, 1);
  }
  saveCanvas("SnakeGame", "jpg");
}

function mousePressed() {
    snake.stop();
}
