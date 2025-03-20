let num = 30;
let size;
let margin = 30;
let scaleFactor = 3.27;
let snowPallete = ["#FFFFFF", "#CCE7FF", "#99D0FF", "#66B8FF", "#339FFF", "#0077FF", "#0055AA", "#003377"];
let band = 100;

let scaleSlider; 
let saveButton;


function setup() {
  createCanvas(400, 400);
  size = (width - margin * 2)/num;
  
  scaleSlider = createSlider(1.5, 2.5, 2, 0.1);
  scaleSlider.position(10, height + 10);
  scaleSlider.size(200);
  
  saveButton = createButton('Save Design');
  saveButton.position(220, height + 10);
  saveButton.mousePressed(saveDesign);
}

function draw() {
  background(0);
  noStroke();
  scaleFactor = scaleSlider.value();
  
  for(i = 0; i < num ; i ++){
    for(j =0; j < num; j ++){
      x = margin + size/2 + i * size;
      y = margin + size/2 + j * size;
      
      let distFromCenter = dist(x, y, width/2, height/2);
      let scaledDist = pow(distFromCenter, scaleFactor);
      let index = floor(map(scaledDist , 0, band, 0, snowPallete.length));
      let colorIndex = index % snowPallete.length

    
      fill(snowPallete[colorIndex]);
      ellipse(x, y, size, size);
    }
  }
}

function saveDesign(){
  saveCanvas('Snowflake', 'jpg');
}

