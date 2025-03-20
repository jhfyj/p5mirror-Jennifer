let seaData;
let csv;
let index = 1;
let currentSeaLevel = 0;

function preload(){
  csv = loadTable('sealevel.csv','csv','header');
}

function setup() {
  createCanvas(400, 400);
  seaData = csv.rows;
  setInterval(increaseIndex, 1000);
}

function draw() {
  background(220);
  
  
  currentSeaLevel = lerp(currentSeaLevel, seaData[index].obj.sealevel, 0.05);
  
  let h = map(currentSeaLevel, 0, 9.8, 0, 400);
  
  console.log(h);
  
  fill(200, 100, 100);
  noStroke();
  rectMode(CORNERS);
  rect(0, 400, 400, 400-h);
  
  fill(0, 0, 0);
  
  text(seaData[index].obj.Year, 0, 380);
  text(seaData[index].obj.sealevel + 'mm', 40, 380);
}

function increaseIndex(){
  index ++;
  if(index == seaData.length){
    index = 0;
  }
}

function mousePressed(){
  increaseIndex();
}