class Attractor {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.points = [];
  }

  update() {
    let dx = sigma * (this.y - this.x) * dt;
    let dy = (this.x * (rho - this.z) - this.y) * dt;
    let dz = (this.x * this.y - beta * this.z) * dt;

    this.x += dx;
    this.y += dy;
    this.z += dz;

    let p = createVector(this.x, this.y, this.z);
    this.points.push(p);

    if (this.points.length > maxPoints) {
      this.points.shift();
    }
  }

  display() {
    strokeWeight(1);
    for (let i = 1; i < this.points.length; i++) {
      let a = map(i, 0, this.points.length, 0, 255);
      stroke(0, a);
      let prev = this.points[i - 1];
      let curr = this.points[i];
      line(prev.x, prev.y, prev.z, curr.x, curr.y, curr.z);
      // point(points[i].x, points[i].y, points[i].z);
    }

    let endpoint = this.points[this.points.length - 1];
    strokeWeight(6);
    point(endpoint.x, endpoint.y, endpoint.z);
  }
}
