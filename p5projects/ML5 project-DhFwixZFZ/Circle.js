let pitches = [0.6853, 0.875, 1, 1.125, 1.359];

class Circle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.baseSize = size;
    this.size = size;
    this.color1 = 255; // Base color when hovering
    this.color2 = 255;
    this.color3 = 255;
    this.life = 1; // Start fully opaque
    this.fading = false;
  }

  display() {
    // Manage fading
    if (this.fading) {
      this.life -= 10; // Decrease life if fading
    } else {
      if (this.life <255){
      this.life += 3;}
      if (this.life > 255) this.life = 255; // Cap life to max 255
    }

    // Pulsating effect for size
    this.size = this.baseSize + sin(frameCount * 0.1) * 10;

    // Draw outer glow effect
    for (let i = 5; i > 0; i--) {
      fill(this.color1, this.color2, this.color3, this.life / (i * 2)); // Adjust opacity for glow
      noStroke();
      circle(this.x, this.y, this.size + i * 15); // Increase radius for glow
    }

    // Draw main circle
    fill(this.color1, this.color2, this.color3, this.life); // Use life for opacity
    circle(this.x, this.y, this.size);
  }

  checkOver() {
    if (!this.fading) {
      this.fading = true; // Start fading when hovered over
      this.color1 = 137;
      this.color2 = 207;
      this.color3 = 240;

      let randomPitches = pitches[Math.floor(Math.random() * pitches.length)]; // Choose a new random item each time
      let pitchValue = randomPitches;
      soundFile.rate(pitchValue);
      soundFile.play(); // Play the sound
    }
  }

  finished() {
    return this.life < 0; // Return whether the circle should be removed
  }
}
