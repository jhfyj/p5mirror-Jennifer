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

function setup() {
  createCanvas(400, 400);
  background(220);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  
  foodLocation();
  
  saveButton = createButton("Save Design");
  saveButton.position(150, height + 10);
  saveButton.mousePressed(saveDesign);
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
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
  }
  snake.update();
  snake.show();

  noStroke();
  fill(0,0,0);
  rect(food.x, food.y, 1, 1);
  fill(r, g, b);
  rect(food.x, food.y, 0.9, 0.9);
}

function saveDesign() { 
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

