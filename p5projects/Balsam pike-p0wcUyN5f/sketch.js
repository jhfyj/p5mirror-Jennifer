let osc; // Oscillator variable

function setup() {
  createCanvas(400, 400);
  
  // Create an oscillator
  osc = new p5.Oscillator('sine'); // Use 'sine', 'square', 'triangle', or 'sawtooth' waveforms
  osc.start(); // Start the oscillator
  osc.amp(0); // Set the initial amplitude to 0 (silence)
}

function draw() {
  background(220);
  textAlign(CENTER);
  text('Click to play a tone', width / 2, height / 2);
    // Set the frequency of the oscillator (in Hz)
  let freq = 440; // Frequency for the tone (A4)
  
  // Set the oscillator frequency and amplitude
  osc.freq(440);
}

