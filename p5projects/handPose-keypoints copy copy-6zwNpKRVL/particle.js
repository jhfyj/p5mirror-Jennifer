class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D();
    this.acc.mult(0.03);
    this.life = 255;
    this.done = false;
    this.hueValue = 0;
    this.color1 = 163;
    this.color2 = 212;
  }

  update() {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      //this.acc.x = this.acc.x * -1;
      this.vel.x = this.vel.x * -1;
    }

    if (this.pos.y <= 0 || this.pos.y >= height) {
      //this.acc.y = this.acc * -1;
      this.vel.y = this.vel.y * -1;
    }

    this.finished();

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.life -= 3;
  }
  display() {
    noStroke();
    //  let oscillation = sin(frameCount * 0.05); // Adjust speed by changing 0.05
    // let blueShade = map(oscillation, -1, 1, 255, 100); // Dark blue (50) to light blue (200)
    this.color1 += 1.5;
    this.color2 += 1.5;

    fill(this.color1, this.color2, 255, this.life); // RGB (0, 0, blueShade)
    ellipse(this.pos.x, this.pos.y, 8, 8);
  }

  finished() {
    if (this.life < 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }

  positionX() {
    return this.pos.x;
  }

  positionY() {
    return this.pos.y;
  }

  // Set a timeout to reset Speed to 1 after 3 seconds
}
