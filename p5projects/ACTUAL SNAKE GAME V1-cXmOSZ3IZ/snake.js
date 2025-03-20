class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.body[1] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
    this.r = 0; // Default color
    this.g = 0; // Default color
    this.b = 0; // Default color
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    head.x += this.xdir;
    head.y += this.ydir;

    if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h) {
      this.xdir = 0;
      this.ydir = 0;
      return; // Exit the function to prevent further updates
    }
    this.body.shift();
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x == pos.x && y == pos.y) {
      this.colorUpdate();
      return true;
    }
    return false;
  }

  colorUpdate() {
    this.r = 255;
    this.g = 0;
    this.b = 255;
  }
  
    stop(){
    this.xdir = 0;
    this.ydir = 0;
    return; // Exit the function to prevent further updates
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      if (i === 1) {
        // This is the head of the snake
        rectMode(CENTER);
        fill(0,0,0);
        rect(this.body[i].x, this.body[i].y, 1, 1);
        fill(this.r, this.g, this.b);

        rect(this.body[i].x, this.body[i].y, 0.93, 0.93);
      } else if(i===0){
        rectMode(CENTER);
        fill(this.r, this.g, this.b);
        noStroke();
        rect(this.body[i].x, this.body[i].y, 1, 1);
      }

    }
  }
}
