let drum;
let kick;
let beat;

function preload(){
  drum = loadSound("drum.mp3");
  kick = loadSound("kick.mp3");
  beat = loadSound("beat.mp3");

}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  if ((frameCount % 100) == 0){
    //for every 100 frame count play it once 
    kick.play();
  }
  if ((frameCount % 50) == 0){
    drum.play();
  }
  if ((frameCount % 125) == 0){
   // beat.play();
  }
}
