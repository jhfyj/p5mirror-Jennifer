var song;
var fft;

function preload(){
  song = loadSound('music.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  angleMode(DEGREES);
  song.pause();
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(4);
  noFill();
  translate(width/2, height/2)
  
  var wave = fft.waveform();
  
  for(var t = -1; t <= 1; t += 2){
    beginShape();
    for(var i = 0; i <=180; i ++  ){
    var index = floor(map(i, 0, 180, 0, wave.length-1));
    var r = map(wave[index], -1, 1, 250, 360)
    var x = r * sin(i) * t;
    var y = r * cos(i);
    vertex(x,y);
  }
  endShape();
  }
  

}

function mouseClicked(){
  if(song.isPlaying()) {
    song.pause()
      }else {
       song.play();
      }
  }