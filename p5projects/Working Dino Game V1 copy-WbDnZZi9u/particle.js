class Particle {
  constructor() {
    this.pwidth = 640;  
    this.pheight = random(270, 360); // Random y-position for spawning
    this.size = createVector(random(20, 35), random(20, 35)); // Random width & height
    this.color = color(random(255), random(255), random(255)); // Random color

    // Particle movement
    this.x = this.pwidth;  
    this.y = this.pheight; 
    this.speedX = particleSpeed; // Start with the global speed   
    this.speedY = 0;  
  }

  update() {
    // Move the particle
    this.x += this.speedX;
    this.y += this.speedY;
  }

  show() {
    fill(0);
    rect(this.x, this.y, this.size.x, this.size.y); // Draw single shape
    fill(this.color);
    rect(this.x + 2, this.y + 2, this.size.x - 4, this.size.y - 4); // Draw single shape
  }

  offScreen() {
    return this.x < 0;
  }
}
