let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;
let drawX = window.innerWidth / 4;
let drawY = window.innerHeight / 4;
let drawWidth = 100;
let drawHeight = 100;

// blob

// organic is used to store the list of instances of Organic objects that we will create
var organics = [];
// The variable change stores the rate of rotation and the y coordinate for noise later
var change, colorsPalette;

class Organic {
  constructor(radius, xpos, ypos, roughness, angle, color) {
    this.radius = radius; //radius of blob
    this.xpos = xpos; //x position of blob
    this.ypos = ypos; // y position of blob
    this.roughness = roughness; // magnitude of how much the circle is distorted
    this.angle = angle; //how much to rotate the circle by
    this.color = color; // color of the blob
    this.alpha = 0;
    this.fadeIn = true;

    this.show = function (change) {
      noStroke(); // no stroke for the circle

      //strokeWeight(0.1); //We can use this to set thickness of the stroke if necessary
      // stroke(200); //We can use this to set the color of the stroke if necessary

      //if (this.alpha < 100) {
      //this.alpha += 0.1;
      //}
      //this.color.setAlpha(this.alpha);

      if (this.fadeIn) {
        this.color.setAlpha(
          this.alpha < 200 ? (this.alpha += 0.5) : this.alpha
        );
      } else {
        this.color.setAlpha(this.alpha > 0 ? (this.alpha -= 0.2) : this.alpha);
      }

      console.log(this.alpha);

      fill(this.color); //color to fill the blob

      push(); //we enclose things between push and pop so that all transformations within only affect items within
      translate(2 * drawX, 2 * drawY); //move to xpos, ypos
      rotate(this.angle + change); //rotate by this.angle+change
      beginShape(); //begin a shape based on the vertex points below

      //The lines below create our vertex points
      var off = 0;
      for (var i = 0; i < TWO_PI; i += 0.1) {
        var offset = map(
          noise(off, change),
          0,
          1,
          -this.roughness,
          this.roughness
        );
        var r = this.radius + 0.9 * drawHeight + offset;
        var x = r * cos(i);
        var y = r * sin(i);
        vertex(x, y);
        off += 0.1;
      }
      endShape(); //end and create the shape
      pop();
    };
  }
}

// end blob

function setup() {
  frameRate(12);
  pixelDensity(1);
  let canvas = createCanvas(windowW, windowH, P2D);
  canvas.id("p5canvas");

  //Create data element after creating the canvas
  //This is necessary because the canvas element is retrieved within the data class
  data = new Data();

  // blob
  //createCanvas(800, 800);
  background(85, 85, 85);
  change = 0;
  colorsPalette = [color(0, 127, 201), color(253, 98, 70), color(70, 68, 158)];

  for (var i = 0; i < 90; i++) {
    organics.push(
      new Organic(
        0.1 + 1 * i,
        width / 1,
        height / 1,
        i * 2, // default is * 1
        i * random(90), // default is 90
        colorsPalette[floor(random(3))]
      )
    );
  }
  // end blob
}

function draw() {
  data.update();
  background(58, 58, 58);

  //image(data.output.video, 0, 0); //This has no purpose in the data collection- so this could be turned off

  if (data.output.expressions) {
    let count = 0;
    fill(255);
    textSize(32);
    // console.log(data.output.expressions);

    if (data.output.faceDimensions) {
      // noFill();
      stroke(255, 0, 0);
      // rect(
      //   data.output.faceDimensions.x,
      //   data.output.faceDimensions.y,
      //   data.output.faceDimensions.w,
      //   data.output.faceDimensions.h
      // );

      if (
        data.output.faceDimensions.x > 0 ||
        data.output.faceDimensions.y > 0
      ) {
        let newX =
          data.output.faceDimensions.x + data.output.faceDimensions.w / 2;
        let newY =
          data.output.faceDimensions.y + data.output.faceDimensions.h / 2;

        drawWidth = data.output.faceDimensions.w;
        drawHeight = data.output.faceDimensions.h;

        drawX = lerp(drawX, newX, 0.5);
        drawY = lerp(drawY, newY, 0.5);
      }
    }

    for (let {} in data.output.expressions) {
      //loop through the data object
      count++;
      // text(
      //   Object.keys(data.output.expressions)[count - 1],
      //   50,
      //   windowH - 50 * count
      // ); //write object key on the screen
    }

    let emotion = Object.keys(data.output.expressions)[0];
    let newColor = null;

    switch (emotion) {
      case "neutral":
        newColor = color(224, 227, 226);
        break;
      case "happy":
        newColor = color(0, 127, 201);
        break;
      case "angry":
        newColor = color(253, 98, 70);
        break;
      case "disgusted":
        newColor = color(195, 237, 45);
        break;
      case "surprised":
        newColor = color(70, 68, 158);
        break;
      case "sad":
        newColor = color(85, 85, 85);
        break;
      case "fearful":
        newColor = color(0, 0, 0);
        break;
      default:
        newColor = color(0, 127, 201);
      // code block
    }

    //console.log(newColor);

    let rand = Math.floor(Math.random() * organics.length);
    organics[rand].color = newColor;
    organics[rand].fadeIn = !organics[rand].fadeIn;
  }

  // blob
  for (var i = 0; i < organics.length; i++) {
    // organics[i].radius = drawHeight;
    organics[i].show(change);
  }

  //translate(drawX, drawY);

  change += 0.05;
  // end blob
}
