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
      if (this.life < 255) {
        this.life += 3;
      }
      if (this.life > 255) this.life = 255; // Cap life to max 255
    }

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

  checkOver1() {
    ///// for regular circles
    if (!this.fading) {
      this.fading = true; // Start fading when hovered over
      this.color1 = 137;
      this.color2 = 207;
      this.color3 = 240;

      playCount++;
        if (playCount % 5 === 0) {
            // Play the next laugh sound in order, cycling through the array
            const laughIndex = Math.floor(playCount / 5) % laugh.length; // Get the index based on playCount
            laugh[laughIndex].play(); // Play the laugh sound

            // Reset playCount after playing the fifth laugh
            if (laughIndex === laugh.length - 1) {
                playCount = 0; // Reset the counter after playing the last laugh
            }
        } else {
            // Change pitch for the other times
            soundFile.rate(pitches[Math.floor(Math.random() * pitches.length)]);
            soundFile.play();
        }
    }
}
  finished() {
    return this.life < 0; // Return whether the circle should be removed
  }

  displayLine(nextCircle) {
    stroke(255, 150); // Set line color and transparency
    line(this.x, this.y, nextCircle.x, nextCircle.y);
  }
}
