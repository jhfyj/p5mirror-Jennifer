let balls = []; // Array to store multiple balls

function setup() {
  createCanvas(400, 400);
  
  // Create multiple balls at the beginning
  for (let i = 0; i < 5; i++) {
    balls.push(new Ball(random(50, width - 50), random(50, height - 50), random(2, 5), random(2, 5)));
  }
}

function draw() {
  background(50);

  // Update and display all balls
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].display();
    
    // Check for collision with other balls
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j]);
    }
  }
}

// Ball class to handle each ball's properties and behavior
class Ball {
  constructor(x, y, speedX, speedY) {
    this.pos = createVector(x, y);
    this.vel = createVector(speedX, speedY);
    this.gravity = createVector(0, 0.3); // Gravity
    this.rad = 25; // Radius of the ball
  }

  update() {
    this.vel.add(this.gravity); // Apply gravity to velocity
    this.pos.add(this.vel); // Update position based on velocity

    // Ball collision with bottom edge
    if (this.pos.y > height - this.rad) {
      this.pos.y = height - this.rad;
      this.vel.y *= -0.9; // Bounce back with some energy loss
    }

    // Ball collision with left and right edges
    if (this.pos.x > width - this.rad || this.pos.x < this.rad) {
      this.vel.x *= -1; // Reverse horizontal velocity on collision
    }
  }

  display() {
    noStroke();
    fill(255, 100, 100); // Red balls
    ellipse(this.pos.x, this.pos.y, this.rad * 2); // Draw the ball
  }

  // Check for collision with another ball
  checkCollision(other) {
    let distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    
    // Check if the balls are overlapping (collision)
    if (distance < this.rad + other.rad) {
      // Get the direction of the collision
      let normal = p5.Vector.sub(other.pos, this.pos);
      normal.normalize();

      // Calculate relative velocity along the normal
      let relativeVel = p5.Vector.sub(this.vel, other.vel);
      let velocityAlongNormal = relativeVel.dot(normal);
      
      // If the balls are moving towards each other, apply collision response
      if (velocityAlongNormal < 0) {
        let restitution = 0.9; // Energy loss factor during collision (elasticity)
        
        // Calculate the impulse scalar
        let impulse = (2 * velocityAlongNormal) / (this.rad + other.rad);
        
        // Apply the impulse to both balls' velocities
        this.vel.sub(p5.Vector.mult(normal, impulse * other.rad * restitution));
        other.vel.add(p5.Vector.mult(normal, impulse * this.rad * restitution));
        
        // Move the balls apart to prevent them from sticking together
        let overlap = this.rad + other.rad - distance;
        let correction = normal.mult(overlap / 2);
        this.pos.sub(correction);
        other.pos.add(correction);
      }
    }
  }
}
